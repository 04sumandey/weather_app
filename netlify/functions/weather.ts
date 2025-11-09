import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const API_KEY = process.env.VITE_OPENWEATHER_API_KEY;
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_API_BASE_URL = "http://api.openweathermap.org/geo/1.0";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { type, city, lat, lon, units, query } = event.queryStringParameters;

  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is not configured." }),
    };
  }

  let apiUrl = "";
  const unitParam = units || 'metric';

  try {
    switch (type) {
      case 'weather':
        if (city) {
          apiUrl = `${API_BASE_URL}/weather?q=${city}&units=${unitParam}&appid=${API_KEY}`;
        } else if (lat && lon) {
          apiUrl = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unitParam}&appid=${API_KEY}`;
        } else {
          throw new Error("Invalid parameters for 'weather' type.");
        }
        break;
      
      case 'forecast':
        if (lat && lon) {
          apiUrl = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unitParam}&appid=${API_KEY}`;
        } else if (city) {
            // We need to get lat/lon from city first for forecast, but the current client implementation provides it.
            // This branch is a fallback. For simplicity, we'll stick to the client's lat/lon provision.
            // A more robust solution would geocode 'city' here if lat/lon are missing.
            throw new Error("Forecast requires latitude and longitude.");
        } else {
            throw new Error("Invalid parameters for 'forecast' type.");
        }
        break;

      case 'cities':
        if (query) {
          apiUrl = `${GEO_API_BASE_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`;
        } else {
          throw new Error("Invalid parameters for 'cities' type.");
        }
        break;

      default:
        throw new Error("Invalid request type.");
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorData.message || "Failed to fetch data from OpenWeather API." }),
      };
    }
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export { handler };