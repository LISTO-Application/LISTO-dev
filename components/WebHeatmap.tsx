import React from "react";
import { Heatmap } from "react-native-maps";

const WebHeatmap = ({ heatmap }: { heatmap: any }) => {
  return (
    <>
      {heatmap.map((point: any, index: any) => (
        <Heatmap
          key={index}
          points={[
            {
              latitude: point.latitude,
              longitude: point.longitude,
              weight: point.weight,
            },
          ]}
        />
      ))}
    </>
  );
};

export default WebHeatmap;
