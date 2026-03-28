/**
 * CodeGuard AI - Home Page
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuditResults from "@/components/AuditResults";
import CodeEditor from "@/components/CodeEditor";
import CompactFeatureShowcase from "@/components/CompactFeatureShowcase";

export type Severity = "critical" | "high" | "medium" | "low";

export interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: string;
  line?: number;
  recommendation: string;
  solutionCode?: string;
}

export default function Home() {
  const [code, setCode] = useState("");
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setHasAnalyzed(true);

    try {
      // Simulamos llamada a API (FastAPI)
      const response = await fetch("http://localhost:8000/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: code, language: "Python" }),
      });

      if (!response.ok) {
        throw new Error("Error conectando con el motor de IA (FastAPI)");
      }

      const data = await response.json();

      const severityMap: Record<string, Severity> = {
        Critical: "critical",
        High: "high",
        Medium: "medium",
        Low: "low",
        Mismatch: "low",
      };

      const riskLevel = data.risk_level || "Medium";
      const mappedSeverity = severityMap[riskLevel] || "medium";

      // Mapeamos respuesta real de FastAPI a estructura del front
      const newFinding: AuditFinding = {
        id: "genai-result-1",
        title: data.vulnerability || "Vulnerabilidad detectada",
        description: data.details || "Detalles no disponibles.",
        severity: mappedSeverity,
        category: "Análisis IA",
        recommendation: data.explanation || "Revisa el código para corregir la vulnerabilidad.",
        solutionCode: data.solution_code || "// Gemini no proporcionó código de solución.",
      };

      setFindings([newFinding]);

    } catch (error) {
      console.error("Error en la auditoría:", error);
      // Fallback para pruebas si FastAPI no está corriendo
      setFindings([{
        id: "error",
        title: "Error de Conexión",
        description: "No se pudo contactar con el servidor FastAPI en el puerto 8000.",
        severity: "critical",
        category: "System",
        recommendation: "Asegúrate de que uvicorn main:app --reload está corriendo en otra terminal.",
      }]);
    } finally {
      setIsAnalyzing(false);
      
      // Scroll suave a resultados
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    }
  };

  const handleClear = () => {
    setCode("");
    setFindings([]);
    setHasAnalyzed(false);
  };

  const stats = {
    total: findings.length,
    critical: findings.filter((f) => f.severity === "critical").length,
    high: findings.filter((f) => f.severity === "high").length,
    medium: findings.filter((f) => f.severity === "medium").length,
    low: findings.filter((f) => f.severity === "low").length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b border-border/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <span className="text-lg font-bold">CodeGuard AI</span>
          </div>
          <div className="text-xs text-muted-foreground">Enterprise Security Audit</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Real-time Code
              <br />
              <span className="gradient-text">Security Audits</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              Powered by advanced AI analysis, CodeGuard identifies vulnerabilities,
              security risks, and best practice violations instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              onClick={() => {
                editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Start Auditing <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-2xl blur-3xl" />
            <div className="relative bg-card/40 border border-border/30 rounded-2xl p-8 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="space-y-2 font-mono text-sm text-muted-foreground">
                  <div>
                    <span className="text-accent">def</span> authenticate(user):
                  </div>
                  <div className="pl-4">
                    query = <span className="text-green-400">"SELECT * FROM users"</span>
                  </div>
                  <div className="pl-4 text-red-400/70">
                    # ⚠️ SQL Injection Risk
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase Section */}
      <section className="container py-12 md:py-16 flex justify-center">
        <div className="max-w-2xl w-full">
          <CompactFeatureShowcase />
        </div>
      </section>

      {/* Workspace Section */}
      <section ref={editorRef} className="container py-20 md:py-32 space-y-12">
        <div className="text-center space-y-4 mb-16 shrink-0">
          <h2 className="text-4xl md:text-5xl font-bold">Code Guard</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Paste your code on the left for AI analysis. Detailed security insights will appear instantly on the right.
          </p>
        </div>

        {/* 🛠️ GRID PRINCIPAL CORREGIDO (Altura fija en LG) 🛠️ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start lg:h-[750px]">
          
          {/* COLUMNA IZQUIERDA: Editor (ESTRUCTURA RAÍZ) */}
          <div className="space-y-8 flex flex-col h-full">
            {/* 1. Título Fijo */}
            <h3 className="lg:text-left text-center text-xl font-semibold px-2 mb-2 shrink-0">Code Input</h3>
            
            {/* 2. Contenido expandible (Editor) */}
            <div className="flex-1 min-h-[400px]">
              <CodeEditor code={code} onChange={setCode} />
            </div>

            {/* 3. Botones fijos abajo */}
            <div className="flex gap-4 max-w-xl mx-auto lg:mx-0 w-full shrink-0">
              <Button
                onClick={handleAnalyze}
                disabled={!code.trim() || isAnalyzing}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12"
              >
                {isAnalyzing ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="mr-2">
                      <Zap className="w-4 h-4" />
                    </motion.div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Audit Code
                  </>
                )}
              </Button>
              <Button onClick={handleClear} variant="outline" className="border-border/50 hover:bg-card/50 h-12 px-8">
                Clear
              </Button>
            </div>
          </div>

          {/* COLUMNA DERECHA: Resultados (ESTRUCTURA ESPEJO CORREGIDA) */}
          <div className="space-y-8 flex flex-col h-full relative border-t border-border/30 lg:border-none pt-16 lg:pt-0 lg:h-[670px]">
            {/* 1. Título Fijo (IGUAL QUE A LA IZQUIERDA) */}
            <h3 className="lg:text-left text-center text-xl font-semibold px-2 mb-2 shrink-0">Audit Results</h3>

            {/* 2. Contenido expandible con SCROLL INTERNO */}
            <div className="flex-1 min-h-[400px] lg:min-h-0 relative">
                <AnimatePresence mode="wait">
                    {!hasAnalyzed ? (
                        // Estado Inicial (Caja discontinua) - Alineada con el Editor
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border border-dashed border-border/30 rounded-xl bg-card/10 flex flex-col items-center justify-center gap-4 text-center p-12 lg:h-[633px] lg:absolute lg:inset-0"
                        >
                            <Shield className="w-8 h-8 text-accent opacity-30" />
                            <p className="text-sm text-muted-foreground opacity-50">
                                Paste code on the left and click "Audit Code"
                            </p>
                        </motion.div>
                    ) : (
                        // Estado con Resultados (Con Scroll Interno por debajo del título)
                        <motion.div
                            key="results"
                            ref={resultsRef}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.4 }}
                            className="h-full flex flex-col lg:absolute lg:inset-0"
                        >
                            {/* Este div interno es el único que hace scroll */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-6">
                                {/* Subtítulo y Tags (estos sí hacen scroll) */}
                                <div className="border-b border-border/30 pb-6 pt-2 space-y-6">
                                    <p className="text-muted-foreground text-sm lg:text-left text-center">
                                      {isAnalyzing 
                                        ? "✨ AI is reading your code..." 
                                        : findings.length === 0
                                          ? "✓ No security issues detected"
                                          : `Analysis complete: ${findings.length} issue${findings.length === 1 ? "" : "s"} detected`}
                                    </p>

                                    {!isAnalyzing && findings.length > 0 && (
                                       <div className="flex gap-1.5 text-xs justify-center lg:justify-start flex-wrap">
                                         {Object.entries(stats).map(([key, value]) => {
                                           if (key === 'total' || value === 0) return null;
                                           const colors: Record<string, string> = {
                                               critical: "text-red-400 border-red-500/30 bg-red-500/10",
                                               high: "text-orange-400 border-orange-500/30 bg-orange-500/10",
                                               medium: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
                                               low: "text-green-400 border-green-500/30 bg-green-500/10"
                                           }
                                           return (
                                               <div key={key} className={`px-2.5 py-1 rounded-full border ${colors[key]}`}>
                                                   {key.toUpperCase()}: {value}
                                               </div>
                                           )
                                         })}
                                       </div>
                                    )}
                                </div>

                                {/* Componente de tarjetas de resultados */}
                                <AuditResults findings={findings} isLoading={isAnalyzing} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* What's New? Section */}
      <section className="container py-20 md:py-32 space-y-12 shrink-0">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">What's New?</h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Platform updates & recent releases from the CodeGuard AI team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Gemini 2.5 Flash Integration", date: "Mar 2026" },
            { title: "Custom UI Theme Engine", date: "Mar 2026" },
            { title: "Vulnerability Database Sync", date: "Feb 2026" },
          ].map((update, i) => (
            <div key={i} className="bg-card/40 border border-border/30 rounded-xl p-6 backdrop-blur-sm space-y-2 hover:border-accent/50 transition-colors cursor-pointer">
              <h4 className="font-semibold">{update.title}</h4>
              <p className="text-xs text-muted-foreground">{update.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 mt-20 shrink-0">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-muted-foreground">
          <div>© 2026 CodeGuard AI. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent">About Us</a>
            <a href="#" className="hover:text-accent">Learn more</a>
            <a href="#" className="hover:text-accent">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}