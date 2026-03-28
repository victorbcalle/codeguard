/**
 * StatisticsPanel Component
 *
 * Displays real-time audit statistics with animated counters and
 * visual severity indicators.
 */

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

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

interface StatItem {
  label: string;
  value: number;
  color: string;
  bgColor: string;
}

export default function StatisticsPanel({
  stats,
  isAnalyzing,
}: StatisticsPanelProps) {
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
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-accent" />
        <h3 className="text-sm font-semibold text-foreground">Statistics</h3>
      </div>

      {/* Stats Grid */}
      <div className="space-y-3">
        {statItems.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`${item.bgColor} border border-border/30 rounded-lg p-4 hover:border-border/50 transition-colors`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {item.label}
              </span>
              <motion.span
                key={item.value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-2xl font-bold ${item.color}`}
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

            {/* Progress bar for non-total items */}
            {item.label !== "Total" && stats.total > 0 && (
              <div className="mt-3 h-1 bg-border/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(item.value / stats.total) * 100}%`,
                  }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className={`h-full ${item.color.replace("text-", "bg-")}`}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-card/50 border border-border/30 rounded-lg text-xs text-muted-foreground leading-relaxed"
      >
        <p>
          <strong>Tip:</strong> Focus on fixing critical and high-severity issues
          first. These pose the greatest security risk to your application.
        </p>
      </motion.div>
    </motion.div>
  );
}
