from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

# Importamos tu clase de seguridad que ya estaba perfecta
from security_analyzer import SecurityAnalyzer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CodeGuard_API")

app = FastAPI(
    title="CodeGuard AI API",
    description="API REST para auditoría de código con IA",
    version="1.0.0"
)

# Configuración CORS (CRÍTICO: Permite que Vercel/React se comunique con este backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción estricta, aquí pondrías la URL de tu Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Definimos cómo debe ser el JSON que nos envíe React
class AuditRequest(BaseModel):
    code: str

@app.get("/")
def read_root():
    return {"status": "online", "message": "CodeGuard AI API is running"}

@app.post("/api/audit")
async def audit_code(request: AuditRequest):
    """Endpoint principal que recibe el código de React y devuelve el análisis."""
    try:
        analyzer = SecurityAnalyzer()
        
        # Validar entrada vacía
        if not request.code.strip():
            raise HTTPException(status_code=400, detail="El código no puede estar vacío")
            
        result = analyzer.analyze(request.code)
        
        if not result:
            raise HTTPException(status_code=500, detail="Error en el análisis de la IA")
            
        return result
        
    except ValueError as ve:
        logger.error(f"Error de configuración: {ve}")
        raise HTTPException(status_code=500, detail="Error interno del servidor (API Key faltante)")
    except Exception as e:
        logger.error(f"Error inesperado: {e}")
        raise HTTPException(status_code=500, detail=str(e))