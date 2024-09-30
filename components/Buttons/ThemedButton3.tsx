//USED FOR BUTTONS WITH DIFFERENT STYLES

import { Pressable, Text, type PressableProps, StyleSheet } from "react-native";

export type ThemedButtonProps = PressableProps & {
  title?: string;
  onPress?: () => void;
};

export function ThemedButton3({ title, onPress, ...rest }: ThemedButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#fff",
    borderRadius: 50,
    width: "100%",
    justifyContent: "center",
    borderWidth: 2,
  },

  text: {
    color: "#115272",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
