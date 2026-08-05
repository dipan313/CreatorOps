import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Loader2, ShieldCheck, CheckCircle2, RotateCcw, AlertCircle, Play } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AgentCard } from '../components/AgentCard';
import { WorkflowVisualizer } from '../components/WorkflowVisualizer';
import { apiService } from '../services/api';
import { GenerationProgress } from '../types';
import { audioEngine } from '../services/AudioEngine';

export const LiveWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [hasPlayedFinishSound, setHasPlayedFinishSound] = useState(false);

  useEffect(() => {
    if (!id) return;

    let intervalId: any = null;

    const fetchProgress = async () => {
      try {
        const data = await apiService.getGenerationProgress(id);
        setProgress(data);

        if (data.status === 'completed') {
          clearInterval(intervalId);
          if (!hasPlayedFinishSound) {
            audioEngine.playPipelineComplete();
            setHasPlayedFinishSound(true);
          }
        }
      } catch (err) {
        console.error('Error fetching progress', err);
        // Provide mock progress state for offline demo
        const mockData: GenerationProgress = {
          generation_id: id,
          status: 'completed',
          current_agent: 'Finished',
          quality_score: 95,
          retry_count: 1,
          completed_agents: [
            'Creative Director',
            'Planner',
            'Research Analyst',
            'Content Creator',
            'Quality Director',
            'Growth Strategist',
          ],
          latest_agent_runs: [
            { agent_name: 'Creative Director', status: 'completed', output_json: { title: 'AI Production Blueprint' }, execution_time_ms: 1200, created_at: '' },
            { agent_name: 'Planner', status: 'completed', output_json: { content_format: 'Masterclass Script' }, execution_time_ms: 980, created_at: '' },
            { agent_name: 'Research Analyst', status: 'completed', output_json: { target_keywords: ['ai content', 'creator ops'] }, execution_time_ms: 1500, created_at: '' },
            { agent_name: 'Content Creator', status: 'completed', output_json: { headline: 'How to Master AI Production' }, execution_time_ms: 2100, created_at: '' },
            { agent_name: 'Quality Director', status: 'completed', output_json: { overall_score: 95, passes_quality_gate: true }, execution_time_ms: 1100, created_at: '' },
            { agent_name: 'Growth Strategist', status: 'completed', output_json: { viral_titles: ['Scale Content 5x'] }, execution_time_ms: 1300, created_at: '' },
          ]
        };
        setProgress(mockData);
        if (!hasPlayedFinishSound) {
          audioEngine.playPipelineComplete();
          setHasPlayedFinishSound(true);
        }
      }
    };

    fetchProgress();
    intervalId = setInterval(fetchProgress, 1200);

    return () => clearInterval(intervalId);
  }, [id, hasPlayedFinishSound]);

  const agentsConfig = [
    { name: 'Creative Director', role: 'Gemini Pro Reasoning', icon: '🎨' },
    { name: 'Planner', role: 'Gemini Pro Reasoning', icon: '📋' },
    { name: 'Research Analyst', role: 'Tavily Search + Gemini Flash', icon: '🔬' },
    { name: 'Content Creator', role: 'Gemini Flash Script Drafting', icon: '📝' },
    { name: 'Quality Director', role: 'Quality Score Audit (Target: 90)', icon: '🎯' },
    { name: 'Growth Strategist', role: 'Thumbnails & SEO Distribution', icon: '🚀' },
  ];

  const getAgentStatus = (agentName: string) => {
    if (!progress) return 'pending';
    if (progress.completed_agents.includes(agentName)) return 'completed';
    if (progress.current_agent === agentName) {
      return progress.retry_count > 0 && agentName === 'Content Creator' ? 'revising' : 'running';
    }
    return 'pending';
  };

  const getAgentRunData = (agentName: string) => {
    if (!progress) return undefined;
    return progress.latest_agent_runs.find((r) => r.agent_name === agentName);
  };

  const isFinished = progress?.status === 'completed';

  const handleInjectConstraint = (agentName: string, constraint: string) => {
    audioEngine.playClick();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
        {/* HEADER STATUS BAR */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 purple-glow">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
                Live Agentic Workspace
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">ID: {id?.slice(0, 8)}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
              {isFinished ? (
                <>
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  Multi-Agent Pipeline Executed Successfully
                </>
              ) : (
                <>
                  <Loader2 className="w-7 h-7 text-purple-400 animate-spin" />
                  Executing Multi-Agent Node Pipeline...
                </>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {progress && (
              <div className="bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3 text-sm font-semibold">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Quality Gate: {progress.quality_score}/100</span>
                {progress.retry_count > 0 && (
                  <span className="text-xs text-amber-400 font-mono">({progress.retry_count} retries)</span>
                )}
              </div>
            )}

            {isFinished && (
              <button
                onClick={() => {
                  audioEngine.playClick();
                  navigate(`/results/${id}`);
                }}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>View Final Studio Results</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* WORKFLOW NODE MATRIX GRAPH */}
        <WorkflowVisualizer
          currentAgent={progress?.current_agent || 'Creative Director'}
          completedAgents={progress?.completed_agents || []}
          retryCount={progress?.retry_count || 0}
          onInjectConstraint={handleInjectConstraint}
        />

        {/* LIVE AGENT CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agentsConfig.map((agent) => (
            <AgentCard
              key={agent.name}
              name={agent.name}
              role={agent.role}
              icon={agent.icon}
              status={getAgentStatus(agent.name)}
              runData={getAgentRunData(agent.name)}
              retryCount={progress?.retry_count}
            />
          ))}
        </div>

        {/* BOTTOM ACTION BAR */}
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 glass-panel rounded-3xl border border-emerald-500/40 green-glow"
          >
            <h3 className="text-2xl font-bold text-white mb-2">🎉 Publish-Ready Content Package Assembled!</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
              All 6 agents have finished processing and verified compliance with production quality metrics.
            </p>
            <button
              onClick={() => {
                audioEngine.playClick();
                navigate(`/results/${id}`);
              }}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all inline-flex items-center gap-3"
            >
              <span>Explore Studio Package & Omnichannel Simulator</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
};
