import React from 'react';
import { CameraIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center bg-indigo-500/10 rounded-full p-3 mb-4">
            <CameraIcon className="w-8 h-8 text-indigo-400"/>
        </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
        AI Model Generator
      </h1>
      <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
        Instantly generate stunning model photos, lifestyle shots, and promotional videos from a single product image.
      </p>
    </header>
  );
};