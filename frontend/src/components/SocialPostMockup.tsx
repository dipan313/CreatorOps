import React, { useState } from 'react';
import { Download, ExternalLink, Share2, ThumbsUp, MessageSquare, Repeat, Sparkles, Copy, Check } from 'lucide-react';

interface SocialPostMockupProps {
  platform: string;
  topic: string;
  scriptMarkdown: string;
  postImagePrompt?: string;
}

export const SocialPostMockup: React.FC<SocialPostMockupProps> = ({
  platform,
  topic,
  scriptMarkdown,
  postImagePrompt
}) => {
  const [copied, setCopied] = useState(false);

  const promptString = postImagePrompt || `Professional minimalist 3D graphic banner for ${platform} post on '${topic}', featuring futuristic neon typography, sleek corporate aesthetic, high contrast dark theme, vibrant indigo and violet lighting, photorealistic 8k`;
  
  const encodedPrompt = encodeURIComponent(promptString);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&seed=88`;

  // Clean script text for social post summary preview
  const postPreviewText = scriptMarkdown
    .replace(/^#+\s+/gm, '')
    .replace(/[*_`]/g, '')
    .slice(0, 280) + '...';

  const handleCopyText = () => {
    navigator.clipboard.writeText(scriptMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Generated {platform} Post Graphic & Feed Preview
              <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-md font-bold">
                {platform} Graphic
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Custom AI image generated according to your post topic & brand tone
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyText}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white transition-colors flex items-center gap-2"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{copied ? 'Copied Post' : 'Copy Post Text'}</span>
        </button>
      </div>

      {/* MOCKUP FEED CARD (LINKEDIN / TWITTER STYLE) */}
      <div className="max-w-2xl mx-auto rounded-2xl bg-slate-950 border border-slate-800/90 shadow-2xl p-5 space-y-4">
        {/* User Author Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center gap-1 justify-center font-bold text-white text-sm shadow">
              CO
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white">Creator Studio</h4>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/30">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400">AI Production Specialist • Just now</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500">🌐 Public</span>
        </div>

        {/* Post Text snippet */}
        <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
          {postPreviewText}
        </p>

        {/* Tailored Post Graphic Banner */}
        <div className="relative aspect-[1.91/1] rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 group">
          <img
            src={imageUrl}
            alt="LinkedIn / Social Post Graphic"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/1200x630/0f172a/38bdf8?text=${encodeURIComponent(topic)}`;
            }}
          />
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur border border-slate-700 transition-colors flex items-center gap-1.5 shadow"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Download High-Res Graphic</span>
          </a>
        </div>

        {/* Mock Social Interactions */}
        <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-slate-400 text-xs font-semibold px-2">
          <div className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer">
            <ThumbsUp className="w-4 h-4 text-cyan-400" />
            <span>Like (142)</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-purple-400 transition-colors cursor-pointer">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>Comment (28)</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer">
            <Repeat className="w-4 h-4 text-emerald-400" />
            <span>Repost (19)</span>
          </div>
        </div>
      </div>

      {/* PROMPT DETAILS */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
        <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Image Generation Prompt Used
        </span>
        <code className="block text-xs font-mono text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          {promptString}
        </code>
      </div>
    </div>
  );
};
