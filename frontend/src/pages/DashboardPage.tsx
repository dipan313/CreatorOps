import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Play, FolderKanban, Trash2, ArrowRight, Lightbulb, Compass, ShieldCheck } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { apiService } from '../services/api';
import { Project } from '../types';
import { audioEngine } from '../services/AudioEngine';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form State
  const [ideaPrompt, setIdeaPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [audience, setAudience] = useState('Tech Founders & Content Marketers');
  const [tone, setTone] = useState('Informative & High Energy');
  const [visualStyle, setVisualStyle] = useState('Modern Dark Aesthetic');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const list = await apiService.getProjects();
      setProjects(list);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  const presetTemplates = [
    {
      label: '⚡ AI Agent Masterclass',
      prompt: 'How to automate content production with a 6-agent AI studio using LangGraph and Gemini in 2026',
      platform: 'YouTube',
      audience: 'AI Engineers & Content Creators',
    },
    {
      label: '🚀 Tech Product Launch',
      prompt: 'Introducing a high-throughput developer platform that cuts deployment times by 80%',
      platform: 'LinkedIn',
      audience: 'CTOs & DevOps Leaders',
    },
    {
      label: '💻 Dev Tool Breakdown',
      prompt: 'Why modern software teams are shifting from legacy frameworks to agentic microservices',
      platform: 'Blog',
      audience: 'Senior Software Engineers',
    },
  ];

  const handleApplyPreset = (preset: typeof presetTemplates[0]) => {
    audioEngine.playClick();
    setIdeaPrompt(preset.prompt);
    setPlatform(preset.platform);
    setAudience(preset.audience);
  };

  const handleCreateAndGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaPrompt.trim()) return;

    try {
      audioEngine.playClick();
      setCreating(true);
      const projTitle = title.trim() || ideaPrompt.slice(0, 30) + '...';
      const project = await apiService.createProject({
        title: projTitle,
        platform,
        audience,
        tone,
        visual_style: visualStyle,
      });

      const gen = await apiService.startGeneration({
        project_id: project.id,
        idea_prompt: ideaPrompt,
      });

      navigate(`/workspace/${gen.generation_id}`);
    } catch (err) {
      console.error('Failed to start generation', err);
      // Fallback redirect for offline demo
      const fallbackId = 'demo-gen-' + Date.now();
      navigate(`/workspace/${fallbackId}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      audioEngine.playClick();
      await apiService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full">
        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
                OmniStudio Control Center
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">Ready to Launch</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <FolderKanban className="w-8 h-8 text-purple-400" />
              CreatorOps Campaign Studio
            </h1>
          </div>
        </div>

        {/* MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: FORM INPUT & PRESETS */}
          <div className="lg:col-span-2 space-y-6">
            {/* QUICK PRESETS BANNER */}
            <div className="glass-panel p-5 rounded-3xl border border-purple-500/20">
              <div className="flex items-center gap-2 text-xs font-mono uppercase font-bold text-purple-300 mb-3">
                <Lightbulb className="w-4 h-4 text-purple-400" />
                <span>Instant Campaign Blueprints</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {presetTemplates.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleApplyPreset(preset)}
                    className="p-3 rounded-2xl bg-slate-900/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors">
                      {preset.label}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">{preset.platform} • {preset.audience.slice(0, 18)}...</div>
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN FORM PANEL */}
            <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 purple-glow">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Configure Multi-Agent Pipeline Parameters
              </h2>

              <form onSubmit={handleCreateAndGenerate} className="space-y-6">
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-2">
                    1. Core Content Concept or Idea *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={ideaPrompt}
                    onChange={(e) => setIdeaPrompt(e.target.value)}
                    placeholder="e.g. How to use AI multi-agent workflows to automate content creation and scale video output by 5x in 2026"
                    className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Project Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="AI Production Blueprint"
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Target Platform
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                    >
                      <option value="YouTube">YouTube (Long-form & Shorts)</option>
                      <option value="Instagram">Instagram (Reels & Carousel)</option>
                      <option value="LinkedIn">LinkedIn (Article & Visual Post)</option>
                      <option value="Podcast">Podcast (Show Notes & Audio Script)</option>
                      <option value="Blog">Blog (Deep-dive SEO Guide)</option>
                      <option value="TikTok">TikTok (Viral Short)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Target Audience Persona
                    </label>
                    <input
                      type="text"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      placeholder="Tech Founders, Marketers, Creators"
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Tone of Voice
                    </label>
                    <input
                      type="text"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      placeholder="Informative, High Energy, Authoritative"
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creating || !ideaPrompt.trim()}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-base shadow-xl shadow-purple-600/30 hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {creating ? (
                    <span>Initializing Multi-Agent Pipeline...</span>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-white" />
                      <span>Launch Multi-Agent Campaign Pipeline</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: RECENT PROJECTS & TELEMETRY */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>Campaign History</span>
                <span className="text-xs font-mono text-slate-500">{projects.length} Total</span>
              </h3>

              {loading ? (
                <div className="py-10 text-center text-slate-500 text-sm">Loading projects...</div>
              ) : projects.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-2xl">
                  No previous projects found. Apply a blueprint above to start!
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        audioEngine.playClick();
                        navigate(`/workspace/${proj.id}`);
                      }}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm group-hover:text-purple-300 transition-colors">
                          {proj.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                          <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded">
                            {proj.platform}
                          </span>
                          <span>•</span>
                          <span>{proj.audience.slice(0, 16)}...</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteProject(proj.id, e)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Agents automatically evaluate output quality against a 90/100 threshold gate.</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
