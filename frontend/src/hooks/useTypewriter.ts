import { useState, useEffect, useRef } from 'react';

/**
 * Hook personalizado para crear un efecto de máquina de escribir fluida.
 */
export function useTypewriter(text: string, speed = 10, isAnalyzing = false) {
  const [typedText, setTypedText] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Limpieza inicial
    setTypedText("");
    if (intervalRef.current) clearInterval(intervalRef.current);

    // 2. Si el backend está pensando, paramos
    if (isAnalyzing || !text) {
      setTypedText("");
      return;
    }

    // 3. ¡A ESCRIBIR!
    let currentPosition = 0;
    // Forzamos la primera letra para que no haya salto visual
    setTypedText(text.charAt(0));
    currentPosition = 1;

    intervalRef.current = setInterval(() => {
      setTypedText(prev => prev + text.charAt(currentPosition));
      currentPosition++;

      // Parar cuando lleguemos al final
      if (currentPosition >= text.length && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, speed);

    // 4. Limpieza si el componente se desmonta
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed, isAnalyzing]); // Se reinicia si cambia el texto o si la IA empieza a pensar

  return typedText;
}