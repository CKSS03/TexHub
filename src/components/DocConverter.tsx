import React, { useState } from 'react';
import { Loader2, Copy, Check, FileText } from 'lucide-react';
import { LatexPreview } from './LatexPreview';

export function DocConverter() {
  const [text, setText] = useState('');
  const [type, setType] = useState('markdown');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);

    try {
      const backendUrl = import.meta.env.VITE_MODAL_URL || 'https://your-modal-endpoint.modal.run';
      const res = await fetch(`${backendUrl}/convert/document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Conversion failed');
      setResult(json.latex || json.markdown);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        {/* Input Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4 mb-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="radio" value="markdown" checked={type === 'markdown'} onChange={(e) => setType(e.target.value)} />
              Markdown to LaTeX
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="radio" value="pseudocode" checked={type === 'pseudocode'} onChange={(e) => setType(e.target.value)} />
              Text to Pseudocode
            </label>
             <label className="flex items-center gap-2 text-sm font-medium">
              <input type="radio" value="bibliography" checked={type === 'bibliography'} onChange={(e) => setType(e.target.value)} />
              Raw to BibTeX
            </label>
          </div>

          <div className="flex flex-col flex-1 gap-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={type === 'bibliography' ? "Paste raw citations..." : type === 'pseudocode' ? "Describe your algorithm..." : "Paste markdown or Word text here..."}
              className="flex-1 w-full border border-slate-300 rounded-lg p-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-slate-50"
            />
          </div>

          <button
            onClick={handleConvert}
            disabled={!text.trim() || loading}
            className="bg-indigo-600 text-white w-full py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Converting...' : 'Convert to LaTeX / BibTeX'}
          </button>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
        </div>

        {/* Output Area */}
        <div className="flex flex-col h-full border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
          <div className="flex justify-between items-center bg-slate-100 px-4 py-3 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Output Code</span>
            <button 
              onClick={copyToClipboard}
              disabled={!result}
              className="text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <textarea 
            className="flex-1 p-4 bg-transparent outline-none resize-none font-mono text-sm text-slate-800" 
            value={result} 
            placeholder="Generated code will appear here..."
            readOnly 
          />
        </div>
      </div>
    </div>
  );
}
