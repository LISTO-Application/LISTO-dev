import { FeatureCollection, Point } from "geojson";
export type EarthquakeProps = {
  id: string;
  mag: number;
  time: number;
  felt: number | null;
  tsunami: 0 | 1;
};

export type EarthquakesGeojson = FeatureCollection<Point, EarthquakeProps>;

export async function loadEarthquakeGeojson(): Promise<EarthquakesGeojson> {
  const earthquakesGeojson = require("../earthquakes.json");

  return earthquakesGeojson;
}
