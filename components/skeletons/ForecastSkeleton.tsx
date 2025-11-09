
import React from 'react';

export const ForecastSkeleton: React.FC = () => (
  <div className="bg-black/20 p-6 rounded-2xl shadow-lg animate-pulse">
    <div className="h-6 w-36 bg-gray-400/30 rounded-md mb-4"></div>
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="h-40 bg-gray-400/30 rounded-xl flex-1"></div>
      <div className="h-40 bg-gray-400/30 rounded-xl flex-1"></div>
      <div className="h-40 bg-gray-400/30 rounded-xl flex-1"></div>
    </div>
  </div>
);
