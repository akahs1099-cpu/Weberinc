import React, { useEffect, useState } from 'react';
import { GeneratedImage } from '../types';
import { DownloadIcon, RegenerateIcon } from './icons';

interface ImageCardProps {
  image: GeneratedImage;
  onRegenerate: (prompt: string, style: GeneratedImage['style']) => void;
  onDownload: (src: string, prompt: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onRegenerate, onDownload }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const handleDownload = () => {
    onDownload(image.src, image.prompt);
  };

  const handleRegenerate = () => {
    onRegenerate(image.prompt, image.style);
  };

  return (
    <div className={`transition-all duration-700 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
      <div className="group relative overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 shadow-lg">
        <img src={image.src} alt={image.prompt} className="w-full h-auto aspect-square object-cover" />
        <div className="absolute inset-0 bg-black/70 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div>
            <p className="text-white text-sm leading-tight mb-2">{image.prompt}, <span className="italic opacity-80">{image.style}</span></p>
            <p className="text-xs text-white/70">AR: {image.aspectRatio}{image.seed ? `, Seed: ${image.seed}` : ''}</p>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleRegenerate}
              className="flex-1 p-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors duration-200 backdrop-blur-sm"
              title="Regenerate"
            >
              <RegenerateIcon className="w-5 h-5 mx-auto" />
            </button>
            <button
              onClick={handleDownload}
              className="flex-1 p-2 bg-white/20 hover:bg-white/30 text-white rounded-md transition-colors duration-200 backdrop-blur-sm"
              title="Download"
            >
              <DownloadIcon className="w-5 h-5 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;