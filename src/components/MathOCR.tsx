import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, Copy, Check } from 'lucide-react';
import { LatexPreview } from './LatexPreview';

export function MathOCR() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
      setResult('');
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const handleConvert = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const backendUrl = import.meta.env.VITE_MODAL_URL || 'https://your-modal-endpoint.modal.run';
      const res = await fetch(`${backendUrl}/convert/formula`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Conversion failed');
      setResult(data.latex);
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
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="flex flex-col items-center gap-4">
            <img src={preview} alt="Upload preview" className="max-h-48 rounded shadow-sm" />
            <p className="text-sm text-slate-500 font-medium">Click or drag to change image</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="w-10 h-10 text-slate-400" />
            <p className="text-slate-600 font-medium">Drag & drop an image here, or click to select</p>
            <p className="text-xs text-slate-400">Supports PNG, JPG, JPEG</p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleConvert}
          disabled={!file || loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? 'Processing Image...' : 'Convert to LaTeX'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      {result && (
        <div className="flex-1 min-h-0 flex flex-col gap-4">
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-slate-50 min-h-[16rem] md:min-h-0">
              <div className="flex justify-between items-center bg-slate-100 px-4 py-2 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Generated LaTeX</span>
                <button onClick={copyToClipboard} className="text-slate-500 hover:text-slate-700 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <textarea 
                className="flex-1 p-4 bg-transparent outline-none resize-none font-mono text-sm text-slate-700 w-full h-full" 
                value={result} 
                readOnly 
              />
            </div>
            
            <div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-white min-h-[16rem] md:min-h-0">
               <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Preview</span>
              </div>
              <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
                <LatexPreview latex={result} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
