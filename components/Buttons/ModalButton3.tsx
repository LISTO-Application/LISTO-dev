//USED FOR BUTTONS WITH DIFFERENT STYLES

import { Pressable, Text, type PressableProps, StyleSheet } from "react-native";

export type ModalButtonProps = PressableProps & {
  title?: string;
  onPress?: () => void;
};

export function ModalButton3({ title, onPress, ...rest }: ModalButtonProps) {
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
    width: "50%",
    height: 50,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "115272",
    margin: 1,
  },

  text: {
    color: "#115272",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
