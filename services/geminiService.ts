import { GoogleGenAI, Modality } from "@google/genai";
import { ImageStyle } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PENCIL_ART_PROMPT = "Transform this photo into a hyper-realistic sketch made with a pencil on a plain white sheet. Erase all background elements so that only the person(s) remain in the drawing. Use precise shading, hatching, and cross-hatching techniques with the pen to bring out the depth, texture, and likeness. Add a slightly angled pencil at one corner of the paper as a subtle signature, indicating it was the tool used to create the artwork. The final image should consist solely of the sketched figure(s) and the pencil on a clean white background.";

interface ReferenceImage {
  base64: string;
  mimeType: string;
}

export const generateImage = async (prompt: string, style: string, refImage: ReferenceImage | null, aspectRatio: string, seed: number | null): Promise<string> => {
  let fullPrompt = style === ImageStyle.PENCIL_ART
    ? `${prompt}. ${PENCIL_ART_PROMPT}`
    : `${prompt}, in the style of ${style}`;
  
  if (aspectRatio && aspectRatio !== '1:1') {
    fullPrompt = `${fullPrompt}, ${aspectRatio} aspect ratio`;
  }
  
  const parts: any[] = [{ text: fullPrompt }];

  if (refImage) {
    parts.unshift({
      inlineData: {
        data: refImage.base64,
        mimeType: refImage.mimeType,
      },
    });
  }
  
  const config: any = {
    responseModalities: [Modality.IMAGE],
  };

  if (seed) {
    config.seed = seed;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: config,
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response.");

  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image. Please check the console for details.");
  }
};

export const generateRandomPrompt = async (): Promise<string> => {
  const prompt = `Generate a single, short, creative, and visually descriptive prompt for an AI image generator. The prompt should be a concise sentence describing a unique scene. No quotes.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating random prompt:", error);
    return "A majestic lion with a fiery mane roaring on a cliff"; // Fallback prompt
  }
};