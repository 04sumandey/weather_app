import type { Context } from "@netlify/functions";

const API_KEY = process.env.VITE_OPENWEATHER_API_KEY;
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

const jsonResponse = (statusCode: number, body: any) => {
  console.log("Returning response:", statusCode, JSON.stringify(body, null, 2));
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
};

export default async (req: Request, context: Context) => {
  console.log("--- New request to /functions/weather ---");
  console.log("Request URL:", req.url);

  const url = new URL(req.url);
  const city = url.searchParams.get("city");
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const forecast = url.searchParams.get("forecast");

  if (!API_KEY) {
    console.error("API key is not configured.");
    return jsonResponse(500, { message: "API key is not configured" });
  } else {
    console.log("API Key found.");
  }

  let apiUrl = "";
  if (forecast === "true") {
    if (city) {
      apiUrl = `${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    } else if (lat && lon) {
      apiUrl = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
      console.error("City or coordinates are required for forecast.");
      return jsonResponse(400, { message: "City or coordinates are required for forecast" });
    }
  } else {
    if (city) {
      apiUrl = `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    } else if (lat && lon) {
      apiUrl = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
      console.error("City or coordinates are required.");
      return jsonResponse(400, { message: "City or coordinates are required" });
    }
  }

  console.log("Fetching from OpenWeatherMap API:", apiUrl);

  try {
    const response = await fetch(apiUrl);
    console.log("OpenWeatherMap response status:", response.status);
    const data = await response.json();
    console.log("OpenWeatherMap response data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("OpenWeatherMap API returned an error.");
      return jsonResponse(response.status, data);
    }
    
    console.log("Successfully fetched data.");
    return jsonResponse(200, data);
  } catch (error) {
    console.error("Caught error while fetching from OpenWeatherMap:", error);
    return jsonResponse(500, { message: "Error fetching weather data" });
  }
};