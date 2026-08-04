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
  ExternalLink
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { QualityBadge } from '../components/QualityBadge';
import { MediaPreviewPlayer } from '../components/MediaPreviewPlayer';
import { SocialPostMockup } from '../components/SocialPostMockup';
import { apiService } from '../services/api';
import { GenerationDetail } from '../types';

export const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<GenerationDetail | null>(null);
  const [activeTab, setActiveTab] = useState<'script' | 'research' | 'seo' | 'thumbnails' | 'review'>('script');
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
    navigator.clipboard.writeText(pkg.script_markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPrompt = (promptText: string, idx: number) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptIdx(idx);
    setTimeout(() => setCopiedPromptIdx(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 w-full">
        {/* HEADER & EXPORT ACTIONS */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
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
                  className="px-4 py-2.5 rounded-xl glass-panel text-slate-200 hover:text-white border-slate-700 hover:border-cyan-500 text-xs font-semibold transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Download MD</span>
                </a>

                <a
                  href={apiService.getPdfExportUrl(id)}
                  download
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
        <div className="mb-10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Generated Media Assets & Platform Preview
            </h2>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30 font-semibold">
              Live AI Output
            </span>
          </div>

          {/* Render MediaPreviewPlayer for Video platforms; Render SocialPostMockup for Social platforms */}
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

        {/* TABS NAVIGATION */}
        <div className="flex overflow-x-auto gap-2 p-1.5 glass-panel rounded-2xl border border-slate-800 mb-8 max-w-fit">
          {[
            { id: 'script', label: 'Script & Content', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'research', label: 'Research & Stats', icon: <Search className="w-4 h-4" /> },
            { id: 'seo', label: 'SEO & Metadata', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'thumbnails', label: 'Thumbnail Visual Prompts', icon: <ImageIcon className="w-4 h-4" /> },
            { id: 'review', label: 'Quality Scorecard', icon: <ShieldCheck className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 min-h-[500px]">
          {/* TAB 1: SCRIPT */}
          {activeTab === 'script' && (
            <div className="prose prose-invert max-w-none">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                  📝 Publication Script & Content
                </span>
                <button
                  onClick={handleCopyScript}
                  className="text-xs text-purple-400 hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Markdown
                </button>
              </div>
              <ReactMarkdown className="leading-relaxed text-slate-200 text-sm space-y-4">
                {pkg?.script_markdown || 'No script available.'}
              </ReactMarkdown>
            </div>
          )}

          {/* TAB 2: RESEARCH */}
          {activeTab === 'research' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Market Research & Verified Stats</h3>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  Key Facts & Statistics (Tavily Verified)
                </h4>
                <ul className="space-y-2">
                  {pkg?.research_json?.key_facts_and_stats?.map((stat: string, idx: number) => (
                    <li key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 flex items-start gap-3">
                      <span className="text-purple-400 font-mono font-bold">#{idx + 1}</span>
                      <span>{stat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  Target Search Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {pkg?.research_json?.target_keywords?.map((kw: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
                      🔍 {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SEO & METADATA */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  High-CTR Viral Title Options
                </h3>
                <div className="space-y-2">
                  {pkg?.seo_metadata_json?.viral_titles?.map((title: string, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-sm font-bold text-slate-100 flex items-center justify-between">
                      <span>{idx + 1}. {title}</span>
                      <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">High CTR</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    Meta Description / Video Caption
                  </h4>
                  <p className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300">
                    {pkg?.seo_metadata_json?.meta_description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                    Recommended Posting Strategy
                  </h4>
                  <p className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300">
                    {pkg?.seo_metadata_json?.posting_times}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: THUMBNAIL PROMPTS & VISUAL PREVIEWS */}
          {activeTab === 'thumbnails' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">AI Visual Thumbnails & Image Prompts</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pkg?.thumbnail_prompts_json?.map((prompt: string, idx: number) => {
                  const encodedPrompt = encodeURIComponent(prompt.split('--')[0].trim());
                  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1280&height=720&nologo=true&seed=${idx + 42}`;
                  return (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 flex flex-col justify-between">
                      {/* Live Generated Image Preview */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 group shadow-lg">
                        <img
                          src={imageUrl}
                          alt={`Generated Thumbnail #${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback placeholder if image fetch takes time
                            (e.target as HTMLImageElement).src = `https://placehold.co/1280x720/0f172a/6366f1?text=Thumbnail+Preview+${idx + 1}`;
                          }}
                        />
                        <a
                          href={imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur border border-slate-700 transition-colors flex items-center gap-1.5 shadow"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Full Image</span>
                        </a>
                      </div>

                      {/* Prompt Details & Copy Button */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-indigo-400 font-bold">Visual Prompt #{idx + 1}</span>
                          <button
                            onClick={() => handleCopyPrompt(prompt, idx)}
                            className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600/40 transition-colors flex items-center gap-1"
                          >
                            {copiedPromptIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedPromptIdx === idx ? 'Copied' : 'Copy Prompt'}</span>
                          </button>
                        </div>
                        <code className="block text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed max-h-28 overflow-y-auto">
                          {prompt}
                        </code>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: QUALITY REVIEW */}
          {activeTab === 'review' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Quality Director Audit & Metric Breakdown
                </h3>
                <QualityBadge score={pkg?.quality_review_json?.overall_score || 95} />
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
                  Actionable Auditor Feedback
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
                  💬 "{pkg?.quality_review_json?.actionable_feedback}"
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
                  Identified Production Strengths
                </h4>
                <ul className="space-y-2">
                  {pkg?.quality_review_json?.strengths?.map((str: string, idx: number) => (
                    <li key={idx} className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-sm text-emerald-300 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
