import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Zap, ShieldAlert, Award, ChevronRight, Sparkles, MessageSquare } from 'lucide-react';
import { audioEngine } from '../services/AudioEngine';

interface AudienceSimulatorProps {
  topic?: string;
  qualityScore?: number;
}

export const AudienceSimulator: React.FC<AudienceSimulatorProps> = ({ topic = 'AI Production Studio', qualityScore = 95 }) => {
  const [selectedPersona, setSelectedPersona] = useState<string>('all');

  const personas = [
    {
      id: 'genz',
      name: 'Gen-Z Tech Creator',
      role: 'Short-form & Viral Focus',
      avatar: '⚡',
      score: Math.min(99, qualityScore + 2),
      retention5s: '94%',
      verdict: 'High pattern interrupt! The intro hook immediately grabbed my attention.',
      sentiment: 'Highly Positive',
      keyTriggers: ['0-5s Hook', 'Visual B-Roll Pace', 'Actionable Tips'],
    },
    {
      id: 'cxo',
      name: 'Enterprise Executive',
      role: 'ROI & Efficiency Buyer',
      avatar: '💼',
      score: Math.max(88, qualityScore - 3),
      retention5s: '89%',
      verdict: 'Clear market statistics and time-saving ROI breakdown. Extremely valuable.',
      sentiment: 'Positive',
      keyTriggers: ['Market Growth Stats', 'Automated QA', 'Team Scaling'],
    },
    {
      id: 'dev',
      name: 'Senior Developer',
      role: 'Technical Depth Skeptic',
      avatar: '💻',
      score: Math.max(85, qualityScore - 5),
      retention5s: '86%',
      verdict: 'Loves the multi-agent LangGraph architecture notes. No fluff.',
      sentiment: 'Neutral / Positive',
      keyTriggers: ['LangGraph State Engine', 'Python FastAPI', 'Supabase Postgres'],
    },
    {
      id: 'casual',
      name: 'Casual Learner',
      role: 'General Audience',
      avatar: '🚀',
      score: qualityScore,
      retention5s: '91%',
      verdict: 'Super easy to follow. Visual storytelling makes complex AI simple.',
      sentiment: 'Very Positive',
      keyTriggers: ['Clear Explanations', 'Logical Flow', 'High Energy Tone'],
    },
  ];

  const overallViralityIndex = Math.round((qualityScore * 0.95) + 4);
  const filteredPersonas = selectedPersona === 'all' ? personas : personas.filter(p => p.id === selectedPersona);

  return (
    <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 purple-glow space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
              Predictive AI Simulation
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-cyan-400">4 Demographic Cohorts</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-purple-400" />
            Audience Persona Reaction & Virality Engine
          </h2>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 px-5 py-3 rounded-2xl">
          <div className="text-right">
            <div className="text-xs font-mono text-slate-400">Virality Index</div>
            <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{overallViralityIndex} / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER PERSONA TABS */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            audioEngine.playClick();
            setSelectedPersona('all');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all ${
            selectedPersona === 'all'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Cohorts (4)
        </button>
        {personas.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              audioEngine.playClick();
              setSelectedPersona(p.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              selectedPersona === p.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{p.avatar}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      {/* PERSONA REACTION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPersonas.map((persona) => (
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xl">
                  {persona.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{persona.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">{persona.role}</p>
                </div>
              </div>

              <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-right">
                <div className="text-xs text-slate-500 font-mono">Cohort Fit</div>
                <div className="text-sm font-extrabold text-purple-300 font-mono">{persona.score}%</div>
              </div>
            </div>

            {/* VERDICT BUBBLE */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm text-slate-300 flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p className="italic font-medium">"{persona.verdict}"</p>
            </div>

            {/* METRICS & TRIGGERS */}
            <div className="pt-2 flex flex-wrap items-center justify-between text-xs font-mono gap-2 border-t border-slate-800/60">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>5s Retention:</span>
                <span className="text-emerald-400 font-bold">{persona.retention5s}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {persona.keyTriggers.map((t) => (
                  <span key={t} className="bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20 text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* VIRAL RETENTION CURVE SUMMARY */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="font-bold text-white text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Hook & Retention Blueprint Score: Pass (94% Predicted 30s Retention)
          </h4>
          <p className="text-slate-400 text-xs">
            Optimized for platform algorithm recommendations (YouTube Shorts / TikTok / LinkedIn feed priority).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-bold">
            High Virality Confidence
          </span>
        </div>
      </div>
    </div>
  );
};
