import React, { useState } from 'react';
import { Loader2, Copy, Check, Table2 } from 'lucide-react';
import { LatexPreview } from './LatexPreview';

export function TableGen() {
  const [data, setData] = useState('');
  const [hasHeaders, setHasHeaders] = useState(true);
  const [alignment, setAlignment] = useState('center');
  const [tableStyle, setTableStyle] = useState('booktabs');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!data.trim()) return;
    
    setLoading(true);
    setError(null);

    const formatOptions = `Style: ${tableStyle}. Alignment: ${alignment}. Headers: ${hasHeaders ? 'yes' : 'no'}.`;

    try {
      const backendUrl = import.meta.env.VITE_MODAL_URL || 'https://your-modal-endpoint.modal.run';
      const res = await fetch(`${backendUrl}/convert/table`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, formatOptions }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Conversion failed');
      setResult(json.latex);
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
          <div className="flex flex-col flex-1 gap-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Table2 className="w-4 h-4 text-indigo-500" />
              Raw Data (CSV, Excel paste, Text)
            </label>
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="Paste your CSV, Excel data, or Pandas output here..."
              className="flex-1 w-full border border-slate-300 rounded-lg p-4 text-sm font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none bg-slate-50"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Style</label>
              <select value={tableStyle} onChange={(e) => setTableStyle(e.target.value)} className="border border-slate-300 rounded p-2 text-sm w-full">
                <option value="booktabs">Booktabs</option>
                <option value="standard">Standard (Borders)</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">Alignment</label>
              <select value={alignment} onChange={(e) => setAlignment(e.target.value)} className="border border-slate-300 rounded p-2 text-sm w-full">
                <option value="center">Center</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div className="flex items-center sm:items-end pb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                <input type="checkbox" checked={hasHeaders} onChange={(e) => setHasHeaders(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500" />
                Has Headers
              </label>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={!data.trim() || loading}
            className="bg-indigo-600 text-white w-full py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Generating Table...' : 'Generate LaTeX Table'}
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
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Generated LaTeX</span>
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
            placeholder="Generated LaTeX will appear here..."
            readOnly 
          />
        </div>
      </div>
    </div>
  );
}
