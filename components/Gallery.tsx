import React from 'react';

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((src, index) => (
        <div key={index} className="aspect-square rounded-lg overflow-hidden shadow-lg">
            <img 
                src={src} 
                alt={`Moodboard image ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
        </div>
      ))}
    </div>
  );
};

export default Gallery;