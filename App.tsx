import React, { useState, useEffect, useCallback } from 'react';
import { GeneratedImage, ImageStyle } from './types';
import { generateImage, generateRandomPrompt } from './services/geminiService';
import Header from './components/Header';
import PromptForm from './components/PromptForm';
import ImageGrid from './components/ImageGrid';

interface ReferenceImage {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPrompt, setIsFetchingPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<ReferenceImage | null>(null);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [seed, setSeed] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const executeImageGeneration = useCallback(async (currentPrompt: string, style: ImageStyle, refImg: ReferenceImage | null, ar: string, currentSeed: string) => {
    if (!currentPrompt.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const numericSeed = currentSeed ? parseInt(currentSeed, 10) : null;
      if (currentSeed && isNaN(numericSeed!)) {
        setError("Seed must be a valid number.");
        setIsLoading(false);
        return;
      }

      const imageToGenerateWith = refImg ? { base64: refImg.base64, mimeType: refImg.mimeType } : null;
      const imageUrl = await generateImage(currentPrompt, style, imageToGenerateWith, ar, numericSeed);
      const newImage: GeneratedImage = {
        id: `${Date.now()}-${Math.random()}`,
        src: imageUrl,
        prompt: currentPrompt,
        style: style,
        aspectRatio: ar,
        seed: numericSeed,
      };
      setImages(prevImages => [newImage, ...prevImages]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerate = (style: ImageStyle) => {
    executeImageGeneration(prompt, style, referenceImage, aspectRatio, seed);
  };
  
  const handleRegenerate = (regenPrompt: string, style: ImageStyle) => {
    // When regenerating, use the prompt/style from the card, but the advanced options from the form.
    executeImageGeneration(regenPrompt, style, null, aspectRatio, seed);
  };

  const handleSurpriseMe = useCallback(async () => {
    setIsFetchingPrompt(true);
    setError(null);
    try {
      const randomPrompt = await generateRandomPrompt();
      setPrompt(randomPrompt);
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred getting a random prompt.');
    } finally {
      setIsFetchingPrompt(false);
    }
  }, []);
  
  const handleDownload = (src: string, dlPrompt: string) => {
    const link = document.createElement('a');
    link.href = src;
    const safePrompt = dlPrompt.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50);
    link.download = `weber_image_${safePrompt}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen text-zinc-800 dark:text-zinc-200 transition-colors duration-300">
      <div className="relative isolate min-h-screen">
         <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-red-600 to-red-900 opacity-30 dark:opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
        </div>
        <Header darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
        <main>
          <PromptForm 
            prompt={prompt}
            onPromptChange={setPrompt}
            isLoading={isLoading} 
            isFetchingPrompt={isFetchingPrompt}
            onGenerate={handleGenerate}
            onSurpriseMe={handleSurpriseMe}
            referenceImage={referenceImage}
            onReferenceImageChange={setReferenceImage}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            seed={seed}
            onSeedChange={setSeed}
          />
          {error && (
            <div className="px-6 py-2 text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-md mx-6 my-4">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          <ImageGrid images={images} onRegenerate={handleRegenerate} onDownload={handleDownload} />
        </main>
      </div>
    </div>
  );
};

export default App;