import { API_BASE_URL, GEO_API_BASE_URL } from '../constants';
import { WeatherData, ForecastData, Unit, City } from '../types';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const buildUrl = (endpoint: string, city?: string, lat?: number, lon?: number, unit: Unit = 'metric') => {
    if (!API_KEY) {
        console.log("VITE_OPENWEATHER_API_KEY : ", API_KEY)
        throw new Error("OpenWeatherMap API key is missing. Please add VITE_OPENWEATHER_API_KEY to your .env file.");
    }
    const params = new URLSearchParams({
        units: unit,
        appid: API_KEY,
    });

    if (city) {
        params.append('q', city);
    } else if (lat !== undefined && lon !== undefined) {
        params.append('lat', lat.toString());
        params.append('lon', lon.toString());
    }
    
    return `${API_BASE_URL}/${endpoint}?${params.toString()}`;
}

export const searchCities = async (query: string): Promise<City[]> => {
    if (!API_KEY) {
      throw new Error("OpenWeatherMap API key is missing.");
    }
    const response = await fetch(`${GEO_API_BASE_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`);
    return handleResponse(response);
};

export const getCurrentWeather = async (city?: string, lat?: number, lon?: number, unit: Unit = 'metric'): Promise<WeatherData> => {
  const url = buildUrl('weather', city, lat, lon, unit);
  const response = await fetch(url);
  return handleResponse(response);
};

export const getForecast = async (city?: string, lat?: number, lon?: number, unit: Unit = 'metric'): Promise<ForecastData> => {
  const url = buildUrl('forecast', city, lat, lon, unit);
  const response = await fetch(url);
  return handleResponse(response);
};
