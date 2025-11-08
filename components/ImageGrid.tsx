import React from 'react';
import { GeneratedImage } from '../types';
import ImageCard from './ImageCard';

interface ImageGridProps {
  images: GeneratedImage[];
  onRegenerate: (prompt: string, style: GeneratedImage['style']) => void;
  onDownload: (src: string, prompt: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onRegenerate, onDownload }) => {
  if (images.length === 0) {
    return (
      <div className="text-center py-20 px-6">
        <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-300 mb-2">Welcome to WEBER</h2>
        <p className="text-zinc-600 dark:text-zinc-400">Your generated images will appear here. Let's create something amazing!</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {images.map((image) => (
        <ImageCard 
          key={image.id} 
          image={image} 
          onRegenerate={onRegenerate} 
          onDownload={onDownload}
        />
      ))}
    </div>
  );
};

export default ImageGrid;