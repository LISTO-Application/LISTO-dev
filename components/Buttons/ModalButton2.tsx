//USED FOR BUTTONS WITH DIFFERENT STYLES

import { Pressable, Text, type PressableProps, StyleSheet } from "react-native";

export type ModalButtonProps = PressableProps & {
  title?: string;
  onPress?: () => void;
};

export function ModalButton2({ title, onPress, ...rest }: ModalButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#115272",
    borderRadius: 50,
    width: "50%",
    height: 50,
    justifyContent: "center",
    margin: 1,
  },

  text: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
