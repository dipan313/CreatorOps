import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RefreshCcw, ShieldCheck, Zap, Sliders, CheckCircle2, Loader2, Sparkles, X, MessageSquare } from 'lucide-react';
import { audioEngine } from '../services/AudioEngine';

interface WorkflowVisualizerProps {
  currentAgent: string;
  completedAgents: string[];
  retryCount: number;
  onInjectConstraint?: (agentName: string, constraint: string) => void;
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  currentAgent,
  completedAgents = [],
  retryCount = 0,
  onInjectConstraint,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [steeringAgent, setSteeringAgent] = useState<string | null>(null);
  const [customConstraint, setCustomConstraint] = useState('');
  const [injectedConstraints, setInjectedConstraints] = useState<Record<string, string>>({});

  const agents = [
    { name: 'Creative Director', icon: '🎨', role: 'Brand & Concept Strategy', color: 'from-purple-500 to-indigo-500' },
    { name: 'Planner', icon: '📋', role: 'Narrative Arc & Structure', color: 'from-indigo-500 to-cyan-500' },
    { name: 'Research Analyst', icon: '🔬', role: 'Real-time Tavily Research', color: 'from-cyan-500 to-teal-500' },
    { name: 'Content Creator', icon: '📝', role: 'Markdown & Copy Drafting', color: 'from-teal-500 to-emerald-500' },
    { name: 'Quality Director', icon: '🎯', role: 'Score Audit (Gate: 90/100)', color: 'from-amber-500 to-rose-500' },
    { name: 'Growth Strategist', icon: '🚀', role: 'SEO, Thumbnails & Virality', color: 'from-rose-500 to-purple-500' },
  ];

  const getAgentStatus = (agentName: string) => {
    if (completedAgents.includes(agentName)) return 'completed';
    if (currentAgent === agentName) {
      return retryCount > 0 && agentName === 'Content Creator' ? 'revising' : 'running';
    }
    return 'pending';
  };

  const handleSaveConstraint = () => {
    if (!steeringAgent || !customConstraint.trim()) return;
    audioEngine.playClick();
    setInjectedConstraints((prev) => ({ ...prev, [steeringAgent]: customConstraint }));
    if (onInjectConstraint) {
      onInjectConstraint(steeringAgent, customConstraint);
    }
    setSteeringAgent(null);
    setCustomConstraint('');
  };

  return (
    <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 purple-glow space-y-6">
      {/* CANVAS HEADER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
              Dynamic Node Matrix Canvas
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-emerald-400">Live Orchestrator</span>
          </div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-3">
            <Zap className="w-6 h-6 text-purple-400" />
            LangGraph Multi-Agent Node Execution Graph
          </h3>
        </div>

        {/* PIPELINE STEERING CONTROLS */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioEngine.playClick();
              setIsPaused(!isPaused);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isPaused ? 'Resume Node Matrix' : 'Pause Pipeline Graph'}</span>
          </button>
        </div>
      </div>

      {/* INTERACTIVE NODE GRAPH CABLE MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
        {agents.map((agent, index) => {
          const status = getAgentStatus(agent.name);
          const isCurrent = currentAgent === agent.name;
          const isDone = completedAgents.includes(agent.name);
          const constraint = injectedConstraints[agent.name];

          return (
            <motion.div
              key={agent.name}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${
                isCurrent
                  ? 'bg-purple-900/40 border-purple-500 purple-glow scale-105 z-10'
                  : isDone
                  ? 'bg-slate-900/80 border-emerald-500/40'
                  : 'bg-slate-950/60 border-slate-800 opacity-70'
              }`}
            >
              {/* NODE HEADER */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{agent.icon}</span>
                  <div className="flex items-center gap-1">
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {isCurrent && <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />}
                    <button
                      onClick={() => {
                        audioEngine.playClick();
                        setSteeringAgent(agent.name);
                        setCustomConstraint(constraint || '');
                      }}
                      title="Inject custom prompt constraint to node"
                      className="p-1 text-slate-500 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-white text-xs mb-1">{agent.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{agent.role}</p>
              </div>

              {/* INJECTED CONSTRAINT BADGE */}
              {constraint && (
                <div className="mt-3 p-1.5 rounded-lg bg-purple-950/80 border border-purple-500/40 text-[10px] text-purple-300 flex items-center gap-1 font-mono">
                  <MessageSquare className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="truncate">{constraint}</span>
                </div>
              )}

              {/* NODE FOOTER */}
              <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className={isDone ? 'text-emerald-400 font-bold' : isCurrent ? 'text-purple-300 font-bold' : 'text-slate-500'}>
                  {status.toUpperCase()}
                </span>
                <span className="text-slate-500">N#{index + 1}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* HUMAN-IN-THE-LOOP PROMPT INJECTION MODAL */}
      <AnimatePresence>
        {steeringAgent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-purple-500/40 purple-glow space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  Steer Agent: {steeringAgent}
                </h4>
                <button
                  onClick={() => setSteeringAgent(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Inject custom instructions or parameters directly into this agent node prior to final evaluation.
              </p>

              <textarea
                rows={3}
                value={customConstraint}
                onChange={(e) => setCustomConstraint(e.target.value)}
                placeholder="e.g. Focus on Developer SaaS metrics, use high retention pattern interrupts, avoid buzzwords."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSteeringAgent(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveConstraint}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
                >
                  Inject Node Constraint
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
