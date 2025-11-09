
import React from 'react';

export const WeatherCardSkeleton: React.FC = () => (
  <div className="bg-black/20 p-6 rounded-2xl shadow-lg animate-pulse">
    <div className="flex justify-between items-start">
      <div>
        <div className="h-8 w-48 bg-gray-400/30 rounded-md mb-2"></div>
        <div className="h-6 w-32 bg-gray-400/30 rounded-md mb-4"></div>
        <div className="h-20 w-32 bg-gray-400/30 rounded-md"></div>
      </div>
      <div className="w-32 h-32 bg-gray-400/30 rounded-full -mt-8 -mr-4"></div>
    </div>
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="h-24 bg-gray-400/30 rounded-xl"></div>
      <div className="h-24 bg-gray-400/30 rounded-xl"></div>
      <div className="h-24 bg-gray-400/30 rounded-xl"></div>
      <div className="h-24 bg-gray-400/30 rounded-xl"></div>
      <div className="h-24 bg-gray-400/30 rounded-xl"></div>
    </div>
  </div>
);
