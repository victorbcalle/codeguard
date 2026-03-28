/**
 * CompactFeatureShowcase Component
 *
 * Small, centered feature pills with inline expandable descriptions.
 * Maintains original compact size while adding interactivity.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Shield, Globe, ChevronDown } from "lucide-react";

interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}

const features: Feature[] = [
  {
    id: "instant-analysis",
    icon: Zap,
    label: "Instant Analysis",
    description:
      "Real-time vulnerability detection powered by AI. Get instant feedback on security issues as you paste your code.",
  },
  {
    id: "enterprise-grade",
    icon: Shield,
    label: "Enterprise Grade",
    description:
      "Built with OWASP standards and enterprise security best practices. Production-ready analysis for mission-critical applications.",
  },
  {
    id: "multi-language",
    icon: Globe,
    label: "Multi-Language",
    description:
      "Support for Python, JavaScript, Java, Go, Rust, and more. Consistent security analysis across all major programming languages.",
  },
];

export default function CompactFeatureShowcase() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Centered Pills Container */}
      <div className="flex flex-wrap justify-center gap-3">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.button
              key={feature.id}
              onClick={() =>
                setExpandedId(expandedId === feature.id ? null : feature.id)
              }
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer
                  ${
                    expandedId === feature.id
                      ? "border-accent/60 bg-card/80 shadow-lg shadow-accent/10"
                      : "border-border/40 bg-card/50 hover:border-accent/40 hover:bg-card/70"
                  }
                `}
              >
                <Icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-foreground">
                  {feature.label}
                </span>
                <motion.div
                  animate={{ rotate: expandedId === feature.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-colors" />
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Expanded Description */}
      <AnimatePresence>
        {expandedId && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-lg border border-accent/30 bg-card/40 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {features.find((f) => f.id === expandedId)?.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
