export enum ImageStyle {
  REALISTIC = "Realistic photography",
  ANIME = "Anime style",
  DIGITAL_ART = "Digital art",
  THREE_D = "3D render",
  PIXEL_ART = "Pixel art",
  FANTASY = "Fantasy art",
  NEON_PUNK = "Neon-punk",
  PENCIL_ART = "Pencil Art",
}

export interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
  style: ImageStyle;
  aspectRatio: string;
  seed: number | null;
}