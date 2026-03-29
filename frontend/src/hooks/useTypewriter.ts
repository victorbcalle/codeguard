/**
 * CodeGuard AI - Typewriter Effect Hook.
 *
 * This module provides a custom React hook to simulate a fluid typewriter
 * effect for text rendering. It handles asynchronous analysis states and
 * ensures clean interval management to prevent memory leaks or overlapping text.
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to create a sequential typewriter effect for rendering text.
 *
 * @param {string} text - The complete text string to be typed out.
 * @param {number} [speed=10] - The typing speed in milliseconds per character.
 * @param {boolean} [isAnalyzing=false] - Flag indicating if the backend is currently processing.
 * @returns {string} The progressively typed text string ready for rendering.
 */
export function useTypewriter(text: string, speed: number = 10, isAnalyzing: boolean = false): string {
  // --- State & References ---
  const [typedText, setTypedText] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- Typewriter Effect Lifecycle ---
  useEffect(() => {
    // 1. Initial cleanup: Reset text and clear any existing intervals
    setTypedText("");
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 2. Halt execution if the AI engine is analyzing or if the text is empty
    if (isAnalyzing || !text) {
      setTypedText("");
      return;
    }

    // 3. Initialize typing sequence execution
    let currentPosition = 0;
    
    // Force immediate rendering of the first character to prevent visual layout shifts
    setTypedText(text.charAt(0));
    currentPosition = 1;

    // Begin asynchronous character-by-character appending
    intervalRef.current = setInterval(() => {
      setTypedText(prev => prev + text.charAt(currentPosition));
      currentPosition++;

      // Terminate the interval once the entire string has been processed
      if (currentPosition >= text.length && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, speed);

    // 4. Component unmount cleanup function: Prevent memory leaks
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed, isAnalyzing]); // Re-trigger if target text, speed, or analysis state changes

  return typedText;
}