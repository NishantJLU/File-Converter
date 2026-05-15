import React from 'react';

interface ProgressProps {
  progress: number;
  status: string;
}

export const ProgressDisplay = ({ progress, status }: ProgressProps) => {
  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-bold text-black dark:text-white uppercase tracking-tight">{status}</span>
        <span className="text-sm font-bold text-black dark:text-white">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner border dark:border-gray-700">
        <div 
          className="bg-red-600 h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
