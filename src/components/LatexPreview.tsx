import React from 'react';
import { BlockMath } from 'react-katex';

interface LatexPreviewProps {
  latex: string;
}

export function LatexPreview({ latex }: LatexPreviewProps) {
  if (!latex) {
    return <div className="text-slate-400 italic text-sm">Preview will appear here...</div>;
  }

  return (
    <div className="overflow-auto max-w-full">
      <BlockMath math={latex} errorColor={'#ef4444'} />
    </div>
  );
}
