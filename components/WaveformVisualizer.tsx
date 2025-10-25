import React, { useRef, useEffect } from 'react';

interface WaveformVisualizerProps {
  analyser: AnalyserNode | null;
  barColor: string;
  isPlaying: boolean;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ analyser, barColor, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const draw = () => {
      if (!analyser || !canvasRef.current || !isPlaying) {
        if(animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        return;
      };

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      
      const barWidth = (width / bufferLength) * 1.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2.5;
        
        ctx.fillStyle = barColor;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 2;
      }

      animationFrameId.current = requestAnimationFrame(draw);
    };

    if (isPlaying && analyser) {
      draw();
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, barColor, analyser]);

  return (
    <div className="w-full">
      <canvas ref={canvasRef} width="500" height="80" className="w-full h-20" />
    </div>
  );
};

export default WaveformVisualizer;