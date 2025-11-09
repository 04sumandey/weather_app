
import React, { useState, useEffect } from 'react';
import { City } from '../types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectCity: (city: City) => void;
  cities: City[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onSelectCity, cities }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 400); // 400ms debounce delay

    return () => {
      clearTimeout(handler);
    };
  }, [query, onSearch]);

  const handleSelectCity = (city: City) => {
    onSelectCity(city);
    setQuery('');
  };

  return (
    <div className="relative w-full sm:w-64">
      <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full px-4 py-2 text-white bg-white/10 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition duration-300 placeholder-white/60"
          aria-label="Search for a city"
        />
        <button type="submit" aria-label="Search" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </button>
      </form>
      {cities.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 max-h-60 overflow-y-auto">
          {cities.map((city) => (
            <li
              key={`${city.lat}-${city.lon}`}
              onClick={() => handleSelectCity(city)}
              className="px-4 py-2 text-white cursor-pointer hover:bg-white/20"
            >
              {city.name}, {city.country} {city.state && `(${city.state})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
