import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Pause, Film, Video, Camera, Sparkles, Copy, Check } from 'lucide-react';
import { audioEngine } from '../services/AudioEngine';
import { StoryboardScene } from '../types';

interface InteractiveStoryboardProps {
  topic?: string;
  scenes?: StoryboardScene[];
}

export const InteractiveStoryboard: React.FC<InteractiveStoryboardProps> = ({ topic = 'AI Content Studio', scenes }) => {
  const defaultScenes: StoryboardScene[] = [
    {
      scene_number: 1,
      timeframe: '0:00 - 0:05',
      visual_cue: 'Fast zoom-in on neon holographic dashboard showing multi-agent AI nodes lighting up.',
      voiceover_script: 'If you are still scripting and editing videos manually in 2026, you are losing 90% of your potential reach.',
      camera_angle: 'Macro dynamic push-in',
      b_roll_suggestion: 'Cinematic glowing cyber grid with code lines matrix',
    },
    {
      scene_number: 2,
      timeframe: '0:05 - 0:18',
      visual_cue: 'Split screen comparing traditional solo content writer vs 6 automated AI specialist agents working in parallel.',
      voiceover_script: 'Traditional content takes days. But with CreatorOps AI, 6 specialized agents plan, research, write, and quality-audit your content in seconds.',
      camera_angle: 'Medium tracking shot',
      b_roll_suggestion: 'Dark aesthetic laptop with glowing purple ambient background',
    },
    {
      scene_number: 3,
      timeframe: '0:18 - 0:35',
      visual_cue: 'Live screen recording showing LangGraph quality loop automatically refining scripts above 90/100 threshold.',
      voiceover_script: 'Our Quality Director agent automatically scores narrative retention and SEO before anything goes live.',
      camera_angle: 'Screen capture overlay with cursor highlight',
      b_roll_suggestion: 'High-contrast typography HUD overlay displaying 95% quality score',
    },
    {
      scene_number: 4,
      timeframe: '0:35 - 0:45',
      visual_cue: 'Close-up of creator clicking 1-Click Export, downloading multi-platform package for YouTube, LinkedIn, and X.',
      voiceover_script: 'Turn one single concept into an omnichannel publishing machine today.',
      camera_angle: 'Low angle hero shot',
      b_roll_suggestion: 'Particle explosion effect with vibrant purple and cyan glows',
    },
  ];

  const activeScenes = scenes && scenes.length > 0 ? scenes : defaultScenes;

  const [activeSceneIdx, setActiveSceneIdx] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const currentScene = activeScenes[activeSceneIdx] || defaultScenes[0];
  const scriptText = currentScene.voiceover_script || currentScene.audio_script || currentScene.caption || '';
  const timingText = currentScene.timeframe || currentScene.timestamp || `Scene ${activeSceneIdx + 1}`;
  const cameraText = currentScene.camera_angle || 'Wide master shot';
  const bRollText = currentScene.b_roll_suggestion || 'Dynamic visual overlay';

  const handleSpeakScene = (text: string) => {
    if (isPlayingAudio) {
      audioEngine.stopSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      audioEngine.speakText(text, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleCopyScript = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 purple-glow space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
              Interactive Storyboard Studio
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">Web Speech Voiceover Ready</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Film className="w-7 h-7 text-purple-400" />
            Reel & Video Storyboard Animator
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSpeakScene(scriptText)}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 ${
              isPlayingAudio
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30'
            }`}
          >
            {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? 'Pause Voiceover Preview' : 'Listen Live TTS Voiceover'}</span>
          </button>
        </div>
      </div>

      {/* MAIN STORYBOARD CANVAS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: SCENE SELECTOR LIST (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
            Production Scene Breakdown ({activeScenes.length} Frames)
          </h4>
          {activeScenes.map((scene, idx) => (
            <div
              key={idx}
              onClick={() => {
                audioEngine.playClick();
                if (isPlayingAudio) audioEngine.stopSpeech();
                setIsPlayingAudio(false);
                setActiveSceneIdx(idx);
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                activeSceneIdx === idx
                  ? 'bg-purple-900/30 border-purple-500/60 shadow-lg shadow-purple-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-purple-400">
                  Scene {scene.scene_number || idx + 1}
                </span>
                <span className="text-xs font-mono text-slate-500">{scene.timeframe || scene.timestamp || ''}</span>
              </div>
              <p className="text-xs text-slate-300 font-medium line-clamp-2">
                {scene.voiceover_script || scene.audio_script || scene.caption}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT: SCENE DETAIL PLAYGROUND (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-mono font-bold">
                Frame #{currentScene.scene_number || activeSceneIdx + 1}
              </span>
              <span className="text-xs font-mono text-slate-400">{timingText}</span>
            </div>

            <button
              onClick={() => handleCopyScript(scriptText, activeSceneIdx)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500 text-xs font-semibold text-slate-300 flex items-center gap-1.5"
            >
              {copiedIdx === activeSceneIdx ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-purple-400" />
              )}
              <span>{copiedIdx === activeSceneIdx ? 'Copied' : 'Copy Script'}</span>
            </button>
          </div>

          {/* VISUAL & AUDIO CUES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
                <Camera className="w-4 h-4" />
                <span>Visual Camera Direction</span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {currentScene.visual_cue}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-semibold">
                <Video className="w-4 h-4" />
                <span>Camera Angle & B-Roll</span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                <strong className="text-slate-200">Angle:</strong> {cameraText}
                <br />
                <strong className="text-slate-200">B-Roll:</strong> {bRollText}
              </p>
            </div>
          </div>

          {/* VOICE OVER SCRIPT READOUT */}
          <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-purple-300 font-bold">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Spoken Voiceover Script
              </span>
              <span className="text-[10px] text-purple-400 font-normal">Synthesized TTS Enabled</span>
            </div>
            <p className="text-base text-white font-serif leading-relaxed italic">
              "{scriptText}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
