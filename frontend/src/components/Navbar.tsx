import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Command, Volume2, VolumeX, Compass, FolderKanban, ShieldCheck } from 'lucide-react';
import { audioEngine } from '../services/AudioEngine';
import { CommandPalette } from './CommandPalette';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(audioEngine.getMutedState());

  const handleToggleMute = () => {
    const nextState = audioEngine.toggleMute();
    setIsMuted(nextState);
    if (!nextState) audioEngine.playClick();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white tracking-tight">CreatorOps</span>
                <span className="text-xs font-mono font-extrabold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                  OMNI v2.0
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                Multi-Agent Studio Engine
              </span>
            </div>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all flex items-center gap-2 ${
                isActive('/dashboard')
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Studio Workspace</span>
            </Link>

            <Link
              to="/creative-direction"
              className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all flex items-center gap-2 ${
                isActive('/creative-direction')
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Creative Framework</span>
            </Link>
          </nav>

          {/* RIGHT ACTION BAR */}
          <div className="flex items-center gap-3">
            {/* COMMAND PALETTE BUTTON */}
            <button
              onClick={() => {
                audioEngine.playClick();
                setIsCommandPaletteOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono font-medium transition-all flex items-center gap-2"
            >
              <Command className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Commands</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-950 border border-slate-700 rounded text-[10px] text-slate-400">
                Ctrl+K
              </kbd>
            </button>

            {/* AUDIO SOUND FX TOGGLE */}
            <button
              onClick={handleToggleMute}
              title={isMuted ? 'Unmute UI Sound FX' : 'Mute UI Sound FX'}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-purple-500/40 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
            </button>

            {/* CREATE CAMPAIGN CTA */}
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Campaign</span>
            </Link>
          </div>
        </div>
      </header>

      {/* COMMAND PALETTE OVERLAY */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
};
