import { RequestHandler } from "express";

interface RoutingQuery {
  start_lat: string;
  start_lng: string;
  end_lat: string;
  end_lng: string;
}

export const handleGeoapifyRouting: RequestHandler = async (req, res) => {
  try {
    const { start_lat, start_lng, end_lat, end_lng } =
      req.query as RoutingQuery;

    // Validate required parameters
    if (!start_lat || !start_lng || !end_lat || !end_lng) {
      return res.status(400).json({
        error:
          "Missing required parameters: start_lat, start_lng, end_lat, end_lng",
      });
    }

    // Validate coordinates are valid numbers
    const startLat = parseFloat(start_lat);
    const startLng = parseFloat(start_lng);
    const endLat = parseFloat(end_lat);
    const endLng = parseFloat(end_lng);

    if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) {
      return res.status(400).json({
        error: "Invalid coordinates provided",
      });
    }

    // Use the Geoapify API key
    const API_KEY = "9b9e7b2848814e95a77d475c086aad2c";

    // Build the Geoapify routing URL
    const geoapifyUrl = `https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLng}|${endLat},${endLng}&mode=drive&apiKey=${API_KEY}`;

    console.log("Fetching route from:", geoapifyUrl);

    // Make the request to Geoapify
    const response = await fetch(geoapifyUrl);

    if (!response.ok) {
      console.error(
        "Geoapify API error:",
        response.status,
        response.statusText,
      );
      return res.status(response.status).json({
        error: "Failed to fetch route from Geoapify API",
        status: response.status,
        statusText: response.statusText,
      });
    }

    const data = await response.json();

    // Return the routing data
    res.json(data);
  } catch (error) {
    console.error("Error in geoapify routing:", error);
    res.status(500).json({
      error: "Internal server error while fetching route",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
