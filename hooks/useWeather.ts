import { useState, useEffect, useCallback } from 'react';
import { WeatherData, ForecastData, Unit, City } from '../types';
import { getCurrentWeather, getForecast, searchCities } from '../services/weatherService';

interface WeatherCache {
  [key: string]: {
    weather: WeatherData;
    forecast: ForecastData;
    timestamp: number;
  };
}

const CACHE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

const useWeather = (defaultCity: string = 'London') => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnitState] = useState<Unit>(() => {
    return (localStorage.getItem('weather-unit') as Unit) || 'metric';
  });
  const [cache, setCache] = useState<WeatherCache>({});

  useEffect(() => {
    localStorage.setItem('weather-unit', unit);
  }, [unit]);

  const setUnit = (newUnit: Unit) => {
    setUnitState(newUnit);
  };
  
  const fetchWeatherData = useCallback(async (city?: string, lat?: number, lon?: number) => {
    setLoading(true);
    setError(null);

    const cacheKey = city ? `${city.toLowerCase()}-${unit}` : `${lat},${lon}-${unit}`;
    
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_EXPIRATION_MS) {
        setWeather(cache[cacheKey].weather);
        setForecast(cache[cacheKey].forecast);
        setLoading(false);
        return;
    }

    try {
      const [weatherData, forecastData] = await Promise.all([
        getCurrentWeather(city, lat, lon, unit),
        getForecast(city, lat, lon, unit),
      ]);

      setWeather(weatherData);
      setForecast(forecastData);

      setCache(prevCache => ({
        ...prevCache,
        [cacheKey]: {
          weather: weatherData,
          forecast: forecastData,
          timestamp: Date.now()
        }
      }));

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, [unit, cache]);

  const fetchWeatherByCity = (city: string) => {
    fetchWeatherData(city);
  };

  const fetchWeatherByCoords = (lat: number, lon: number) => {
    fetchWeatherData(undefined, lat, lon);
  };

  const searchCitiesByQuery = async (query: string) => {
    if (query.length > 2) {
      try {
        const cityData = await searchCities(query);
        setCities(cityData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred while searching for cities.');
        }
      }
    } else {
      setCities([]);
    }
  };

  const clearCities = () => {
    setCities([]);
  };
  
  useEffect(() => {
    if (weather) {
      fetchWeatherByCoords(weather.coord.lat, weather.coord.lon);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  return { weather, forecast, loading, error, unit, setUnit, fetchWeatherByCity, fetchWeatherByCoords, cities, searchCitiesByQuery, clearCities };
};

export default useWeather;
