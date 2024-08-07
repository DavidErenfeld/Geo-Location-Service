import { polygon } from "@turf/turf";

export const getPolygonFromGeometry = (geometry) => {
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
