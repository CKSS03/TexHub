import React from 'react';
import { Camera, Table, SquareFunction, FileText, HelpCircle, Library } from 'lucide-react';
import { cn } from '../lib/utils';
import { ToolType } from '../App';

interface SidebarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
}

export function Sidebar({ activeTool, setActiveTool }: SidebarProps) {
  const navItems: { id: ToolType; label: string; icon: React.ReactNode }[] = [
    { id: 'ocr', label: 'Math OCR', icon: <Camera className="w-5 h-5" /> },
    { id: 'table', label: 'Table Generator', icon: <Table className="w-5 h-5" /> },
    { id: 'equation', label: 'Equation Builder', icon: <SquareFunction className="w-5 h-5" /> },
    { id: 'doc', label: 'Doc Converter', icon: <FileText className="w-5 h-5" /> },
    { id: 'bib', label: 'Bibliography', icon: <Library className="w-5 h-5" /> },
    { id: 'cheatsheet', label: 'Cheat Sheet', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 z-10 transition-all shadow-md md:shadow-none">
      <div className="p-4 md:p-6 flex items-center justify-between md:block">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <SquareFunction className="w-6 h-6 text-indigo-400" />
            TeXHub
          </h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold hidden md:block">
            For Researchers
          </p>
        </div>
      </div>
      <nav className="px-4 space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto flex md:flex-col pb-4 md:pb-0 scrollbar-hide md:flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTool(item.id)}
            className={cn(
              "whitespace-nowrap flex flex-row items-center gap-2 md:gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
              activeTool === item.id 
                ? "bg-slate-800 text-white" 
                : "hover:bg-slate-800/50 hover:text-white"
            )}
          >
            {item.icon}
            <span className="hidden sm:inline md:inline">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="hidden md:block p-4 text-xs text-slate-500 border-t border-slate-800">
        Powered by Modal
      </div>
    </aside>
  );
}
