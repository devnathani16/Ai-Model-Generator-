
import { GoogleGenAI, Modality } from "@google/genai";
import { GeneratedImage, GenerationConfig, PhotoType } from '../types';

const getAi = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      // In a real app, the key is handled by the environment.
      // This client-side check is a fallback.
      throw new Error("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey });
}

const buildPrompts = (config: GenerationConfig): {type: PhotoType, text: string}[] => {
    const prompts: {type: PhotoType, text: string}[] = [];
    const { productType, photoTypes, modelOptions, backgroundDescription, numberOfImages } = config;

    const createPromptsForType = (type: PhotoType, generator: () => string) => {
        if (photoTypes.includes(type)) {
            for (let i = 0; i < numberOfImages; i++) {
                prompts.push({ type, text: generator() });
            }
        }
    };

    createPromptsForType('ecommerce', () => 
        `High-quality e-commerce product photo of ${productType} on a pure white background. Clean, professional studio lighting, front-facing view.`
    );
    
    createPromptsForType('lifestyle', () =>
        `A lifestyle photo of ${productType}. The setting is: ${backgroundDescription || 'a neutral, modern environment'}.`
    );

    createPromptsForType('model', () => {
        const modelDesc = [
            modelOptions.height !== 'Any' ? modelOptions.height.toLowerCase() : '',
            modelOptions.skinTone !== 'Any' ? `${modelOptions.skinTone.toLowerCase()} skin` : '',
            modelOptions.gender !== 'Any' ? modelOptions.gender.toLowerCase() : ''
        ].filter(Boolean).join(', ');

        return `Photo of a ${modelDesc || 'person'} as a model. The model is ${modelOptions.gesture || 'elegantly posing'} and is showcasing ${productType}. The background is: ${backgroundDescription || 'a stylish, blurred setting'}.`;
    });
    
    return prompts;
};


export const generateImageVariations = async (
    productImage: { data: string; mimeType: string },
    config: GenerationConfig,
    backgroundImage: { data: string; mimeType: string } | null
): Promise<GeneratedImage[]> => {
  const ai = getAi();
  const prompts = buildPrompts(config);

  const productImagePart = { inlineData: productImage };
  const backgroundImagePart = backgroundImage ? { inlineData: backgroundImage } : null;

  const generationPromises = prompts.map(async (promptInfo, index) => {
    try {
        const parts: ({ inlineData: { data: string; mimeType: string; } } | { text: string; })[] = [];
        let finalPromptText = promptInfo.text;
        
        parts.push(productImagePart);
        if (backgroundImagePart && (promptInfo.type === 'lifestyle' || promptInfo.type === 'model')) {
            parts.push(backgroundImagePart);
            finalPromptText = promptInfo.text.replace(/The setting is:.*$|The background is:.*$/, 'Place the product and/or model in the environment of the provided background image, matching the lighting and style.');
        }
        parts.push({ text: finalPromptText });
        
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts }],
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData) {
        return {
          id: `${Date.now()}-${index}`,
          src: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
          prompt: finalPromptText,
        };
      }
      return null;
    } catch (error) {
      console.error(`Error generating image for prompt: "${promptInfo.text}"`, error);
      return null;
    }
  });

  const results = await Promise.all(generationPromises);
  return results.filter((image): image is GeneratedImage => image !== null);
};