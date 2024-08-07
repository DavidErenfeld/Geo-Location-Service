import { readFile } from "fs/promises";

export const fetchCountryBoundaries = async () => {
  const data = await readFile("./src/geojson/countries.geo.json", "utf8");
  return JSON.parse(data);
};
