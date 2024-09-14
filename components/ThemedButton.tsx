//USED FOR BUTTONS WITH DIFFERENT STYLES

import { Pressable, Text, type PressableProps, StyleSheet } from "react-native";

export type ThemedButtonProps = PressableProps & {
    title?: string;
    type?: 'default' | 'red' | 'white' | 'blue'
    width?: string | number;
    onPress?: () => void; 
  };
  
  export function ThemedButton({
    style,
    title,
    type = 'default',
    width = '100%',
    onPress,
    ...rest
  }: ThemedButtonProps) {
  
    return (
        <Pressable 
        style = {[
          styles.button,
          type === 'default' ? styles.default : undefined,
          type === 'red' ? styles.red : undefined,
          type === 'white' ? styles.white : undefined,
          type === 'blue' ? styles.blue : undefined,
          {width},
          style
        ]}
        {...rest}
        onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    );
  }
  
  const styles = StyleSheet.create({
    
    button: {
        borderRadius: 50,
        width: '100%',
        justifyContent: 'center',

    },
    
    text: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },

    red: {
        backgroundColor: '#DA4B46',
    },

    white: {
        backgroundColor: '#FFF',
    },

    blue: {
        backgroundColor: '#115272',
    },

  });
  