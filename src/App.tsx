import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MathOCR } from './components/MathOCR';
import { TableGen } from './components/TableGen';
import { EquationBuilder } from './components/EquationBuilder';
import { DocConverter } from './components/DocConverter';
import { CheatSheet } from './components/CheatSheet';
import { BibManager } from './components/BibManager';

export type ToolType = 'ocr' | 'table' | 'equation' | 'doc' | 'bib' | 'cheatsheet';

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolType>('ocr');

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
      
      <main className="flex-1 overflow-auto flex flex-col relative">
        <div className="max-w-6xl w-full mx-auto p-4 sm:p-8 flex-1 flex flex-col">
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">
              {activeTool === 'ocr' && 'Math OCR (Image to LaTeX)'}
              {activeTool === 'table' && 'Dataset to LaTeX Table'}
              {activeTool === 'equation' && 'Equation & Matrix Builder'}
              {activeTool === 'doc' && 'Document & Pseudo-code Converter'}
              {activeTool === 'bib' && 'Bibliography Manager'}
              {activeTool === 'cheatsheet' && 'LaTeX Math Cheat Sheet'}
            </h1>
            <p className="text-slate-500 mt-2">
              {activeTool === 'ocr' && 'Extract equations and matrices directly from images.'}
              {activeTool === 'table' && 'Convert CSV or raw text data into publication-ready tables.'}
              {activeTool === 'equation' && 'Interactive step-by-step generators for complex math.'}
              {activeTool === 'doc' && 'Convert Markdown, Text, or raw output to structured LaTeX/BibTeX.'}
              {activeTool === 'bib' && 'Upload BibTeX, search references, and copy formatted citations.'}
              {activeTool === 'cheatsheet' && 'Quick reference for common LaTeX symbols and commands.'}
            </p>
          </header>

          <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col min-h-0">
            {activeTool === 'ocr' && <MathOCR />}
            {activeTool === 'table' && <TableGen />}
            {activeTool === 'equation' && <EquationBuilder />}
            {activeTool === 'doc' && <DocConverter />}
            {activeTool === 'bib' && <BibManager />}
            {activeTool === 'cheatsheet' && <CheatSheet />}
          </div>
        </div>
      </main>
    </div>
  );
}
