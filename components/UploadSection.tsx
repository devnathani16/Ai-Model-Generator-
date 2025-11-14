
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GenerationConfig, ModelOptions, PhotoType } from '../types';
import { GENDERS, SKIN_TONES, HEIGHTS } from '../constants';
import { ImageIcon, SparklesIcon, SpinnerIcon, UploadIcon } from './icons';

interface UploadSectionProps {
  onFileSelect: (file: File | null) => void;
  onGenerateImages: (config: GenerationConfig, backgroundImageFile: File | null) => void;
  isGeneratingImages: boolean;
  sourcePreview: string | null;
  sourceFileType: string | undefined;
}

const initialConfig: GenerationConfig = {
  productType: '',
  numberOfImages: 1,
  photoTypes: [],
  modelOptions: {
    gender: 'Any',
    skinTone: 'Any',
    height: 'Any',
    gesture: '',
  },
  backgroundDescription: '',
};

export const UploadSection: React.FC<UploadSectionProps> = ({
  onFileSelect,
  onGenerateImages,
  isGeneratingImages,
  sourcePreview,
  sourceFileType,
}) => {
  const [config, setConfig] = useState<GenerationConfig>(initialConfig);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);


  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  }, [onFileSelect]);

  const handleBackgroundFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setBackgroundImageFile(file);
  }, []);

  useEffect(() => {
    if (!backgroundImageFile) {
      setBackgroundPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(backgroundImageFile);
    setBackgroundPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [backgroundImageFile]);

  const handleConfigChange = (field: keyof GenerationConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleModelOptionsChange = (field: keyof ModelOptions, value: any) => {
    setConfig(prev => ({
      ...prev,
      modelOptions: { ...prev.modelOptions, [field]: value },
    }));
  };
  
  const handlePhotoTypeChange = (type: PhotoType) => {
    const newPhotoTypes = config.photoTypes.includes(type)
      ? config.photoTypes.filter(t => t !== type)
      : [...config.photoTypes, type];
    handleConfigChange('photoTypes', newPhotoTypes);
  };

  const isImageFile = useMemo(() => sourceFileType?.startsWith('image/'), [sourceFileType]);

  const renderPreview = () => {
    if (!sourcePreview) return (
        <div className="flex flex-col items-center justify-center text-slate-500">
            <ImageIcon className="w-16 h-16 mb-2"/>
            <p>Upload your product image</p>
        </div>
    );
    if (isImageFile) {
      return <img src={sourcePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />;
    }
    return <p>Unsupported file type. Please upload an image.</p>;
  };

  const showModelOptions = config.photoTypes.includes('model');
  const showBackgroundOptions = config.photoTypes.includes('lifestyle') || config.photoTypes.includes('model');


  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-4">
            <label htmlFor="file-upload" className="relative flex flex-col items-center justify-center w-full h-80 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
                {renderPreview()}
                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
            </label>
            <p className="text-center text-sm text-slate-500">Upload a clear photo of your product.</p>
        </div>

      <div className="bg-slate-800/50 p-6 rounded-xl space-y-6">
        <div>
          <label htmlFor="productType" className="block text-sm font-medium text-slate-300 mb-2">1. Product Description</label>
          <input type="text" id="productType" value={config.productType} onChange={e => handleConfigChange('productType', e.target.value)} placeholder="e.g., blue cotton t-shirt, stainless steel bottle" className="w-full bg-slate-700 border-slate-600 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>

        <div>
            <label htmlFor="numberOfImages" className="block text-sm font-medium text-slate-300 mb-2">2. Images Per Style ({config.numberOfImages})</label>
            <input type="range" id="numberOfImages" min="1" max="5" value={config.numberOfImages} onChange={e => handleConfigChange('numberOfImages', parseInt(e.target.value, 10))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"/>
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">3. Choose Photo Styles</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(['E-commerce', 'Lifestyle', 'Model'] as const).map(type => {
                    const typeId = type.split(' ')[0].toLowerCase() as PhotoType;
                    return (
                        <button key={typeId} onClick={() => handlePhotoTypeChange(typeId)} className={`text-center py-2 px-3 text-sm rounded-md transition-colors ${config.photoTypes.includes(typeId) ? 'bg-indigo-600 text-white font-semibold' : 'bg-slate-700 hover:bg-slate-600'}`}>
                            {type}
                        </button>
                    )
                })}
            </div>
        </div>

        {showModelOptions && (
            <div className="p-4 bg-slate-900/50 rounded-lg space-y-4 border border-slate-700">
                <h3 className="font-semibold text-indigo-400">Model Customization</h3>
                 <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Gender</label>
                        <select value={config.modelOptions.gender} onChange={e => handleModelOptionsChange('gender', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md py-1.5 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                            {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Skin Tone</label>
                        <select value={config.modelOptions.skinTone} onChange={e => handleModelOptionsChange('skinTone', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md py-1.5 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                            {SKIN_TONES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Height</label>
                        <select value={config.modelOptions.height} onChange={e => handleModelOptionsChange('height', e.target.value)} className="w-full bg-slate-700 border-slate-600 rounded-md py-1.5 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500">
                           {HEIGHTS.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                     <label className="block text-xs font-medium text-slate-400 mb-1">Gesture / Pose</label>
                     <input type="text" value={config.modelOptions.gesture} onChange={e => handleModelOptionsChange('gesture', e.target.value)} placeholder="e.g., walking, smiling, holding the product" className="w-full bg-slate-700 border-slate-600 rounded-md py-1.5 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
            </div>
        )}
        
        {showBackgroundOptions && (
            <div className="p-4 bg-slate-900/50 rounded-lg space-y-4 border border-slate-700">
                <h3 className="font-semibold text-indigo-400">Background & Scene</h3>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                    <textarea value={config.backgroundDescription} onChange={e => handleConfigChange('backgroundDescription', e.target.value)} placeholder="e.g., on a sunny beach, in a modern kitchen" rows={2} className="w-full bg-slate-700 border-slate-600 rounded-md py-1.5 px-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Reference Image (Optional)</label>
                    <div className="flex items-center gap-4">
                        <label htmlFor="bg-upload" className="flex-1 cursor-pointer text-center text-sm bg-slate-700 hover:bg-slate-600 rounded-md py-2 px-3 transition-colors">
                            <div className="flex items-center justify-center gap-2">
                                <UploadIcon className="w-4 h-4" />
                                <span>Upload Background</span>
                            </div>
                        </label>
                        <input id="bg-upload" type="file" className="sr-only" accept="image/*" onChange={handleBackgroundFileChange} />
                         {backgroundPreview && <img src={backgroundPreview} className="w-12 h-12 object-cover rounded-md" alt="Background preview"/>}
                    </div>
                </div>
            </div>
        )}

        <button
            onClick={() => onGenerateImages(config, backgroundImageFile)}
            disabled={isGeneratingImages || !isImageFile}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all"
            >
            {isGeneratingImages ? <SpinnerIcon /> : <SparklesIcon />}
            {isGeneratingImages ? 'Generating Photos...' : `Generate ${config.numberOfImages * config.photoTypes.length} Photos`}
        </button>
        {!isImageFile && sourcePreview && <p className="text-sm text-amber-400 text-center">Image generation requires an image file.</p>}
      </div>
    </div>
  );
};