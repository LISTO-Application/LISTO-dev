import { View, type ViewProps, StyleSheet } from "react-native";

export type ThemedContainerProps = ViewProps & {
  type?: "outline" | "solid";
};

export function ThemedContainer({
  style,
  type = "outline",
  ...rest
}: ThemedContainerProps) {
  // The component that is returned
  return (
    <View
      style={[
        type === "outline" ? styles.outline : undefined,
        type === "solid" ? styles.solid : undefined,
        styles.default, // Default applies to both types
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    width: 300,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  outline: {
    backgroundColor: "transparent",
    borderWidth: 0,
  },

  solid: {
    backgroundColor: "#FFF",
    borderWidth: 0,
  },
});
