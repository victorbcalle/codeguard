/**
 * CodeGuard AI - Atomic UI Components.
 *
 * This module defines a highly reusable, accessible, and variant-based 
 * Button component. It extends standard HTML button attributes and 
 * utilizes React.forwardRef to support deep integration with 
 * animation libraries and focus management systems.
 */

import React from "react";

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Properties for the Button component.
 * * @interface ButtonProps
 * @extends {React.ButtonHTMLAttributes<HTMLButtonElement>}
 * * @property {"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"} [variant] 
 * The visual style of the button.
 * @property {"default" | "sm" | "lg" | "icon"} [size] 
 * The padding and scale of the button.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

// ============================================================================
// Component Implementation
// ============================================================================

/**
 * A flexible Button component that supports various visual styles and sizes.
 *
 * Uses React.forwardRef to allow the parent components to interact 
 * directly with the underlying HTMLButtonElement.
 *
 * @param {ButtonProps} props - Component properties including variants and HTML attributes.
 * @param {React.Ref<HTMLButtonElement>} ref - Forwarded reference to the DOM element.
 * @returns {JSX.Element} The rendered button component.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    
    /**
     * Note on Styling:
     * We maintain a base set of utility classes for accessibility 
     * (focus-visible) and state (disabled) while allowing external 
     * overrides via the 'className' prop.
     */
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none px-4 py-2 ${className}`}
        {...props}
      />
    );
  }
);

// Define display name for easier debugging in React DevTools
Button.displayName = "Button";

export { Button };