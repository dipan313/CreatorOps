import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Target, Zap, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const CreativeDirectionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/dashboard"
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <Compass className="w-8 h-8 text-purple-400" />
              Creative Direction Framework
            </h1>
            <p className="text-slate-400 text-sm">
              Strategic blueprint & agent architecture governing every content generation session.
            </p>
          </div>
        </div>

        {/* STRATEGY GRID */}
        <div className="space-y-8">
          <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 purple-glow">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎨</span>
              <h2 className="text-xl font-bold text-white">Creative Director Thesis</h2>
            </div>
            <p className="text-slate-300 leading-relaxed text-base mb-6">
              The Creative Director establishes high-level brand positioning before any code or script is written. By combining viewer psychology, platform algorithms, and distinct tone parameters, the Creative Director ensures content stands out in noisy feeds.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                <Target className="w-6 h-6 text-purple-400 mb-2" />
                <h4 className="font-bold text-white text-sm mb-1">Audience Persona Mapping</h4>
                <p className="text-xs text-slate-400">Tailors messaging specifically to high-intent decision makers and engaged followers.</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                <Zap className="w-6 h-6 text-cyan-400 mb-2" />
                <h4 className="font-bold text-white text-sm mb-1">Hook Engineering</h4>
                <p className="text-xs text-slate-400">Packs maximum curiosity and pattern interrupts into the opening 5 seconds.</p>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="font-bold text-white text-sm mb-1">Quality Gate Guarantee</h4>
                <p className="text-xs text-slate-400">Ensures no output is finalized unless it scores 90+ across clarity and engagement metrics.</p>
              </div>
            </div>
          </div>

          <div className="text-center pt-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-500/25 hover:scale-105 transition-all"
            >
              <span>Launch a Campaign with Creative Direction</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
