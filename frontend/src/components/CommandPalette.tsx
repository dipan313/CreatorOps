import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, FolderKanban, BookOpen, Download, Volume2, VolumeX, ShieldCheck, Compass, X, Command } from 'lucide-react';
import { audioEngine } from '../services/AudioEngine';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isMuted, setIsMuted] = useState(audioEngine.getMutedState());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          audioEngine.playClick();
          // Reset query
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'new-generation',
      title: 'Start New Agentic Campaign',
      category: 'Actions',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      run: () => navigate('/dashboard'),
    },
    {
      id: 'creative-direction',
      title: 'View Creative Direction Framework',
      category: 'Navigation',
      icon: <Compass className="w-4 h-4 text-cyan-400" />,
      run: () => navigate('/creative-direction'),
    },
    {
      id: 'view-dashboard',
      title: 'Go to Workspace Dashboard',
      category: 'Navigation',
      icon: <FolderKanban className="w-4 h-4 text-emerald-400" />,
      run: () => navigate('/dashboard'),
    },
    {
      id: 'toggle-sound',
      title: isMuted ? 'Unmute Futuristic UI Sound FX' : 'Mute UI Sound FX',
      category: 'Settings',
      icon: isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />,
      run: () => {
        const nextState = audioEngine.toggleMute();
        setIsMuted(nextState);
        if (!nextState) audioEngine.playClick();
      },
    },
  ];

  const filteredActions = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-2xl glass-panel border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl purple-glow"
        >
          {/* SEARCH INPUT BAR */}
          <div className="flex items-center px-6 py-4 border-b border-slate-800 bg-slate-900/60">
            <Search className="w-5 h-5 text-purple-400 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search workspace... (Esc to exit)"
              className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-base font-medium"
            />
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ACTIONS LIST */}
          <div className="max-h-[360px] overflow-y-auto p-4 space-y-2">
            {filteredActions.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                No commands matching "{query}"
              </div>
            ) : (
              filteredActions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => {
                    audioEngine.playClick();
                    action.run();
                    onClose();
                  }}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 hover:bg-purple-900/20 border border-transparent hover:border-purple-500/30 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 group-hover:border-purple-500/40">
                      {action.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200 group-hover:text-white">
                        {action.title}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">{action.category}</div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-500 group-hover:text-purple-400">
                    Execute ↵
                  </span>
                </div>
              ))
            )}
          </div>

          {/* FOOTER BAR */}
          <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Command className="w-3.5 h-3.5 text-purple-400" />
              <span>CreatorOps OmniStudio Command Engine</span>
            </div>
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-slate-300">Esc</kbd> Close</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
