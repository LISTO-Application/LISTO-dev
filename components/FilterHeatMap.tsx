import { Pressable, StyleSheet, Text, View, Image } from "react-native";

import React from "react";

const FilterHeatMap = ({ heatmap }: { heatmap: any }) => {
  return (
    <Pressable
      style={{
        position: "absolute",
        top: 180,
        right: 20,
      }}
      onPress={() => {}}
    >
      <Image
        style={{
          width: 50,
          height: 50,
        }}
        source={heatmap}
      />
    </Pressable>
  );
};

export default FilterHeatMap;

const styles = StyleSheet.create({});
