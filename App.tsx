
import React, { useEffect, useState } from 'react';
import useWeather from './hooks/useWeather';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { Forecast } from './components/Forecast';
import { UnitsToggle } from './components/UnitsToggle';
import { WeatherCardSkeleton } from './components/skeletons/WeatherCardSkeleton';
import { ForecastSkeleton } from './components/skeletons/ForecastSkeleton';
import { Unit, City } from './types';
import { BG_MAP } from './constants';

const App: React.FC = () => {
  const { weather, forecast, loading, error, unit, setUnit, fetchWeatherByCity, fetchWeatherByCoords, cities, searchCitiesByQuery, clearCities } = useWeather();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          setInitialLoad(false);
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          // Fallback to a default city if geolocation fails or is denied
          fetchWeatherByCity('London');
          setInitialLoad(false);
        }
      );
    } else {
      // Fallback for browsers that don't support geolocation
      fetchWeatherByCity('London');
      setInitialLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (query: string) => {
    searchCitiesByQuery(query);
  };

  const handleSelectCity = (city: City) => {
    fetchWeatherByCoords(city.lat, city.lon);
    clearCities();
  };
  
  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
  };
  
  const weatherMain = weather?.weather[0]?.main || 'Clear';
  const backgroundClass = BG_MAP[weatherMain] || BG_MAP.Clear;

  return (
    <main className={`min-h-screen font-sans text-white transition-all duration-1000 ${backgroundClass}`}>
      <div className="min-h-screen w-full bg-black bg-opacity-20 backdrop-blur-sm flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <header className="flex flex-col sm:flex-row justify-between items-center w-full mb-6 gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-wider text-shadow">React Weather</h1>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <SearchBar 
                onSearch={handleSearch}
                onSelectCity={handleSelectCity}
                cities={cities}
              />
              <UnitsToggle selectedUnit={unit} onUnitChange={handleUnitChange} />
            </div>
          </header>
          
          <div className="w-full">
            {error && (
              <div className="bg-red-500/50 text-white p-4 rounded-lg text-center backdrop-blur-md border border-red-500/60">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {loading || initialLoad ? (
              <div className="space-y-8">
                <WeatherCardSkeleton />
                <ForecastSkeleton />
              </div>
            ) : (
              weather && forecast && (
                <div className="space-y-8">
                  <WeatherCard data={weather} unit={unit} />
                  <Forecast data={forecast} unit={unit} />
                </div>
              )
            )}
          </div>
          <footer className="text-center mt-8 text-sm text-white/70">
            <p>Powered by OpenWeatherMap API</p>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default App;
