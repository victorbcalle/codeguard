/**
 * CodeGuard AI - Vite Build Configuration.
 *
 * This module configures the Vite frontend tooling for the React application.
 * It sets up essential plugins for React and Tailwind CSS, and establishes
 * directory aliases for cleaner import paths throughout the codebase.
 */

import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // ============================================================================
  // Plugin Configuration
  // ============================================================================
  plugins: [
    // Integrates Tailwind CSS v4 directly into the Vite build pipeline
    tailwindcss(),
    
    // Provides Fast Refresh and React ecosystem support
    react(),
  ],

  // ============================================================================
  // Path Resolution
  // ============================================================================
  resolve: {
    alias: {
      // Maps the "@" prefix to the absolute path of the "/src" directory.
      // This prevents "relative import hell" (e.g., "../../../components/Button").
      "@": path.resolve(__dirname, "./src"),
    },
  },
});