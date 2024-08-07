import { fetchCountryBoundaries } from "../services/countryService.js";
import { getPolygonFromGeometry } from "../utils/geometryUtils.js";
import { point, booleanPointInPolygon } from "@turf/turf";

export const checkLocation = async (req, res) => {
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
};
