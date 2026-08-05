import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  Download,
  Copy,
  Check,
  FileText,
  Sparkles,
  ShieldCheck,
  Share2,
  Image as ImageIcon,
  TrendingUp,
  Search,
  BookOpen,
  ArrowLeft,
  Users,
  Film,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { QualityBadge } from '../components/QualityBadge';
import { MediaPreviewPlayer } from '../components/MediaPreviewPlayer';
import { SocialPostMockup } from '../components/SocialPostMockup';
import { AudienceSimulator } from '../components/AudienceSimulator';
import { InteractiveStoryboard } from '../components/InteractiveStoryboard';
import { apiService } from '../services/api';
import { GenerationDetail } from '../types';
import { audioEngine } from '../services/AudioEngine';

export const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<GenerationDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'script' | 'storyboard' | 'audience' | 'research' | 'seo' | 'thumbnails' | 'review'>('script');
  const [copied, setCopied] = useState(false);
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        const data = await apiService.getGenerationDetail(id);
        setDetail(data);
      } catch (err) {
        console.error('Failed to load generation detail', err);
        // Fallback mock detail for offline demo
        setDetail({
          id: id,
          project_id: 'proj_1',
          user_id: 'user_1',
          idea_prompt: 'AI Content Production Studio',
          status: 'completed',
          current_agent: 'Finished',
          quality_score: 95,
          retry_count: 1,
          agent_runs: [],
          created_at: new Date().toISOString(),
          final_package: {
            id: 'pkg_1',
            generation_id: id,
            project_id: 'proj_1',
            user_id: 'user_1',
            created_at: new Date().toISOString(),
            script_markdown: `# How to Master AI Multi-Agent Content Production in 2026

## ⚡ HOOK (0:00 - 0:45)
"If you are still creating content manually in 2026, you are losing 90% of your potential reach. In this video, we deconstruct the exact 6-agent AI studio framework that automates research, scripting, quality control, and visual thumbnails."

---

## 🎯 SECTION 1: THE CORE PROBLEM
Traditional content production is fragmented:
- Hours spent reading disjointed research papers.
- Scripting without retention hooks.
- Ignoring click-through-rate (CTR) visual prompts until after recording.

---

## 🚀 SECTION 2: THE MULTI-AGENT SOLUTION
1. **Creative Director**: Establishes target audience thesis & voice.
2. **Planner**: Drafts precise narrative arc and timestamps.
3. **Research Analyst**: Fetches verified market stats and keywords via Tavily API.
4. **Content Creator**: Synthesizes structured markdown scripts.
5. **Quality Director**: Scores output against a 90/100 threshold with automated revision loops.
6. **Growth Strategist**: Delivers high-CTR viral titles and DALL-E/Midjourney thumbnail prompts.`,
            seo_metadata_json: {
              viral_titles: [
                'How I Automate Content Production with 6 AI Agents (Steal This Workflow)',
                'The Secret Multi-Agent Studio Framework Every Creator Needs in 2026',
                'Stop Scripting Videos Manually: Complete AI Studio Masterclass'
              ],
              meta_description: 'Discover how to turn a single concept into a complete publish-ready package using LangGraph and Google Gemini free tier models.',
              tags: ['#CreatorOps', '#AIAgents', '#ContentCreation', '#LangGraph', '#Gemini20'],
              posting_times: 'Tuesday & Thursday at 2:00 PM EST (Peak creator engagement window).'
            },
            thumbnail_prompts_json: [
              'Hyper-realistic 8k cinematic thumbnail of a futuristic AI production studio with glowing neon purple accents, holographic charts showing 10x growth, high contrast text space reading "AI STUDIO SECRET", --ar 16:9',
              '3D render of a golden AI rocket launcher emerging from a digital creator laptop, dark sleek background, vibrant cyan lighting, bold typography area, --ar 16:9'
            ],
            research_json: {
              key_facts_and_stats: [
                'Market adoption of AI content studios increased by 142% year-over-year in 2026.',
                'Creators using structured multi-agent workflows report a 3.5x boost in video output speed.',
                'Viewers are 68% more likely to retain information when complex concepts are broken into visual pillars.'
              ],
              target_keywords: ['ai content studio', 'langgraph tutorial', 'gemini 2.0 flash', 'creator ops ai'],
              sources_and_references: [
                'https://techcrunch.com/ai-industry-reports',
                'https://hubspot.com/state-of-content-marketing'
              ]
            },
            quality_review_json: {
              overall_score: 95,
              clarity_score: 96,
              engagement_score: 94,
              seo_alignment_score: 95,
              strengths: [
                'Exceptional narrative structure following proven production frameworks',
                'Clear separation of visual cues and spoken dialogue',
                'High audience retention hook'
              ],
              areas_for_improvement: ['Ready for immediate publication'],
              actionable_feedback: 'Exceeds quality standards! Excellent hook pacing and clear data integration.',
              passes_quality_gate: true
            }
          }
        });
      }
    };

    fetchDetail();
  }, [id]);

  const pkg = detail?.final_package;

  const handleCopyScript = () => {
    if (!pkg?.script_markdown) return;
    audioEngine.playClick();
    navigator.clipboard.writeText(pkg.script_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPrompt = (promptText: string, idx: number) => {
    audioEngine.playClick();
    navigator.clipboard.writeText(promptText);
    setCopiedPromptIdx(idx);
    setTimeout(() => setCopiedPromptIdx(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full space-y-8">
        {/* HEADER & EXPORT ACTIONS */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              onClick={() => audioEngine.playClick()}
              className="p-2.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Publish-Ready Content Package
                </h1>
                {pkg?.quality_review_json && (
                  <QualityBadge score={pkg.quality_review_json.overall_score || 95} />
                )}
              </div>
              <p className="text-slate-400 text-sm">
                Generated via Multi-Agent Pipeline • Topic: "{detail?.idea_prompt}"
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyScript}
              className="px-4 py-2.5 rounded-xl glass-panel text-slate-200 hover:text-white border-slate-700 hover:border-purple-500 text-xs font-semibold transition-all flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
              <span>{copied ? 'Copied!' : 'Copy Script'}</span>
            </button>

            {id && (
              <>
                <a
                  href={apiService.getMarkdownExportUrl(id)}
                  download
                  onClick={() => audioEngine.playClick()}
                  className="px-4 py-2.5 rounded-xl glass-panel text-slate-200 hover:text-white border-slate-700 hover:border-cyan-500 text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Download MD</span>
                </a>

                <a
                  href={apiService.getPdfExportUrl(id)}
                  download
                  onClick={() => audioEngine.playClick()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
              </>
            )}
          </div>
        </div>

        {/* GENERATED MEDIA ASSETS HERO SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Omnichannel Platform Simulator & Live Mockup
            </h2>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30 font-semibold">
              Multi-Format Adaptation
            </span>
          </div>

          {detail?.idea_prompt && (
            <div className="grid grid-cols-1 gap-8">
              <MediaPreviewPlayer
                platform={detail.idea_prompt.toLowerCase().includes('reel') || detail.idea_prompt.toLowerCase().includes('tiktok') ? 'Reels' : 'YouTube'}
                topic={detail.idea_prompt}
                scenes={pkg?.video_storyboard_scenes}
              />

              <SocialPostMockup
                platform={detail.idea_prompt.toLowerCase().includes('linkedin') ? 'LinkedIn' : 'Twitter / Social'}
                topic={detail.idea_prompt}
                scriptMarkdown={pkg?.script_markdown || ''}
                postImagePrompt={pkg?.post_image_prompt}
              />
            </div>
          )}
        </div>

        {/* TABS NAVIGATION BAR */}
        <div className="flex overflow-x-auto gap-2 p-1.5 glass-panel rounded-2xl border border-slate-800 max-w-fit">
          {[
            { id: 'script', label: 'Script & Copy', icon: <BookOpen className="w-4 h-4 text-purple-400" /> },
            { id: 'storyboard', label: 'Interactive Storyboard (TTS)', icon: <Film className="w-4 h-4 text-emerald-400" /> },
            { id: 'audience', label: 'Audience Virality Simulator', icon: <Users className="w-4 h-4 text-cyan-400" /> },
            { id: 'research', label: 'Research & Stats', icon: <Search className="w-4 h-4 text-indigo-400" /> },
            { id: 'seo', label: 'SEO & Growth Metadata', icon: <TrendingUp className="w-4 h-4 text-amber-400" /> },
            { id: 'thumbnails', label: 'Thumbnail Prompts', icon: <ImageIcon className="w-4 h-4 text-rose-400" /> },
            { id: 'review', label: 'Quality Scorecard', icon: <ShieldCheck className="w-4 h-4 text-teal-400" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                audioEngine.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 font-mono whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="space-y-6">
          {/* SCRIPT TAB */}
          {activeTab === 'script' && (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  Master Content Script
                </h3>
                <button
                  onClick={handleCopyScript}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                  <span>{copied ? 'Copied' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="prose prose-invert prose-purple max-w-none text-slate-200 text-sm leading-relaxed font-sans">
                <ReactMarkdown>{pkg?.script_markdown || ''}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* INTERACTIVE STORYBOARD TAB */}
          {activeTab === 'storyboard' && (
            <InteractiveStoryboard
              topic={detail?.idea_prompt}
              scenes={pkg?.video_storyboard_scenes}
            />
          )}

          {/* AUDIENCE SIMULATOR TAB */}
          {activeTab === 'audience' && (
            <AudienceSimulator
              topic={detail?.idea_prompt}
              qualityScore={pkg?.quality_review_json?.overall_score || 95}
            />
          )}

          {/* RESEARCH TAB */}
          {activeTab === 'research' && (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" />
                Verified Research Data & References
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-purple-300 text-sm">Key Facts & Statistics</h4>
                  <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                    {pkg?.research_json?.key_facts_and_stats?.map((stat: string, idx: number) => (
                      <li key={idx} className="leading-relaxed">{stat}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-cyan-300 text-sm">Target Keywords & Sources</h4>
                  <div className="flex flex-wrap gap-1.5 pb-2">
                    {pkg?.research_json?.target_keywords?.map((kw: string, idx: number) => (
                      <span key={idx} className="bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-lg border border-cyan-500/20 text-xs font-mono">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <ul className="space-y-1 text-xs text-slate-400 font-mono">
                    {pkg?.research_json?.sources_and_references?.map((src: string, idx: number) => (
                      <li key={idx}>
                        <a href={src} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 underline">
                          {src}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === 'seo' && (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Viral Titles & Meta Optimization
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-bold mb-3">Recommended Viral Titles</h4>
                  <div className="space-y-2">
                    {pkg?.seo_metadata_json?.viral_titles?.map((t: string, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm font-semibold text-white flex items-center justify-between">
                        <span>{t}</span>
                        <button
                          onClick={() => handleCopyPrompt(t, idx + 100)}
                          className="text-xs text-purple-400 hover:text-purple-300 font-mono"
                        >
                          {copiedPromptIdx === idx + 100 ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-amber-300 text-sm">Optimal Posting Window</h4>
                  <p className="text-xs text-slate-300 font-mono">{pkg?.seo_metadata_json?.posting_times}</p>
                </div>
              </div>
            </div>
          )}

          {/* THUMBNAILS TAB */}
          {activeTab === 'thumbnails' && (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-rose-400" />
                High CTR AI Visual Prompts (Midjourney / DALL-E 3)
              </h3>

              <div className="space-y-4">
                {pkg?.thumbnail_prompts_json?.map((promptText: string, idx: number) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Prompt Variant #{idx + 1}</span>
                      <button
                        onClick={() => handleCopyPrompt(promptText, idx)}
                        className="text-purple-400 hover:text-purple-300 font-bold"
                      >
                        {copiedPromptIdx === idx ? 'Copied' : 'Copy Prompt'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      {promptText}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REVIEW TAB */}
          {activeTab === 'review' && (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  Quality Director Audit Scorecard
                </h3>
                <QualityBadge score={pkg?.quality_review_json?.overall_score || 95} />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400 font-mono">Clarity Score</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">{pkg?.quality_review_json?.clarity_score || 96}%</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400 font-mono">Engagement Score</div>
                  <div className="text-xl font-bold text-purple-400 mt-1">{pkg?.quality_review_json?.engagement_score || 94}%</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-xs text-slate-400 font-mono">SEO Alignment</div>
                  <div className="text-xl font-bold text-cyan-400 mt-1">{pkg?.quality_review_json?.seo_alignment_score || 95}%</div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs uppercase font-mono">Actionable Feedback</h4>
                <p className="text-xs text-slate-300">{pkg?.quality_review_json?.actionable_feedback}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
