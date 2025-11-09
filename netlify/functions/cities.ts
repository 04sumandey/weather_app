import type { Context } from "@netlify/functions";

const API_KEY = process.env.VITE_OPENWEATHER_API_KEY;
const GEO_API_BASE_URL = "http://api.openweathermap.org/geo/1.0";

const jsonResponse = (statusCode: number, body: any) => {
  console.log("Returning response:", statusCode, JSON.stringify(body, null, 2));
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
};

export default async (req: Request, context: Context) => {
  console.log("--- New request to /functions/cities ---");
  console.log("Request URL:", req.url);

  const url = new URL(req.url);
  const query = url.searchParams.get("query");

  if (!API_KEY) {
    console.error("API key is not configured.");
    return jsonResponse(500, { message: "API key is not configured" });
  } else {
    console.log("API Key found.");
  }

  if (!query) {
    console.error("Query is required.");
    return jsonResponse(400, { message: "Query is required" });
  }

  const apiUrl = `${GEO_API_BASE_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`;
  console.log("Fetching from OpenWeatherMap Geo API:", apiUrl);

  try {
    const response = await fetch(apiUrl);
    console.log("OpenWeatherMap response status:", response.status);
    const data = await response.json();
    console.log("OpenWeatherMap response data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("OpenWeatherMap Geo API returned an error.");
      return jsonResponse(response.status, data);
    }

    console.log("Successfully fetched data.");
    return jsonResponse(200, data);
  } catch (error) {
    console.error("Caught error while fetching from OpenWeatherMap:", error);
    return jsonResponse(500, { message: "Error fetching city data" });
  }
};