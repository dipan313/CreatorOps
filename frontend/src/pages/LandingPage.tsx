import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Bot, ShieldCheck, Zap, Layers, FileText, Share2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-28 px-6 text-center overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-purple-600/30 via-indigo-600/20 to-cyan-500/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-8"
            >
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Multi-Agent AI Studio Engine v1.0</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6"
            >
              From a Single Idea to a{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                Publish-Ready Package
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10"
            >
              CreatorOps AI orchestrates a team of 6 specialized AI agents—Creative Director, Planner, Research Analyst, Content Creator, Quality Director, and Growth Strategist—to automate your complete production pipeline.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 hover:scale-105 transition-all flex items-center justify-center gap-3"
              >
                <span>Launch Creator Studio</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/creative-direction"
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-slate-300 hover:text-white font-semibold text-base border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Agent Pipeline</span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* AGENT LINEUP GRID */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-3">Meet Your AI Production Team</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Every agent specializes in a distinct stage of the content creation lifecycle, operating under LangGraph orchestration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎨', title: 'Creative Director', role: 'Gemini Pro Reasoning', desc: 'Analyzes core topic, target audience, brand voice, positioning, and strategic messaging.' },
              { icon: '📋', title: 'Production Planner', role: 'Gemini Pro Reasoning', desc: 'Constructs section-by-section narrative arc, duration estimates, and asset checklists.' },
              { icon: '🔬', title: 'Research Analyst', role: 'Tavily Search + Gemini', desc: 'Gathers live web trend data, competitor benchmarks, stats, and search keywords.' },
              { icon: '📝', title: 'Content Creator', role: 'Gemini Flash Drafting', desc: 'Drafts publication-ready scripts, articles, posts, and hooks in clean Markdown.' },
              { icon: '🎯', title: 'Quality Director', role: 'Score Threshold: 90/100', desc: 'Audits content quality. Automatically triggers revision loops if score falls below 90.' },
              { icon: '🚀', title: 'Growth Strategist', role: 'Distribution Assets', desc: 'Generates viral headlines, SEO tags, posting schedule, and AI thumbnail visual prompts.' },
            ].map((agent, i) => (
              <motion.div
                key={agent.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 rounded-2xl relative group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {agent.icon}
                </div>
                <span className="text-[11px] uppercase font-mono tracking-wider text-purple-400 font-semibold block mb-1">
                  {agent.role}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{agent.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{agent.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* QUALITY LOOP HIGHLIGHT */}
        <section className="py-16 px-6 max-w-5xl mx-auto my-12 glass-panel rounded-3xl border border-purple-500/30 purple-glow">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-4">
            <div className="space-y-4 max-w-xl">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full inline-block">
                ⚡ Automated Quality Loop
              </span>
              <h3 className="text-3xl font-bold text-white">Never Publish Subpar Content Again</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                If the Quality Director scores a draft below <strong>90/100</strong>, the LangGraph workflow automatically routes actionable feedback back to the Content Creator for up to 3 retries until quality standards are met.
              </p>
            </div>
            <div className="w-full md:w-auto flex flex-col items-center justify-center bg-slate-900/80 border border-slate-800 p-6 rounded-2xl text-center">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mb-2 animate-pulse" />
              <span className="text-3xl font-extrabold text-white">90/100</span>
              <span className="text-xs font-mono text-slate-400">Quality Gate Threshold</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
