
import React, { useState } from 'react';
import { SenseData } from '../types';

interface SenseCardProps {
  sense: SenseData;
  onClick: (id: string) => void;
}

const SenseCard: React.FC<SenseCardProps> = ({ sense, onClick }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <button 
      onClick={() => onClick(sense.id)}
      className="w-full text-right group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 focus:ring-4 focus:ring-blue-400 focus:outline-none active:scale-95 active:brightness-90 active:shadow-inner scroll-mt-24"
      aria-label={`גלה עוד על חוש ה${sense.name}, הפועל באמצעות ה${sense.organ}`}
    >
      <div className="relative h-32 overflow-hidden">
        {/* Loading Skeleton */}
        {!isImageLoaded && (
          <div className={`absolute inset-0 ${sense.color} animate-pulse flex items-center justify-center`} aria-hidden="true">
            <div className="w-12 h-12 rounded-full bg-white/20 animate-bounce"></div>
          </div>
        )}
        
        {/* Background Image */}
        <img 
          src={sense.imageUrl} 
          alt="" // Decorative since sense.name is in the heading
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Overlay Icon with subtle blinking animation */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30 group-hover:bg-black/0 transition-colors flex items-center justify-center">
          <span className="text-5xl transition-transform duration-300 group-hover:scale-125 drop-shadow-md animate-pulse-subtle" aria-hidden="true">
            {sense.icon}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">{sense.name}</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-1 font-medium">האיבר: {sense.organ}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{sense.description}</p>
        <span className={`mt-4 inline-block px-6 py-2 rounded-full ${sense.color} text-white font-bold text-sm shadow-sm transition-transform active:scale-105`} aria-hidden="true">
          גלה עוד
        </span>
      </div>
    </button>
  );
};

export default SenseCard;
