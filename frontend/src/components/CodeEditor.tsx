/**
 * CodeGuard AI - Source Code Editor Component.
 * * This component provides a specialized text area optimized for code entry.
 * It features a mock IDE header, mono-spaced typography, and custom styling
 * to integrate seamlessly with the security auditing workspace.
 */

import { Code2 } from "lucide-react";

/**
 * Properties for the CodeEditor component.
 * * @interface CodeEditorProps
 * @property {string} code - The current source code text stored in the parent state.
 * @property {(value: string) => void} onChange - Callback function triggered on every keystroke.
 */
interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

/**
 * A controlled textarea component designed for source code input.
 * * @param {CodeEditorProps} props - The component props.
 * @returns {JSX.Element} The rendered code editor interface.
 */
export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <div className="flex flex-col w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-border/50 bg-zinc-950 shadow-lg">
      
      {/* 1. Editor Header: Mock IDE Tab Bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-border/50 text-sm text-muted-foreground font-semibold">
        <Code2 className="w-4 h-4" /> 
        <span>Code Input</span>
      </div>

      {/* 2. Primary Input Area: Raw text manipulation with mono-spaced font */}
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your code here for AI security analysis..."
        className="flex-1 w-full h-full p-4 bg-transparent text-sm font-mono text-zinc-300 focus:outline-none resize-none leading-relaxed custom-scrollbar"
        spellCheck="false"
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
      
    </div>
  );
}