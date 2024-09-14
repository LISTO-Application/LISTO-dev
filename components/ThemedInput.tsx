//USED FOR INPUTS WITH DIFFERENT STYLES

import { TextInput, type TextInputProps, StyleSheet } from "react-native";

export type ThemedInputProps = TextInputProps & {
    type?: 'outline' |'solid' ;
    height?: number;
    borderRadius?: number;
    textAlign: 'center' | 'left' | 'right';
    textAlignVertical: 'center' | 'top' | 'bottom';
    padding: number;

    
  };
  
  export function ThemedInput({
    style,
    type = 'outline',
    height = 48,
    borderRadius = 50,
    placeholderTextColor = "#BBB",
    textAlign,
    textAlignVertical,
    padding = 10,
    ...rest
  }: ThemedInputProps) {
  
    // The component that is returned
    return (
      <TextInput
        style={[
          type === 'outline' ? styles.default : undefined,
          type === 'outline' ? styles.outline : undefined,
          type === 'solid' ? styles.solid : undefined,
          {height},
          {borderRadius},
          {textAlign},
          {textAlignVertical},
          {padding},
          style,
        ]}
        placeholderTextColor={placeholderTextColor}
        cursorColor={'#FFF'}
        {...rest}
      />
    );
  }
  
  const styles = StyleSheet.create({
    default: {
        backgroundColor: 'transparent',
        borderColor: '#FFF',
        borderWidth: 3,
        marginTop: '5%',
        marginBottom: '5%',
        paddingLeft: 20,
        color: '#FFF',
        fontWeight: 'bold',
        
    },
  
    outline: {
        backgroundColor: 'transparent',
        borderColor: '#FFF',
        borderWidth: 3,
        marginTop: '5%',
        marginBottom: '5%',
        paddingLeft: 20,
        color: '#FFF',
        fontWeight: 'bold',
    },
  
    solid: {
        backgroundColor: '#FFF',
        borderWidth: 3,
        borderColor: '#FFF',
        marginTop: '5%',
        marginBottom: '5%',
        paddingLeft: 20,
        fontWeight: 'bold',

    },

  });
  