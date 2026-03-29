/**
 * CodeGuard AI - Audit Results Component.
 *
 * This module renders the visual representation of security audit findings.
 * It handles empty states, animated card entrances, and displays both the
 * markdown-formatted analysis and the raw remediated code within a mock 
 * IDE environment.
 */

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Shield, Zap, FileCode } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Internal application imports
import { getSeverityColor, getSeverityLabel } from "@/lib/auditEngine";
import type { AuditFinding } from "@/pages/Home";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Properties for the main AuditResults container component.
 *
 * @interface AuditResultsProps
 * @property {AuditFinding[]} findings - The array of security findings to display.
 * @property {boolean} [isLoading] - Indicates if an analysis is currently in progress.
 */
interface AuditResultsProps {
  findings: AuditFinding[];
  isLoading?: boolean;
}

/**
 * Properties for the individual FindingCard component.
 *
 * @interface FindingCardProps
 * @property {AuditFinding} finding - The specific security finding data to render.
 * @property {boolean} isLoading - Indicates if the system is synthesizing a response.
 */
interface FindingCardProps {
  finding: AuditFinding;
  isLoading: boolean;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Renders the list of audit findings or a placeholder if the workspace is empty.
 */
export default function AuditResults({ findings, isLoading = false }: AuditResultsProps) {
  
  // Render empty state placeholder
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

  // Render findings list with animated transitions
  return (
    <div className="space-y-6">
      <AnimatePresence>
        {findings.map((finding) => (
          <FindingCard key={finding.id} finding={finding} isLoading={isLoading} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

/**
 * Renders an individual security finding card containing analysis and remediated code.
 */
function FindingCard({ finding, isLoading }: FindingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="group border border-border/30 rounded-2xl bg-card/40 hover:border-border/50 transition-colors backdrop-blur-sm overflow-hidden flex flex-col"
    >
      {/* Card Header: Vulnerability Title and Severity Badge */}
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

      {/* Main Content Payload */}
      <div className="p-6 flex flex-col gap-8">
        
        {/* Analysis & Recommendation Text Container */}
        <div className="space-y-3">
          <h5 className="font-semibold text-sm text-accent flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Analysis & Remediation
          </h5>
          <div className="prose prose-base prose-invert max-w-none text-muted-foreground leading-relaxed bg-background/30 p-5 rounded-xl border border-border/30 text-[16px]">
            {/* Detailed explanation of the vulnerability */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {finding.description || "No analysis details provided."}
            </ReactMarkdown>
            
            {/* Step-by-step remediation instructions */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {finding.recommendation}
            </ReactMarkdown>
          </div>
        </div>

        {/* Mock IDE Container: Secure Code Output */}
        <div className="space-y-3">
          <h5 className="font-semibold text-sm text-green-400 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Secure Code
          </h5>
          
          {/* IDE Layout constraint: max-h-[450px] enables internal vertical scrolling */}
          <div className="rounded-xl border border-border/30 shadow-lg bg-[#0d0d12] flex flex-col relative max-h-[450px]">
            
            {/* Minimalist Tab Header */}
            <div className="bg-[#1a1a24]/80 px-4 py-2.5 flex items-center justify-between border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2 text-muted-foreground/80">
                <FileCode className="w-4 h-4" />
                <span className="text-sm text-muted-foreground font-semibold">Fixed code</span>
              </div>
            </div>

            {/* Scrollable Code Area */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center text-accent/50 gap-3 py-10">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  <span className="text-base font-mono">Synthesizing secure code...</span>
                </div>
              ) : (
                <div className="prose prose-base prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 font-mono text-green-300/70 text-[15px] leading-relaxed">
                  
                  {/* Pure HTML Code Rendering */}
                  {finding.solutionCode && finding.solutionCode !== "// Gemini no proporcionó código de solución." ? (
                    <pre className="whitespace-pre-wrap font-mono text-[16px] text-green-300/90 leading-relaxed bg-transparent p-0 m-0 border-none">
                      <code>
                        {/* Strip residual Markdown formatting inadvertently injected by the AI */}
                        {finding.solutionCode.replace(/```python\n?/g, '').replace(/```\n?/g, '').trim()}
                      </code>
                    </pre>
                  ) : (
                    <span className="text-muted-foreground/50 opacity-50 italic">
                      // No replacement code generated.
                    </span>
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