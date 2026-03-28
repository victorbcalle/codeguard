import { Code2 } from "lucide-react";

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <div className="flex flex-col w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-border/50 bg-zinc-950 shadow-lg">
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-border/50 text-sm text-muted-foreground font-semibold">
        <Code2 className="w-4 h-4" /> Code Input
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your code here for AI security analysis..."
        className="flex-1 w-full h-full p-4 bg-transparent text-sm font-mono text-zinc-300 focus:outline-none resize-none leading-relaxed"
        spellCheck="false"
      />
    </div>
  );
}