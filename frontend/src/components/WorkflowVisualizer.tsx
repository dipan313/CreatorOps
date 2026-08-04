import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface WorkflowVisualizerProps {
  currentAgent: string;
  completedAgents: string[];
  retryCount?: number;
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  currentAgent,
  completedAgents,
  retryCount = 0,
}) => {
  const agents = [
    { id: 'Creative Director', label: 'Creative Director', icon: '🎨' },
    { id: 'Planner', label: 'Planner', icon: '📋' },
    { id: 'Research Analyst', label: 'Research Analyst', icon: '🔬' },
    { id: 'Content Creator', label: 'Content Creator', icon: '📝' },
    { id: 'Quality Director', label: 'Quality Director', icon: '🎯' },
    { id: 'Growth Strategist', label: 'Growth Strategist', icon: '🚀' },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 my-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
          ⚡ LangGraph Agent Pipeline & Quality Loop
        </h3>
        {retryCount > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-full">
            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            Quality Loop Active (Retry {retryCount}/3)
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {agents.map((agent, index) => {
          const isDone = completedAgents.includes(agent.id);
          const isCurrent = currentAgent === agent.id;

          return (
            <React.Fragment key={agent.id}>
              <div
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/60 purple-glow scale-105'
                    : isDone
                    ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                <span>{agent.icon}</span>
                <span>{agent.label}</span>
              </div>
              {index < agents.length - 1 && (
                <ArrowRight className={`w-4 h-4 hidden sm:block ${isDone ? 'text-emerald-500' : 'text-slate-700'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
