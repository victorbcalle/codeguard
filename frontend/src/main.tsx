/**
 * CodeGuard AI - Main React Entry Point.
 *
 * This module bootstraps the React application, binding the root component
 * tree to the HTML DOM. It also enforces global configurations such as
 * React StrictMode and the default UI theme.
 */

import React from "react";
import ReactDOM from "react-dom/client";

// Internal Components
import Home from "./pages/Home";

// Global Stylesheets
import "./index.css";

// ============================================================================
// Application Bootstrap
// ============================================================================

// Target the root DOM node defined in index.html
const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {/* Enforce the dark mode theme globally at the application root */}
    <div className="dark min-h-screen bg-background text-foreground"> 
      <Home />
    </div>
  </React.StrictMode>
);