
export interface GeneratedImage {
  id: string;
  src: string;
  prompt: string;
}

export type PhotoType = 'model' | 'lifestyle' | 'ecommerce';

export type Gender = 'Female' | 'Male' | 'Any';
export type SkinTone = 'Light' | 'Fair' | 'Medium' | 'Olive' | 'Brown' | 'Dark' | 'Any';
export type Height = 'Short' | 'Average' | 'Tall' | 'Any';

export interface ModelOptions {
  gender: Gender;
  skinTone: SkinTone;
  height: Height;
  gesture: string;
}

export interface GenerationConfig {
  productType: string;
  numberOfImages: number;
  photoTypes: PhotoType[];
  modelOptions: ModelOptions;
  backgroundDescription: string;
}

// FIX: Add VideoJob type definition.
export type VideoJobStatus = 'generating' | 'complete' | 'failed';

export interface VideoJob {
  id: string;
  prompt: string;
  status: VideoJobStatus;
  videoUrl?: string;
}