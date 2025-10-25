import React, { useRef, useEffect } from 'react';

interface BubbleBackgroundProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

const BUBBLE_COUNT = 15;

const BubbleBackground: React.FC<BubbleBackgroundProps> = ({ analyser, isPlaying }) => {
  const bubblesRef = useRef<(HTMLDivElement | null)[]>([]);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    bubblesRef.current = bubblesRef.current.slice(0, BUBBLE_COUNT);
  }, []);

  useEffect(() => {
    const analyseAudio = () => {
      if (!analyser || !isPlaying) {
        if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        // Reset scale when not playing
        bubblesRef.current.forEach(bubble => {
            if (bubble) bubble.style.scale = '1';
        });
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      
      // Calculate scale factor, ensuring it's at least 1
      const scale = 1 + (average / 128) * 0.5;

      bubblesRef.current.forEach(bubble => {
        if (bubble) {
            // Use the independent 'scale' property to avoid overriding the 'transform' from the animation
            bubble.style.scale = `${scale}`;
        }
      });

      animationFrameId.current = requestAnimationFrame(analyseAudio);
    };

    analyseAudio();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [analyser, isPlaying]);

  return (
    <div className="bubbles">
      {Array.from({ length: BUBBLE_COUNT }).map((_, i) => {
        const size = Math.random() * 80 + 20; // 20px to 100px
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 15 + 20; // 20s to 35s
        const animationDelay = Math.random() * 20; // 0s to 20s
        
        return (
          <div
            key={i}
            ref={el => { if (el) bubblesRef.current[i] = el; }}
            className="bubble"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}vw`,
              animationDuration: `${animationDuration}s`,
              animationDelay: `${animationDelay}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default BubbleBackground;