
import React from 'react';
import { DownloadIcon, SpinnerIcon, ImageIcon } from './icons';

interface ImageGalleryProps {
  images: { id: string; src: string; prompt: string }[];
  isLoading: boolean;
  loadingImageCount: number;
}

const ImageCard: React.FC<{ image: { src: string; prompt: string; id: string } }> = ({ image }) => (
    <div className="group relative aspect-square bg-slate-800 rounded-lg overflow-hidden">
        <img src={image.src} alt={image.prompt} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
            <p className="text-xs text-slate-300 mb-2 line-clamp-3" title={image.prompt}>{image.prompt}</p>
            <a
                href={image.src}
                download={`ai-product-shot-${image.id}.png`}
                className="self-start mt-auto flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold py-1.5 px-3 rounded-md hover:bg-indigo-500 transition-colors"
            >
                <DownloadIcon className="w-4 h-4" />
                Download
            </a>
        </div>
    </div>
);


const SkeletonCard: React.FC = () => (
    <div className="aspect-square bg-slate-800 rounded-lg animate-pulse"></div>
);

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isLoading, loadingImageCount }) => {
  if (!isLoading && images.length === 0) {
    return null;
  }
  
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <ImageIcon className="w-7 h-7 text-indigo-400"/>
          Generated Images
      </h2>
      
      {isLoading && images.length === 0 && (
        <div className="text-center p-8 bg-slate-800/50 rounded-lg">
            <SpinnerIcon className="mx-auto w-10 h-10 mb-4 text-indigo-400"/>
            <p className="font-semibold text-lg">Generating your product photos...</p>
            <p className="text-slate-400">The AI is creating your custom images. This may take a moment.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading && images.length === 0 
            ? Array.from({ length: loadingImageCount }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)
            : images.map(image => <ImageCard key={image.id} image={image} />)
        }
      </div>
    </section>
  );
};
