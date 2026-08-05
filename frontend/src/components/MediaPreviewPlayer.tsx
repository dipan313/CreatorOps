import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Maximize2, Sparkles, Video, Film } from 'lucide-react';
import { StoryboardScene } from '../types';

interface MediaPreviewPlayerProps {
  platform: string;
  topic: string;
  scenes?: StoryboardScene[];
}

export const MediaPreviewPlayer: React.FC<MediaPreviewPlayerProps> = ({ platform, topic, scenes = [] }) => {
  const isVertical = platform.toLowerCase().includes('reel') || platform.toLowerCase().includes('tiktok') || platform.toLowerCase().includes('short');
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [aspectVertical, setAspectVertical] = useState(isVertical);

  const rawScene = scenes[currentSceneIdx];
  const activeScene = {
    scene_number: rawScene ? String(rawScene.scene_number) : '1',
    timestamp: rawScene ? (rawScene.timeframe || rawScene.timestamp || '0:00 - 0:10') : '0:00 - 0:10',
    caption: rawScene ? (rawScene.caption || rawScene.visual_cue) : `Hook: Master ${topic} in 60 seconds!`,
    visual_cue: rawScene ? rawScene.visual_cue : 'Futuristic digital neon studio with high-tech HUD metrics',
    audio_script: rawScene ? (rawScene.audio_script || rawScene.voiceover_script || '') : `Welcome to the ultimate guide on ${topic}. Here is everything you need to know!`
  };

  // Web Speech API Voiceover Synthesizer
  useEffect(() => {
    if (!isPlaying) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      if (!isMuted && activeScene.audio_script) {
        const utterance = new SpeechSynthesisUtterance(activeScene.audio_script);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.onend = () => {
          if (currentSceneIdx < scenes.length - 1) {
            setCurrentSceneIdx((prev) => prev + 1);
          } else {
            setIsPlaying(false);
          }
        };
        window.speechSynthesis.speak(utterance);
      } else {
        const timer = setTimeout(() => {
          if (currentSceneIdx < scenes.length - 1) {
            setCurrentSceneIdx((prev) => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }, 5000);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, currentSceneIdx, isMuted, scenes, activeScene.audio_script]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (scenes.length > 0) {
      setCurrentSceneIdx((prev) => (prev + 1) % scenes.length);
    }
  };

  const handlePrev = () => {
    if (scenes.length > 0) {
      setCurrentSceneIdx((prev) => (prev - 1 + scenes.length) % scenes.length);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 purple-glow space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
              <span>{platform} Live Reel & Storyboard Player</span>
              <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                Interactive Preview
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Simulating scene transitions, visual hooks & voiceover cadence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAspectVertical(!aspectVertical)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white hover:border-purple-500 transition-all flex items-center gap-1.5"
          >
            <Film className="w-3.5 h-3.5 text-purple-400" />
            <span>{aspectVertical ? '9:16 Reel' : '16:9 Landscape'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* PLAYER FRAME */}
        <div className={`lg:col-span-7 flex justify-center`}>
          <div
            className={`relative rounded-3xl overflow-hidden border-2 border-purple-500/40 bg-slate-950 shadow-2xl flex flex-col justify-between transition-all duration-300 ${
              aspectVertical ? 'w-[280px] h-[500px]' : 'w-full max-w-xl h-[320px]'
            }`}
          >
            {/* AMBIENT GLOW BACKDROP */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-purple-950/20 to-indigo-950/30 pointer-events-none" />

            {/* TOP OVERLAY HUD */}
            <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-slate-950/90 to-transparent">
              <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-full border border-purple-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Scene #{activeScene.scene_number}
              </span>
              <span className="text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
                {activeScene.timestamp}
              </span>
            </div>

            {/* MAIN SCENE CONTENT SIMULATION */}
            <div className="relative z-10 px-6 text-center space-y-3">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md shadow-xl">
                <p className="text-xs font-mono text-cyan-300 font-semibold mb-1">
                  🎬 Visual Cue:
                </p>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{activeScene.visual_cue}"
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-950/80 border border-purple-500/30 backdrop-blur-md shadow-xl">
                <p className="text-xs font-mono text-purple-300 font-bold mb-1">
                  🗣️ Spoken Caption / Voiceover:
                </p>
                <p className="text-xs text-white font-medium leading-relaxed">
                  "{activeScene.caption}"
                </p>
              </div>
            </div>

            {/* BOTTOM CONTROLS OVERLAY */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-slate-950 to-transparent space-y-2">
              <div className="flex items-center justify-between px-2">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/40 hover:scale-105 transition-all"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SCENE TIMELINE SIDEBAR */}
        <div className="lg:col-span-5 space-y-3">
          <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
            Storyboard Scene Queue ({scenes.length || 1} Frames)
          </h4>
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {(scenes.length > 0 ? scenes : [activeScene]).map((sc: any, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentSceneIdx(idx);
                  setIsPlaying(false);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  currentSceneIdx === idx
                    ? 'bg-purple-900/30 border-purple-500 text-white shadow-md'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1 font-bold">
                  <span className="text-purple-400">Scene #{sc.scene_number || idx + 1}</span>
                  <span className="text-slate-500">{sc.timeframe || sc.timestamp}</span>
                </div>
                <p className="text-xs line-clamp-1 text-slate-300">
                  {sc.audio_script || sc.voiceover_script || sc.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
