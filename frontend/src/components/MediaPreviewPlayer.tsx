import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Maximize2, Sparkles, Video, Film } from 'lucide-react';

interface Scene {
  scene_number: string;
  timestamp: string;
  caption: string;
  visual_cue: string;
  audio_script: string;
}

interface MediaPreviewPlayerProps {
  platform: string;
  topic: string;
  scenes?: Scene[];
}

export const MediaPreviewPlayer: React.FC<MediaPreviewPlayerProps> = ({ platform, topic, scenes = [] }) => {
  const isVertical = platform.toLowerCase().includes('reel') || platform.toLowerCase().includes('tiktok') || platform.toLowerCase().includes('short');
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [aspectVertical, setAspectVertical] = useState(isVertical);

  const activeScene = scenes[currentSceneIdx] || {
    scene_number: '1',
    timestamp: '0:00 - 0:10',
    caption: `Hook: Master ${topic} in 60 seconds!`,
    visual_cue: 'Futuristic digital neon studio with high-tech HUD metrics',
    audio_script: `Welcome to the ultimate guide on ${topic}. Here is everything you need to know!`
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
  }, [currentSceneIdx, isPlaying, isMuted, scenes]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCurrentSceneIdx((prev) => (prev + 1) % scenes.length);
  };

  const handlePrev = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCurrentSceneIdx((prev) => (prev - 1 + scenes.length) % scenes.length);
  };

  const bgImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(`cinematic scene for video on ${topic}, ${activeScene.visual_cue}`)}?width=1280&height=720&nologo=true&seed=${currentSceneIdx + 99}`;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Generated Video Reel & Storyboard Preview
              <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-md font-bold">
                {platform} Format
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive scene playback with live AI voiceover speech synthesis
            </p>
          </div>
        </div>

        <button
          onClick={() => setAspectVertical(!aspectVertical)}
          className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <Film className="w-3.5 h-3.5 text-cyan-400" />
          <span>{aspectVertical ? 'Switch to 16:9' : 'Switch to 9:16'}</span>
        </button>
      </div>

      {/* VIDEO PLAYER SCREEN */}
      <div className="flex justify-center">
        <div
          className={`relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl transition-all duration-300 ${
            aspectVertical ? 'w-full max-w-[340px] aspect-[9/16]' : 'w-full aspect-video'
          }`}
        >
          {/* Background Visual Scene */}
          <img
            src={bgImageUrl}
            alt={activeScene.caption}
            className="w-full h-full object-cover transition-all duration-700 brightness-[0.65]"
          />

          {/* Top Overlay Badge */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <span className="text-[11px] font-mono font-bold bg-slate-950/80 backdrop-blur text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
              Scene {activeScene.scene_number} / {scenes.length || 4} ({activeScene.timestamp})
            </span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-slate-950/80 backdrop-blur text-slate-300 hover:text-white border border-slate-800 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Center Visual Cue Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 space-y-3">
            <div className="bg-slate-950/70 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 max-w-md shadow-xl">
              <p className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
                🎥 Visual Cue
              </p>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                {activeScene.visual_cue}
              </p>
            </div>
          </div>

          {/* Bottom Subtitle / Speech Caption */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent p-4 rounded-xl backdrop-blur-sm border border-slate-800/60 text-center">
              <p className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider mb-1">
                🗣️ Voiceover Speech
              </p>
              <p className="text-xs md:text-sm font-semibold text-white leading-relaxed">
                "{activeScene.audio_script}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PLAYER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={handleTogglePlay}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'Pause Reel' : 'Play Voiceover Reel'}</span>
          </button>
          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* SCENE INDICATOR TIMELINE */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {scenes.map((scene, idx) => (
            <button
              key={idx}
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setCurrentSceneIdx(idx);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                currentSceneIdx === idx
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Scene {scene.scene_number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
