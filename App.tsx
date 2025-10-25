import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRACKS, LYRICS_DATA } from './constants';
import { Track, RepeatMode } from './types';
import LyricsDisplay from './components/LyricsDisplay';
import WaveformVisualizer from './components/WaveformVisualizer';
import BubbleBackground from './components/BubbleBackground';
import QueuePanel from './components/QueuePanel';
import MoodboardDisplay from './components/MoodboardDisplay';
import { 
    PlayIcon, PauseIcon, SkipNextIcon, SkipPreviousIcon, ShuffleIcon, 
    RepeatIcon, RepeatOneIcon, VolumeUpIcon, QueueIcon, MoodboardIcon,
    MicrophoneIcon, MinimizeIcon, MaximizeIcon, CloseIcon
} from './components/Icons';

function App() {
  const [tracks] = useState<Track[]>(() => 
    TRACKS.map(track => ({ ...track, lyrics: LYRICS_DATA[track.id] || [] }))
  );
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isMoodboardOpen, setIsMoodboardOpen] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const lastTrackIndexRef = useRef<number | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  const setupAudioContext = () => {
    if (!audioContextRef.current && audioRef.current) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      const source = context.createMediaElementSource(audioRef.current);

      source.connect(analyser);
      analyser.connect(context.destination);
      
      audioContextRef.current = context;
      analyserRef.current = analyser;
      sourceRef.current = source;
    }
  };

  const handlePlayPause = () => {
    if (!audioContextRef.current) {
        setupAudioContext();
    }
    audioContextRef.current?.resume();
    setIsPlaying(prev => !prev);
  };
  
  const handleNext = useCallback(() => {
    if (isShuffle) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * tracks.length);
      } while (tracks.length > 1 && nextIndex === currentTrackIndex);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
  }, [isShuffle, tracks.length, currentTrackIndex]);

  const handlePrev = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    }
  };

  const toggleShuffle = () => setIsShuffle(prev => !prev);
  const toggleMinimize = () => setIsMinimized(prev => !prev);

  const handleClose = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentTime(0);
    setIsQueueOpen(false);
    setIsMoodboardOpen(false);
    setIsMinimized(true);
  };

  const toggleRepeat = () => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(e.target.value);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handleSongEnd = useCallback(() => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (repeatMode === 'all' || (currentTrackIndex !== tracks.length - 1)) {
      handleNext();
    } else {
      setIsPlaying(false);
    }
  }, [repeatMode, handleNext, currentTrackIndex, tracks.length]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const trackHasChanged = lastTrackIndexRef.current !== currentTrackIndex;
      
      if (trackHasChanged) {
        lastTrackIndexRef.current = currentTrackIndex;
        audioElement.load();
      }
      
      if (isPlaying) {
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Error playing audio:", e);
            // If play fails (e.g., autoplay restrictions), update the state.
            setIsPlaying(false);
          });
        }
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    document.documentElement.style.setProperty('--main-color', currentTrack.mainColor);
  }, [currentTrack]);
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const RepeatButton = () => {
    if (repeatMode === 'one') return <RepeatOneIcon className="w-5 h-5 text-white" />;
    return <RepeatIcon className={`w-5 h-5 ${repeatMode === 'all' ? 'text-white' : 'text-gray-400'}`} />;
  };
  
  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeInOut" } },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeInOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans relative overflow-hidden p-4">
      <BubbleBackground analyser={analyserRef.current} isPlaying={isPlaying} />

      <main className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
        <AnimatePresence>
            {!isMinimized && (
                 <motion.div
                    key="album-art-wrapper"
                    className="w-full max-w-sm md:w-1/3"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="relative w-full aspect-square rounded-2xl shadow-2xl overflow-hidden group">
                            <img 
                                src={currentTrack.coverArt} 
                                alt={currentTrack.title} 
                                className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? '' : 'scale-95'}`}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        </div>
                        <h1 className="text-3xl font-bold mt-6">{currentTrack.title}</h1>
                        <h2 className="text-lg text-gray-400 mt-1">{currentTrack.artist}</h2>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className={`w-full ${isMinimized ? 'md:w-full max-w-lg' : 'md:w-2/3'} flex flex-col items-center h-full transition-all duration-500`}>
          <div className="w-full relative mb-6">
             <div className="absolute top-2 right-2 z-20 flex items-center gap-2">
                 <button onClick={toggleMinimize} className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors">
                    {isMinimized ? <MaximizeIcon className="w-3 h-3 text-white"/> : <MinimizeIcon className="w-3 h-3 text-white"/>}
                </button>
                <button onClick={handleClose} className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors">
                    <CloseIcon className="w-3 h-3 text-white"/>
                </button>
            </div>
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  key="display-panel-wrapper"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="w-full bg-gray-900 bg-opacity-30 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center overflow-hidden">
                    {/* Waveform Visualizer - always visible when panel is open */}
                    <div className="w-full h-24 flex items-center justify-center">
                      <WaveformVisualizer analyser={analyserRef.current} barColor={currentTrack.mainColor} isPlaying={isPlaying} />
                    </div>

                    {/* Lyrics Pane - toggled */}
                    <AnimatePresence>
                      {showLyrics && (
                        <motion.div
                          key="lyrics-pane"
                          className="w-full overflow-hidden mt-4 pt-4 border-t border-white/10"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          <div className="h-40 md:h-56">
                            <LyricsDisplay
                              lyrics={currentTrack.lyrics || []}
                              currentTime={currentTime}
                              activeColor={currentTrack.mainColor}
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="w-full">
            <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <input
                    type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek}
                    className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{'--thumb-color': currentTrack.mainColor} as React.CSSProperties}
                />
                <span>{formatTime(duration)}</span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button onClick={toggleShuffle} className="p-2">
                <ShuffleIcon className={`w-5 h-5 ${isShuffle ? 'text-white' : 'text-gray-400'}`} />
              </button>
              <div className="flex items-center gap-4">
                <button onClick={handlePrev} className="p-2"><SkipPreviousIcon className="w-8 h-8" /></button>
                <button onClick={handlePlayPause} className="bg-white text-gray-900 rounded-full p-4 transition-transform hover:scale-105 shadow-lg" style={{boxShadow: `0 0 20px ${currentTrack.mainColor}80`}}>
                  {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
                </button>
                <button onClick={handleNext} className="p-2"><SkipNextIcon className="w-8 h-8" /></button>
              </div>
              <button onClick={toggleRepeat} className="p-2"><RepeatButton /></button>
            </div>
            <div className="flex items-center justify-between mt-4 text-gray-400">
                <button className={`p-2 rounded-lg transition-colors ${isMoodboardOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`} onClick={() => setIsMoodboardOpen(p => !p)}><MoodboardIcon className="w-5 h-5" /></button>
                <button className={`p-2 rounded-lg transition-colors ${showLyrics ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`} onClick={() => setShowLyrics(p => !p)}><MicrophoneIcon className="w-5 h-5" /></button>
                <div className="flex items-center gap-2 w-32">
                    <VolumeUpIcon className="w-5 h-5" />
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer" style={{'--thumb-color': currentTrack.mainColor} as React.CSSProperties}/>
                </div>
                 <button className={`p-2 rounded-lg transition-colors ${isQueueOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`} onClick={() => setIsQueueOpen(p => !p)}><QueueIcon className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </main>

      <MoodboardDisplay currentTrack={currentTrack} isOpen={isMoodboardOpen}/>
      <QueuePanel tracks={tracks} currentTrackIndex={currentTrackIndex} onTrackSelect={handleTrackSelect} isOpen={isQueueOpen}/>
      
      <audio ref={audioRef} src={currentTrack.audioSrc} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleSongEnd} crossOrigin="anonymous"/>
    </div>
  );
}

export default App;