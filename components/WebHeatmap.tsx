import React from "react";
import { useEffect, useMemo } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { FeatureCollection, Point, GeoJsonProperties } from "geojson";
import { MarkersCollection } from "@/constants/markers";

type HeatmapProps = {
  geojson: MarkersCollection;
  radius: number;
  opacity: number;
};

type HeatmapData = {
  location: google.maps.LatLng | null;
  weight: number;
};

const WebHeatmap = ({ geojson, radius, opacity }: HeatmapProps) => {
  const map = useMap();
  const visualization = useMapsLibrary("visualization");

  const heatmap = useMemo(() => {
    if (!visualization || !map) {
      console.warn("Google Maps visualization or map is not ready.");
      return null;
    }
    console.log("Heatmap layer created.");
    return new google.maps.visualization.HeatmapLayer({
      radius: radius * 2,
      opacity: opacity,
      map: map,
    });
  }, [visualization, radius, opacity]);

  useEffect(() => {
    if (!heatmap) {
      console.warn("Heatmap layer is not initialized.");
      return;
    }
    if (!geojson || geojson.length === 0) {
      console.warn("GeoJSON data is empty or invalid.");
      return;
    }
    console.log("Setting heatmap data...");
    const heatmapData: HeatmapData[] = geojson
      .map((point) => {
        const [lng, lat] = point.coordinate.split(",").map(Number);

        if (isNaN(lng) || isNaN(lat)) {
          console.warn(`Invalid coordinates found: ${point.coordinate}`);
          return null;
        }

        const location = new google.maps.LatLng(lat, lng);
        return location ? { location, weight: point.weight * 10 } : null;
      })
      .filter(
        (item): item is google.maps.visualization.WeightedLocation =>
          item !== null
      );

    if (heatmapData.length === 0) {
      console.warn("No valid heatmap data to set.");
      return;
    } else {
      heatmap.setData(heatmapData);
      console.log(`Heatmap data set with ${heatmapData.length} points.`);
    }
  }, [heatmap, geojson]);
  console.log(heatmap);
  useEffect(() => {
    if (!heatmap) return;
    heatmap.setMap(map);
    console.log("Heatmap layer added to the map.");
  }, [heatmap, map]);
  return null;
};

export default WebHeatmap;
