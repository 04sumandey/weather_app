import { API_BASE_URL, GEO_API_BASE_URL } from '../constants';
import { WeatherData, ForecastData, Unit, City } from '../types';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const buildUrl = (endpoint: string, city?: string, lat?: number, lon?: number, unit: Unit = 'metric') => {
    const params = new URLSearchParams({
        units: unit,
    });

    if (city) {
        params.append('city', city);
    } else if (lat !== undefined && lon !== undefined) {
        params.append('lat', lat.toString());
        params.append('lon', lon.toString());
    }
    
    return `/.netlify/functions/${endpoint}?${params.toString()}`;
}

export const searchCities = async (query: string): Promise<City[]> => {
    const response = await fetch(`/.netlify/functions/cities?query=${query}`);
    return handleResponse(response);
};

export const getCurrentWeather = async (city?: string, lat?: number, lon?: number, unit: Unit = 'metric'): Promise<WeatherData> => {
  const url = buildUrl('weather', city, lat, lon, unit);
  const response = await fetch(url);
  return handleResponse(response);
};

export const getForecast = async (city?: string, lat?: number, lon?: number, unit: Unit = 'metric'): Promise<ForecastData> => {
  const params = new URLSearchParams({
    units: unit,
    forecast: "true",
  });

  if (city) {
    params.append('city', city);
  } else if (lat !== undefined && lon !== undefined) {
    params.append('lat', lat.toString());
    params.append('lon', lon.toString());
  }

  const url = `/.netlify/functions/weather?${params.toString()}`;
  const response = await fetch(url);
  return handleResponse(response);
};
