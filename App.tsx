
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { ImageGallery } from './components/ImageGallery';
import { GeneratedImage, GenerationConfig } from './types';
import { generateImageVariations } from './services/geminiService';

export default function App() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [loadingImageCount, setLoadingImageCount] = useState(0);

  useEffect(() => {
    if (!sourceFile) {
      setSourcePreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(sourceFile);
    setSourcePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [sourceFile]);

  const fileToGenerativePart = (file: File): Promise<{mimeType: string, data: string}> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result !== 'string') {
            return reject(new Error("Failed to read file as base64 string"));
        }
        const base64Data = reader.result.split(',')[1];
        resolve({
          mimeType: file.type,
          data: base64Data,
        });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageGeneration = async (
    config: GenerationConfig, 
    backgroundImageFile: File | null
  ) => {
    if (!sourceFile || !sourceFile.type.startsWith('image/')) {
      alert('Please upload a product image first.');
      return;
    }
     if (!config.productType) {
      alert('Please provide a product description.');
      return;
    }
     if (config.photoTypes.length === 0) {
      alert('Please select at least one photo type to generate.');
      return;
    }

    const count = config.numberOfImages * config.photoTypes.length;
    setLoadingImageCount(count);
    setIsGeneratingImages(true);
    setGeneratedImages([]);

    try {
      const productImage = await fileToGenerativePart(sourceFile);
      const backgroundImage = backgroundImageFile ? await fileToGenerativePart(backgroundImageFile) : null;
      
      const images = await generateImageVariations(productImage, config, backgroundImage);
      setGeneratedImages(images);
    } catch (error) {
      console.error('Image generation failed:', error);
      alert('An error occurred during image generation. Please check the console and ensure your API key is set correctly.');
    } finally {
      setIsGeneratingImages(false);
      setLoadingImageCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        <UploadSection
          onFileSelect={setSourceFile}
          onGenerateImages={handleImageGeneration}
          isGeneratingImages={isGeneratingImages}
          sourcePreview={sourcePreview}
          sourceFileType={sourceFile?.type}
        />
        <div className="mt-12 space-y-12">
          <ImageGallery images={generatedImages} isLoading={isGeneratingImages} loadingImageCount={loadingImageCount} />
        </div>
      </main>
    </div>
  );
}