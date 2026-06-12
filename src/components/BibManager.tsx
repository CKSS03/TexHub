import React, { useState, useRef, useMemo } from 'react';
import bibtexParse from 'bibtex-parse-js';
import { Search, Copy, Check, Plus, Upload, Book, Trash2 } from 'lucide-react';

interface BibEntry {
  citationKey: string;
  entryType: string;
  entryTags: Record<string, string>;
}

export function BibManager() {
  const [entries, setEntries] = useState<BibEntry[]>([]);
  const [rawInput, setRawInput] = useState('');
  const [search, setSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = bibtexParse.toJSON(text);
        setEntries((prev) => [...prev, ...parsed]);
      } catch (err) {
        alert('Invalid BibTeX file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleManualAdd = () => {
    try {
      const parsed = bibtexParse.toJSON(rawInput);
      setEntries((prev) => [...prev, ...parsed]);
      setRawInput('');
    } catch (err) {
      alert('Invalid BibTeX format.');
    }
  };

  const copyCitation = (key: string) => {
    navigator.clipboard.writeText(`\\cite{${key}}`);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const removeEntry = (key: string) => {
    setEntries((prev) => prev.filter((e) => e.citationKey !== key));
  };

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return entries;
    const lowerSearch = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.citationKey.toLowerCase().includes(lowerSearch) ||
        (e.entryTags.title && e.entryTags.title.toLowerCase().includes(lowerSearch)) ||
        (e.entryTags.author && e.entryTags.author.toLowerCase().includes(lowerSearch))
    );
  }, [entries, search]);

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[400px]">
        
        {/* Left Col: Import & Add */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-500" /> Upload File
            </h3>
            <p className="text-sm text-slate-500 mb-4">Upload a .bib file containing your references.</p>
            <input 
              type="file" 
              accept=".bib" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-slate-50 text-slate-700 border border-slate-300 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors"
            >
              Select .bib File
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col flex-1 min-h-[250px]">
            <h3 className="font-semibold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-500" /> Quick Add
            </h3>
            <textarea
              className="flex-1 w-full border border-slate-200 rounded-lg p-3 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-slate-50 mb-4"
              placeholder={'@article{key,\n  title={...},\n  author={...}\n}'}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
            />
            <button
              onClick={handleManualAdd}
              disabled={!rawInput.trim()}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              Parse & Add
            </button>
          </div>
        </div>

        {/* Right Col: Library */}
        <div className="md:col-span-2 flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Book className="w-5 h-5 text-indigo-500" /> Reference Library
              <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full ml-2">
                {entries.length}
              </span>
            </h3>
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search references..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4 bg-slate-50">
            {filteredEntries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                {entries.length === 0 ? "No references yet. Upload a file or add manually." : "No matching references found."}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map((entry) => (
                  <div key={entry.citationKey} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-indigo-300 transition-colors relative group">
                    <button 
                      onClick={() => removeEntry(entry.citationKey)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex justify-between items-start mb-2 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {entry.entryType}
                        </span>
                        <span className="text-sm font-mono text-slate-500">
                          {entry.citationKey}
                        </span>
                      </div>
                      <button
                        onClick={() => copyCitation(entry.citationKey)}
                        className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                      >
                        {copiedKey === entry.citationKey ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        Copy \cite
                      </button>
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-slate-900 leading-snug mb-1">
                        {entry.entryTags.title || '{No Title}'}
                      </h4>
                      <p className="text-sm text-slate-600 truncate">
                        {entry.entryTags.author ? entry.entryTags.author.replace(/ and /g, ', ') : '{No Author}'}
                        {entry.entryTags.year && ` (${entry.entryTags.year})`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
