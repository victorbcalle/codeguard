/**
 * Audit Results Component - IDE MOCKUP & SAFE MARKDOWN
 */

// 1. IMPORTANTE: He añadido 'Zap' aquí para que no explote
import { AlertCircle, Shield, Zap, FileCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getSeverityColor, getSeverityLabel } from "@/lib/auditEngine";
import type { AuditFinding } from "@/pages/Home";

interface AuditResultsProps {
  findings: AuditFinding[];
  isLoading?: boolean;
}

export default function AuditResults({ findings, isLoading = false }: AuditResultsProps) {
  
  if (findings.length === 0 && !isLoading) {
    return (
      <div className="h-full border border-dashed border-border/30 rounded-2xl bg-card/10 p-12 text-center flex flex-col items-center justify-center gap-6 backdrop-blur-sm min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
          <Shield className="w-9 h-9 text-accent opacity-30" />
        </div>
        <div className="space-y-2">
          <h4 className="text-xl font-semibold opacity-60">Awaiting code input...</h4>
          <p className="text-muted-foreground max-w-sm text-sm opacity-50">
            Paste your code on the left and click 'Audit Code' to start the analysis.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <AnimatePresence>
        {findings.map((finding) => (
          <FindingCard key={finding.id} finding={finding} isLoading={isLoading} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function FindingCard({ finding, isLoading }: { finding: AuditFinding, isLoading: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="group border border-border/30 rounded-2xl bg-card/40 hover:border-border/50 transition-colors backdrop-blur-sm overflow-hidden flex flex-col h-full min-h-[600px]"
    >
      {/* HEADER DE LA TARJETA */}
      <div className="p-6 flex flex-col md:flex-row md:items-center gap-6 justify-between border-b border-border/20 bg-background/50">
        <div className="flex gap-4 items-center">
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${getSeverityColor(finding.severity)} shadow-sm`}
          >
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">{finding.title}</h3>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getSeverityColor(finding.severity)} bg-background`}
              >
                {getSeverityLabel(finding.severity).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div className="p-6 flex flex-col gap-6 flex-1">
        
        {/* DESCRIPCIÓN DEL PROBLEMA */}
        <div className="space-y-3">
          <h5 className="font-semibold text-sm text-accent flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Analysis Details
          </h5>
          <div className="prose prose-base prose-invert max-w-none text-muted-foreground leading-relaxed bg-background/30 p-5 rounded-xl border border-border/30">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {finding.description || "No analysis details provided."}
            </ReactMarkdown>
          </div>
        </div>

        {/* SOLUCIÓN ARMONIZADA (Estilo Editor Limpio) */}
        <div className="space-y-3 flex-1 flex flex-col">
          <h5 className="font-semibold text-sm text-green-400 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Remediated Code
          </h5>
          
          {/* Contenedor tipo VS Code (Sin botones Mac, fondo coherente) */}
          <div className="rounded-xl overflow-hidden border border-border/30 shadow-lg bg-[#0d0d12] flex flex-col flex-1 relative">
            
            {/* Cabecera minimalista (Pestaña de archivo) */}
            <div className="bg-[#1a1a24]/80 px-4 py-2.5 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2 text-muted-foreground/80">
                <FileCode className="w-4 h-4" />
                <span className="text-sm text-muted-foreground font-semibold">Fixed code</span>
              </div>
            </div>

            {/* Área de código y texto */}
            <div className="p-6 overflow-auto custom-scrollbar flex-1 relative min-h-[300px]">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-accent/50 gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  <span className="text-sm font-mono">Synthesizing secure code...</span>
                </div>
              ) : (
                /* AQUÍ ESTÁ EL CAMBIO DE FUENTE: prose-base y text-[15px] para igualar al editor */
                <div className="prose prose-base prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 text-foreground text-[15px] leading-relaxed">
                  
                  {/* Texto de la recomendación (Ahora en color normal, no todo verde) */}
                  <div className="text-muted-foreground mb-6 pb-6 border-b border-white/5 font-sans">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {finding.recommendation || "*No recommendation provided.*"}
                    </ReactMarkdown>
                  </div>

                  {/* Código de solución (Mantenemos la fuente mono para el código) */}
                  {finding.solutionCode && finding.solutionCode !== "// Gemini no proporcionó código de solución." && (
                    <div className="font-mono text-green-300/90 text-[15px]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {finding.solutionCode.includes('```') 
                          ? finding.solutionCode 
                          : `\`\`\`python\n${finding.solutionCode}\n\`\`\``}
                      </ReactMarkdown>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}