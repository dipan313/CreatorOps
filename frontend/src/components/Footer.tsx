import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950 py-10 px-6 mt-20 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-slate-200">CreatorOps AI</span> — Multi-Agent Production Studio
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-500">
          <span>Powered by LangGraph & Google Gemini</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            Built for High-Growth Creators <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </span>
        </div>
      </div>
    </footer>
  );
};
