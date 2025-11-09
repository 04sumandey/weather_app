import { WeatherData, ForecastData, Unit, City } from '../types';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const buildUrl = (type: 'weather' | 'forecast' | 'cities', params: Record<string, string | number | undefined>) => {
    const searchParams = new URLSearchParams({ type });
    for (const key in params) {
        if (params[key] !== undefined) {
            searchParams.append(key, String(params[key]));
        }
    }
    return `/.netlify/functions/weather?${searchParams.toString()}`;
}

export const searchCities = async (query: string): Promise<City[]> => {
    const url = buildUrl('cities', { query });
    const response = await fetch(url);
    return handleResponse(response);
};

export const getCurrentWeather = async (city?: string, lat?: number, lon?: number, unit: Unit = 'metric'): Promise<WeatherData> => {
  const url = buildUrl('weather', { city, lat, lon, units: unit });
  const response = await fetch(url);
  return handleResponse(response);
};

export const getForecast = async (city?: string, lat?: number, lon?: number, unit: Unit = 'metric'): Promise<ForecastData> => {
  // The serverless function expects lat/lon for forecast to avoid an extra geocoding step on the backend.
  if (lat === undefined || lon === undefined) {
    throw new Error("Latitude and longitude are required for forecast.");
  }
  const url = buildUrl('forecast', { city, lat, lon, units: unit });
  const response = await fetch(url);
  return handleResponse(response);
};
