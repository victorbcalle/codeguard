/**
 * CodeGuard AI - Compact Feature Showcase.
 * * This component renders an interactive set of feature "pills" that expand 
 * to show detailed descriptions. It is designed to provide high-level 
 * platform highlights in a space-efficient manner.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Shield, Globe, ChevronDown, LucideIcon } from "lucide-react";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Represents a single highlight feature of the platform.
 * * @interface Feature
 * @property {string} id - Unique identifier for the feature.
 * @property {LucideIcon} icon - The Lucide icon component to display.
 * @property {string} label - Short display name for the feature pill.
 * @property {string} description - Detailed explanation shown when expanded.
 */
interface Feature {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

/**
 * Static collection of platform features.
 * (In a production environment, this could be fetched from a CMS).
 */
const FEATURES: Feature[] = [
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
      "Support for Python, JavaScript, Java, PHP, and SQL. Consistent security analysis across all major programming languages.",
  },
];

// ============================================================================
// Main Component
// ============================================================================

/**
 * Renders an interactive showcase of platform features with expandable descriptions.
 * * @returns {JSX.Element} The rendered feature showcase.
 */
export default function CompactFeatureShowcase() {
  // --- State Management ---
  // Tracks the currently expanded feature ID. Null means all are collapsed.
  const [expandedId, setExpandedId] = useState<string | null>(null);

  /**
   * Toggles the expansion state of a specific feature.
   * * @param {string} id - The ID of the feature to toggle.
   */
  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Centered Navigation Pills */}
      <div className="flex flex-wrap justify-center gap-3">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          const isSelected = expandedId === feature.id;

          return (
            <motion.button
              key={feature.id}
              onClick={() => handleToggle(feature.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer
                  ${
                    isSelected
                      ? "border-accent/60 bg-card/80 shadow-lg shadow-accent/10"
                      : "border-border/40 bg-card/50 hover:border-accent/40 hover:bg-card/70"
                  }
                `}
              >
                <Icon className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-foreground">
                  {feature.label}
                </span>
                
                {/* Visual Indicator: Arrow Rotation */}
                <motion.div
                  animate={{ rotate: isSelected ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-colors" />
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* 2. Content Display: Expanded Description Area */}
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
              <p className="text-sm text-muted-foreground leading-relaxed text-center">
                {FEATURES.find((f) => f.id === expandedId)?.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}