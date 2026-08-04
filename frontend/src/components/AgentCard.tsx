import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Clock, AlertTriangle } from 'lucide-react';
import { AgentRun } from '../types';

interface AgentCardProps {
  name: string;
  role: string;
  icon: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'revising';
  runData?: AgentRun;
  executionTime?: number;
  retryCount?: number;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  role,
  icon,
  status,
  runData,
  executionTime = 0,
  retryCount = 0,
}) => {
  const isRunning = status === 'running' || status === 'revising';
  const isCompleted = status === 'completed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-5 rounded-2xl transition-all ${
        isRunning
          ? 'glass-card border-purple-500/60 purple-glow bg-purple-950/20'
          : isCompleted
          ? 'glass-card border-emerald-500/40 bg-emerald-950/10'
          : 'glass-card border-slate-800 opacity-60'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
              isRunning
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse'
                : isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {icon}
          </div>
          <div>
            <h4 className="font-bold text-slate-100 text-base flex items-center gap-2">
              {name}
              {retryCount > 0 && name === 'Quality Director' && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                  Loop #{retryCount}
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-400 font-medium">{role}</p>
          </div>
        </div>

        <div>
          {isRunning && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Thinking...
            </span>
          )}
          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ready
            </span>
          )}
          {status === 'pending' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              Queued
            </span>
          )}
        </div>
      </div>

      {runData && runData.output_json && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <p className="text-xs font-mono text-purple-300/90 mb-1 line-clamp-2">
            💡 {runData.output_json.title || runData.output_json.headline || runData.output_json.actionable_feedback || runData.output_json.content_format || runData.output_json.best_posting_times || 'Agent output generated successfully.'}
          </p>
          {runData.execution_time_ms > 0 && (
            <span className="text-[10px] font-mono text-slate-500">
              ⚡ Executed in {(runData.execution_time_ms / 1000).toFixed(2)}s
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
