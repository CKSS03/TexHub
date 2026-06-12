import React, { useState, useRef } from 'react';
import { Copy, Check, Loader2 } from 'lucide-react';
import { LatexPreview } from './LatexPreview';
import { InlineMath } from 'react-katex';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function EquationBuilder() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [bracketType, setBracketType] = useState('bmatrix');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [simplexInput, setSimplexInput] = useState('[\n  [2, 3, 1, 0, 0, 10],\n  [4, -1, 0, 1, 0, 8],\n  [-3, -2, 0, 0, 1, 0]\n]');
  const [simplexResult, setSimplexResult] = useState('');
  const [simplexLoading, setSimplexLoading] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSimplex = async () => {
     setSimplexLoading(true);
     setSimplexResult('');
     try {
       const matrixData = JSON.parse(simplexInput);
       const backendUrl = import.meta.env.VITE_MODAL_URL || 'https://your-modal-endpoint.modal.run';
       const res = await fetch(`${backendUrl}/compute/simplex`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ matrix: matrixData })
       });
       const data = await res.json();
       if (data.success && data.markdown) {
          setSimplexResult(data.markdown);
       } else {
          setSimplexResult("Error: Could not compute Simplex.\\n" + (data.error || ''));
       }
     } catch (err: any) {
       setSimplexResult("Error parsing matrix input or fetching from server: " + err.message);
     } finally {
       setSimplexLoading(false);
     }
  };

  const insertText = (text: string) => {
    if (!textAreaRef.current) {
        setResult(prev => prev + text);
        return;
    }
    const start = textAreaRef.current.selectionStart;
    const end = textAreaRef.current.selectionEnd;
    const newText = result.substring(0, start) + text + result.substring(end);
    setResult(newText);
    setTimeout(() => {
        if (textAreaRef.current) {
            textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = start + text.length;
            textAreaRef.current.focus();
        }
    }, 0);
  };

  const generateMatrix = () => {
    let internal = '';
    for (let i = 0; i < rows; i++) {
      let rowStr = [];
      for (let j = 0; j < cols; j++) {
        rowStr.push(`a_{${i+1}${j+1}}`);
      }
      internal += '  ' + rowStr.join(' & ') + ' \\\\\n';
    }
    const eq = `\\begin{${bracketType}}\n${internal}\\end{${bracketType}}`;
    insertText(eq);
  };

  const generatePiecewise = () => {
    const eq = `\\begin{cases} \n  x^2 & \\text{if } x < 0 \\\\ \n  x & \\text{if } x \\geq 0 \n\\end{cases}`;
    insertText(eq);
  };

  const generateAlign = () => {
     const eq = `\\begin{align*}\n  f(x) &= (x+1)^2 \\\\\n       &= x^2 + 2x + 1\n\\end{align*}`;
    insertText(eq);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tools = [
    { label: '\\alpha', val: '\\alpha ' },
    { label: '\\beta', val: '\\beta ' },
    { label: '\\pi', val: '\\pi ' },
    { label: '\\infty', val: '\\infty ' },
    { label: '\\frac{a}{b}', val: '\\frac{}{} ' },
    { label: '\\sqrt{x}', val: '\\sqrt{} ' },
    { label: 'x^2', val: '^{} ' },
    { label: 'x_i', val: '_{} ' },
    { label: '\\int', val: '\\int ' },
    { label: '\\sum', val: '\\sum ' },
    { label: '\\partial', val: '\\partial ' },
    { label: '\\approx', val: '\\approx ' },
    { label: '\\leq', val: '\\leq ' },
    { label: '\\geq', val: '\\geq ' },
    { label: '\\to', val: '\\to ' },
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
        
        {/* Left Side: Wizards */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">Matrix Generator</h3>
            <div className="flex flex-wrap gap-4 items-end mb-4">
              <div className="flex flex-col gap-1 w-16">
                <label className="text-xs font-semibold text-slate-500 uppercase">Rows</label>
                <input type="number" min="1" max="10" value={rows} onChange={(e) => setRows(parseInt(e.target.value) || 1)} className="border rounded p-2 text-sm w-full" />
              </div>
              <div className="flex flex-col gap-1 w-16">
                <label className="text-xs font-semibold text-slate-500 uppercase">Cols</label>
                <input type="number" min="1" max="10" value={cols} onChange={(e) => setCols(parseInt(e.target.value) || 1)} className="border rounded p-2 text-sm w-full" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Style</label>
                <select value={bracketType} onChange={(e) => setBracketType(e.target.value)} className="border rounded p-2 text-sm w-full">
                  <option value="matrix">None (matrix)</option>
                  <option value="pmatrix">( ) pmatrix</option>
                  <option value="bmatrix">[ ] bmatrix</option>
                  <option value="Bmatrix">{ } Bmatrix</option>
                  <option value="vmatrix">| | vmatrix</option>
                </select>
              </div>
            </div>
            <button
              onClick={generateMatrix}
              className="w-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
            >
              Insert Matrix
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">Common Structures</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={generatePiecewise}
                className="w-full bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors text-left"
              >
                  Insert Piecewise Function
              </button>
              <button
                onClick={generateAlign}
                className="w-full bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors text-left"
              >
                  Insert Aligned Equations
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">Simplex Optimization</h3>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-slate-500 uppercase">Raw Matrix Input</label>
              <textarea 
                value={simplexInput}
                onChange={(e) => setSimplexInput(e.target.value)}
                className="w-full border rounded p-2 text-sm font-mono h-24 whitespace-pre outline-none focus:ring-1 focus:ring-indigo-500"
                spellCheck={false}
              />
              <button
                onClick={handleSimplex}
                disabled={simplexLoading}
                className="w-full bg-indigo-600 text-white border border-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                {simplexLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Solve Simplex
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Editor */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm h-[400px] bg-white flex flex-col">
            <div className="flex justify-between items-center bg-slate-100 px-4 py-3 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">LaTeX Workspace</span>
              <button 
                onClick={copyToClipboard}
                disabled={!result}
                className="text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="p-2 border-b border-slate-200 bg-slate-50 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1 overflow-y-auto max-h-32 shadow-inner">
              {tools.map((t, i) => (
                  <button
                      key={i}
                      onClick={() => insertText(t.val)}
                      className="p-1 border border-slate-200 bg-white rounded hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex items-center justify-center min-h-[40px] text-lg cursor-pointer"
                      title={t.val}
                  >
                      <InlineMath math={t.label} />
                  </button>
              ))}
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <textarea 
                ref={textAreaRef}
                className="h-1/2 p-4 outline-none resize-none font-mono text-sm text-slate-800 bg-white border-b border-slate-200 focus:bg-slate-50 transition-colors" 
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="Start typing your LaTeX here... or click the buttons above to insert."
              />
              <div className="h-1/2 bg-slate-100/50 p-4 overflow-auto flex items-center justify-center relative">
                 {result ? <LatexPreview latex={result} /> : <span className="text-slate-400 italic text-sm absolute">Live Preview</span>}
              </div>
            </div>
          </div>

          {simplexResult && (
             <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white flex flex-col min-h-[200px] p-6 markdown-body prose prose-sm max-w-none">
               <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">Simplex Result</h3>
               <Markdown remarkPlugins={[remarkGfm]}>{simplexResult}</Markdown>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
