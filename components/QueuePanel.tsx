import React from 'react';
import { Track } from '../types';
import { PlayIcon } from './Icons';

interface QueuePanelProps {
  tracks: Track[];
  currentTrackIndex: number;
  onTrackSelect: (index: number) => void;
  isOpen: boolean;
}

const QueuePanel: React.FC<QueuePanelProps> = ({ tracks, currentTrackIndex, onTrackSelect, isOpen }) => {
  return (
    <div className={`
      absolute top-0 right-0 h-full w-80 bg-black bg-opacity-50 backdrop-blur-lg
      transition-transform duration-300 ease-in-out z-20
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="p-4">
        <h2 className="text-xl font-bold text-white mb-4">Up Next</h2>
        <div className="flex flex-col space-y-2 overflow-y-auto" style={{maxHeight: 'calc(100vh - 80px)'}}>
          {tracks.map((track, index) => {
            const isCurrent = index === currentTrackIndex;
            return (
              <div
                key={track.id}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                  isCurrent ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
                }`}
                onClick={() => onTrackSelect(index)}
              >
                <img src={track.coverArt} alt={track.title} className="w-12 h-12 rounded-md mr-4" />
                <div className="flex-1">
                  <p className={`font-semibold ${isCurrent ? 'text-white' : 'text-gray-200'}`}>{track.title}</p>
                  <p className={`text-sm ${isCurrent ? 'text-gray-300' : 'text-gray-400'}`}>{track.artist}</p>
                </div>
                {isCurrent && <PlayIcon className="w-6 h-6 text-white" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QueuePanel;