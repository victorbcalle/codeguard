/**
 * CodeGuard AI - Audit Engine Utilities.
 *
 * This module provides core type definitions and utility functions for
 * managing, formatting, and rendering security audit severities across 
 * the application UI.
 */

/**
 * Represents the distinct levels of severity for a security finding.
 */
export type Severity = "critical" | "high" | "medium" | "low";

/**
 * Defines the structure of a single security finding returned by the AI engine.
 *
 * @interface AuditFinding
 * @property {string} id - Unique identifier for the finding.
 * @property {string} title - Short, descriptive title of the vulnerability.
 * @property {string} description - Detailed technical explanation of the issue.
 * @property {Severity} severity - The risk level of the vulnerability.
 * @property {string} category - The classification category (e.g., "AI Analysis").
 * @property {number} [line] - The specific line number where the issue occurs.
 * @property {string} recommendation - Step-by-step remediation instructions.
 * @property {string} [codeSnippet] - The original code snippet causing the issue.
 */
export interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: string;
  line?: number;
  recommendation: string;
  codeSnippet?: string;
}

/**
 * Maps a given severity level to its corresponding Tailwind CSS color classes.
 *
 * @param {Severity} severity - The severity level to evaluate.
 * @returns {string} The combined Tailwind CSS classes for backgrounds, text, and borders.
 */
export function getSeverityColor(severity: Severity): string {
  const colors: Record<Severity, string> = {
    critical: "bg-red-500/10 text-red-400 border-red-500/30",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    low: "bg-green-500/10 text-green-400 border-green-500/30",
  };
  
  // Fallback to 'medium' colors if an invalid or undefined severity is provided
  return colors[severity] || colors.medium;
}

/**
 * Formats a raw severity string into a capitalized, human-readable label.
 *
 * @param {Severity} severity - The severity level to format.
 * @returns {string} The capitalized severity label (e.g., "Critical").
 */
export function getSeverityLabel(severity: Severity): string {
  if (!severity) return "Unknown";
  return severity.charAt(0).toUpperCase() + severity.slice(1);
}