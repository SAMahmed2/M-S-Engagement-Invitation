'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  triggerPlay: boolean;
}

export default function AudioPlayer({ audioUrl, triggerPlay }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current && triggerPlay) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio autoplay blocked or failed:", err));
    }
  }, [triggerPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#556B2F]/90 backdrop-blur-sm px-4 py-2 rounded-full border border-[#D4AF37]/30 shadow-xl">
      <audio ref={audioRef} src={audioUrl} loop />
      
      {/* مشغل الإيكولايزر البصري المتحرك عند تشغيل الأغنية */}
      <div className="flex items-end gap-0.5 h-4 w-6">
        {[1, 2, 3, 4, 5].map((bar) => (
          <span
            key={bar}
            className={`w-1 bg-[#FDFBF7] rounded-full transition-all duration-300 ${
              isPlaying ? 'animate-pulse h-full' : 'h-1'
            }`}
            style={{
              animationDelay: isPlaying ? `${bar * 0.15}s` : '0s',
              animationDuration: isPlaying ? '0.6s' : '0s'
            }}
          />
        ))}
      </div>

      <button
        onClick={togglePlay}
        className="text-[#FDFBF7] text-xs font-serif tracking-widest uppercase hover:text-[#D4AF37] transition-colors"
      >
        {isPlaying ? 'PAUSE' : 'PLAY'}
      </button>
    </div>
  );
}