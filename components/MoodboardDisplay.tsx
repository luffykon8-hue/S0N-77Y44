import React, { useState, useEffect, useCallback } from 'react';
import { Track } from '../types';
import { generateMoodboardImages } from '../services/geminiService';
import Gallery from './Gallery';
import { MoodboardIcon } from './Icons';

interface MoodboardDisplayProps {
  currentTrack: Track;
  isOpen: boolean;
}

const MoodboardDisplay: React.FC<MoodboardDisplayProps> = ({ currentTrack, isOpen }) => {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImages = useCallback(async () => {
    if (!currentTrack) return;
    setIsLoading(true);
    setError(null);
    setImages([]);

    const prompt = `Generate a visual moodboard that captures the essence of ${currentTrack.genre} music. Focus on themes like: ${currentTrack.title}. Create an atmospheric, visually striking, and artistic collection of images.`;
    
    try {
      const generatedImages = await generateMoodboardImages(prompt);
      if (generatedImages.length > 0) {
        setImages(generatedImages);
      } else {
        setError('Could not generate images. Please try again.');
      }
    } catch (e) {
      setError('An error occurred while generating images.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [currentTrack]);

  useEffect(() => {
    // Generate images when the panel is opened or when the track changes while open.
    if (isOpen) {
      generateImages();
    }
  }, [isOpen, generateImages]);

  return (
    <div className={`
      absolute top-0 left-0 h-full w-80 bg-black bg-opacity-50 backdrop-blur-lg
      transition-transform duration-300 ease-in-out z-20
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-4 text-white">
        <h2 className="text-xl font-bold mb-4">Visual Moodboard</h2>
        <p className="text-sm text-gray-300 mb-1">
            <span className="font-semibold">{currentTrack.title}</span>
        </p>
        <p className="text-xs text-gray-400 mb-4">
            AI-generated images inspired by the music.
        </p>
        
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-64">
                <MoodboardIcon className="w-10 h-10 animate-spin" />
                <p className="mt-4 text-sm text-gray-300">Generating images...</p>
            </div>
        )}

        {error && (
            <div className="text-center p-4 bg-red-900 bg-opacity-50 rounded-md">
                <p>{error}</p>
                <button 
                    onClick={generateImages}
                    className="mt-2 px-4 py-1 bg-white text-black rounded-md text-sm font-semibold"
                >
                    Retry
                </button>
            </div>
        )}

        {!isLoading && !error && images.length > 0 && (
            <Gallery images={images} />
        )}
      </div>
    </div>
  );
};

export default MoodboardDisplay;