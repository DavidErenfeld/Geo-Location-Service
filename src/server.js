import express from "express";
import cors from "cors"; // הוסף ייבוא למודול cors
import { readFile } from "fs/promises";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // הוסף את השימוש ב-cors
app.use(express.json());

const fetchCountryBoundaries = async () => {
  const data = await readFile("./src/geojson/countries.geo.json", "utf8");
  return JSON.parse(data);
};

const getPolygonFromGeometry = (geometry) => {
  let coordinates = [];

  if (geometry.type === "Polygon") {
    coordinates = geometry.coordinates;
  } else if (geometry.type === "MultiPolygon") {
    coordinates = geometry.coordinates.flat();
  } else {
    console.error(`Unsupported geometry type: ${geometry.type}`);
    return null;
  }

  const fixedCoordinates = fixCoordinates(coordinates);
  return polygon(fixedCoordinates);
};

const fixCoordinates = (coordinates) => {
  return coordinates
    .map((ring) => {
      if (ring.length < 4) {
        console.error(`Invalid ring with less than 4 points`);
        return []; // Skip invalid ring
      }
      const firstPoint = ring[0];
      const lastPoint = ring[ring.length - 1];
      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        console.log(`Closing ring`);
        ring.push(firstPoint); // Close the ring by adding the first point at the end
      }
      return ring;
    })
    .filter((ring) => ring.length > 0); // Remove invalid rings
};

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/check-location", async (req, res) => {
  try {
    const { latitude, longitude, countryCode } = req.body;
    const countryData = await fetchCountryBoundaries();
    const countryFeatures = countryData.features;
    const countryFeature = countryFeatures.find(
      (feature) => feature.id === countryCode
    );

    if (!countryFeature) {
      return res.status(404).json({ error: "Country not found" });
    }

    const geometry = countryFeature.geometry;
    const poly = getPolygonFromGeometry(geometry);
    const pt = point([longitude, latitude]);
    const inside = booleanPointInPolygon(pt, poly);

    res.json({ inside });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
