import React, { useEffect, useRef } from 'react';
import { LyricLine } from '../types';

interface LyricsDisplayProps {
  lyrics: LyricLine[];
  currentTime: number;
  activeColor: string;
}

const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ lyrics, currentTime, activeColor }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLParagraphElement>(null);
  const lastActiveIndex = useRef<number | null>(null);

  const activeLyricIndex = lyrics.findIndex((line, index) => {
    const nextLine = lyrics[index + 1];
    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
  });
  
  useEffect(() => {
    if (activeLyricIndex !== -1 && activeLyricIndex !== lastActiveIndex.current) {
      if (activeLineRef.current) {
        activeLineRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      lastActiveIndex.current = activeLyricIndex;
    }
  }, [activeLyricIndex]);

  return (
    <div 
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto text-center lyrics-container"
    >
        <style>{`
            .lyrics-container::-webkit-scrollbar { width: 4px; }
            .lyrics-container::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 2px; }
            .lyrics-container::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.3); border-radius: 2px; }
        `}</style>
        <div className="py-2">
            {lyrics.map((line, index) => {
                const isActive = index === activeLyricIndex;
                const isPast = index < activeLyricIndex;

                return (
                <p
                    key={`${line.time}-${index}`}
                    ref={isActive ? activeLineRef : null}
                    className={`transition-all duration-300 ease-in-out font-semibold p-1 rounded-md ${
                        isActive 
                            ? 'scale-105' 
                            : isPast 
                            ? 'text-gray-500 opacity-80' 
                            : 'text-gray-300 opacity-90'
                    }`}
                    style={{
                        color: isActive ? activeColor : undefined,
                        textShadow: isActive ? `0 0 10px ${activeColor}60` : 'none'
                    }}
                >
                    {line.text}
                </p>
                );
            })}
        </div>
    </div>
  );
};

export default LyricsDisplay;