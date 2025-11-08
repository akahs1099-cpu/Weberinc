import React, { useState, useRef } from 'react';
import { ImageStyle } from '../types';
import { IMAGE_STYLES } from '../constants';
import { LoaderIcon, SparklesIcon, ImageIcon, CloseIcon, SlidersIcon, ChevronDownIcon } from './icons';

interface ReferenceImage {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

interface PromptFormProps {
  prompt: string;
  onPromptChange: (newPrompt: string) => void;
  isLoading: boolean;
  isFetchingPrompt: boolean;
  onGenerate: (style: ImageStyle) => void;
  onSurpriseMe: () => void;
  referenceImage: ReferenceImage | null;
  onReferenceImageChange: (image: ReferenceImage | null) => void;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  seed: string;
  onSeedChange: (seed: string) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({ 
  prompt, 
  onPromptChange, 
  isLoading, 
  isFetchingPrompt,
  onGenerate, 
  onSurpriseMe,
  referenceImage,
  onReferenceImageChange,
  aspectRatio,
  onAspectRatioChange,
  seed,
  onSeedChange
}) => {
  const [style, setStyle] = useState<ImageStyle>(ImageStyle.DIGITAL_ART);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isPencilArtStyle = style === ImageStyle.PENCIL_ART;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPencilArtStyle) {
      if (referenceImage) onGenerate(style);
    } else if (prompt.trim()) {
      onGenerate(style);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        onReferenceImageChange({
          base64,
          mimeType: file.type,
          previewUrl: dataUrl,
        });
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  const commonInputClasses = "w-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md py-2 px-3 focus:ring-red-500 focus:border-red-500 transition-colors duration-200 text-zinc-800 dark:text-zinc-200";

  return (
    <div className="p-4 md:p-6 sticky top-0 z-10 bg-zinc-100/80 dark:bg-black/80 backdrop-blur-lg">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        <div>
          <label htmlFor="prompt-input" className="sr-only">Describe the image you want to create</label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder={isPencilArtStyle ? "Describe your subject for the pencil sketch..." : "Describe the image you want to create..."}
            rows={3}
            className="w-full p-4 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-zinc-800 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400 resize-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="style-select" className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Style</label>
            <select
              id="style-select"
              value={style}
              onChange={(e) => setStyle(e.target.value as ImageStyle)}
              className={commonInputClasses}
            >
              {IMAGE_STYLES.map((s) => (
                <option key={s} value={s}>{s.replace(/ style| photography/gi, '')}</option>
              ))}
            </select>
          </div>
          <div>
             <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Reference Image (Optional)</label>
             {referenceImage ? (
                <div className="relative w-full h-[42px] flex items-center">
                    <img src={referenceImage.previewUrl} alt="Reference preview" className="h-full rounded-l-md aspect-video object-cover" />
                    <button 
                        type="button" 
                        onClick={() => onReferenceImageChange(null)}
                        className="absolute top-0 right-0 p-1 bg-black/50 text-white rounded-full -translate-y-1/2 translate-x-1/2 hover:bg-red-500 transition-colors"
                        aria-label="Remove reference image"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-xs px-3 truncate bg-zinc-200 dark:bg-zinc-900 border-y border-r border-zinc-300 dark:border-zinc-700 h-full flex items-center rounded-r-md">
                        Image selected
                    </div>
                </div>
             ) : (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-[42px] flex items-center justify-center gap-2 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors duration-200"
                >
                    <ImageIcon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    <span className="text-sm">Upload Image</span>
                </button>
             )}
             <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" className="hidden" />
          </div>
        </div>

        <div className="space-y-3 pt-2">
            <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-center w-full text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-500 transition-colors"
                aria-expanded={showAdvanced}
            >
                <SlidersIcon className="w-4 h-4 mr-2" />
                Advanced Options
                <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
            
            {showAdvanced && (
                <div className="animate-fade-in p-4 bg-zinc-200/50 dark:bg-zinc-900/50 rounded-lg space-y-4 border border-zinc-300 dark:border-zinc-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                    <label htmlFor="aspect-ratio-select" className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Aspect Ratio</label>
                    <select id="aspect-ratio-select" value={aspectRatio} onChange={(e) => onAspectRatioChange(e.target.value)} className={commonInputClasses}>
                        {['1:1', '16:9', '9:16', '4:3', '3:4'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    </div>
                    <div>
                    <label htmlFor="seed-input" className="block text-sm font-medium text-zinc-700 dark:text-zinc-400 mb-2">Seed</label>
                    <input
                        type="number"
                        id="seed-input"
                        value={seed}
                        onChange={(e) => onSeedChange(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Random"
                        className={commonInputClasses}
                    />
                    </div>
                </div>
                </div>
            )}
        </div>

        {isPencilArtStyle && !referenceImage && (
          <div className="text-center text-sm text-amber-600 dark:text-amber-500 bg-amber-500/10 p-3 rounded-md border border-amber-500/20">
            "Pencil Art" style requires a reference image to transform. Your text prompt will describe the subject.
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            type="button"
            onClick={onSurpriseMe}
            disabled={isLoading || isFetchingPrompt}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-red-500/50 text-base font-medium rounded-md text-red-500 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            {isFetchingPrompt ? <LoaderIcon className="w-5 h-5 animate-spin" /> : <SparklesIcon className="w-5 h-5" />}
            Random
          </button>
          <button
            type="submit"
            disabled={isLoading || isFetchingPrompt || (isPencilArtStyle ? !referenceImage : !prompt.trim())}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30 dark:shadow-red-800/50"
          >
            {isLoading ? (
              <>
                <LoaderIcon className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptForm;