/**
 * CodeGuard AI - Statistics Visualization Panel.
 *
 * This component provides a real-time summary of security audit results.
 * It features animated counters, dynamic progress bars based on severity 
 * distribution, and a context-aware loading state during AI analysis.
 */

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Properties for the StatisticsPanel component.
 * * @interface StatisticsPanelProps
 * @property {Object} stats - Aggregated finding counts categorized by severity.
 * @property {number} stats.total - Total number of detected issues.
 * @property {number} stats.critical - Count of critical-level vulnerabilities.
 * @property {number} stats.high - Count of high-level vulnerabilities.
 * @property {number} stats.medium - Count of medium-level vulnerabilities.
 * @property {number} stats.low - Count of low-level vulnerabilities.
 * @property {boolean} isAnalyzing - Toggle for the analysis loading state.
 */
interface StatisticsPanelProps {
  stats: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  isAnalyzing: boolean;
}

/**
 * Internal UI configuration for a single statistic card.
 *
 * @interface StatItem
 */
interface StatItem {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Renders a sticky dashboard containing audit metrics and severity progress bars.
 *
 * @param {StatisticsPanelProps} props - The component props.
 * @returns {JSX.Element} The rendered statistics panel.
 */
export default function StatisticsPanel({
  stats,
  isAnalyzing,
}: StatisticsPanelProps) {
  
  // Mapping the raw numeric stats into visual UI configurations
  const statItems: StatItem[] = [
    {
      label: "Total",
      value: stats.total,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Critical",
      value: stats.critical,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
    },
    {
      label: "High",
      value: stats.high,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Medium",
      value: stats.medium,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Low",
      value: stats.low,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="sticky top-24 space-y-4"
    >
      {/* 1. Header: Section Identifier */}
      <div className="flex items-center gap-2 mb-6 px-1">
        <BarChart3 className="w-5 h-5 text-accent" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider opacity-80">
          Statistics Summary
        </h3>
      </div>

      {/* 2. Stats Grid: Individual Metric Cards */}
      <div className="space-y-3">
        {statItems.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`${item.bgColor} border border-border/30 rounded-lg p-4 hover:border-border/50 transition-colors shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                {item.label}
              </span>
              
              {/* Dynamic Value Display with Pulse Animation during Analysis */}
              <motion.span
                key={item.value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-2xl font-bold ${item.color} font-mono`}
              >
                {isAnalyzing ? (
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    —
                  </motion.span>
                ) : (
                  item.value
                )}
              </motion.span>
            </div>

            {/* Severity Distribution: Progress Bar Visualization */}
            {item.label !== "Total" && stats.total > 0 && (
              <div className="mt-3 h-1.5 bg-background/50 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(item.value / stats.total) * 100}%`,
                  }}
                  transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  className={`h-full ${item.color.replace("text-", "bg-")}`}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 3. Guidance Footer: Actionable Advice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 p-5 bg-card/40 border border-border/30 rounded-xl text-[13px] text-muted-foreground leading-relaxed shadow-inner"
      >
        <p>
          <strong className="text-foreground">Security Insight:</strong> Prioritize remediation of 
          <span className="text-red-400 font-semibold"> Critical</span> and 
          <span className="text-orange-400 font-semibold"> High</span> severity issues. These items 
          indicate immediate business risk and potential data exposure.
        </p>
      </motion.div>
      
    </motion.div>
  );
}