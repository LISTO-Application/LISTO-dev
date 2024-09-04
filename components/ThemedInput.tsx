//USED FOR INPUTS WITH DIFFERENT STYLES

import { TextInput, type TextInputProps, StyleSheet } from "react-native";

export type ThemedInputProps = TextInputProps & {
    type?: 'outline' |'solid' ;
    
  };
  
  export function ThemedInput({
    style,
    type = 'outline',
    placeholderTextColor = "#BBB",
    ...rest
  }: ThemedInputProps) {
  
    // The component that is returned
    return (
      <TextInput
        style={[
          type === 'outline' ? styles.default : undefined,
          type === 'outline' ? styles.outline : undefined,
          type === 'solid' ? styles.solid : undefined,
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
        height: 48,
        backgroundColor: 'transparent',
        borderColor: '#FFF',
        borderWidth: 3,
        borderRadius: 50,
        marginTop: '5%',
        marginBottom: '5%',
        paddingLeft: 20,
        color: '#FFF',
        fontWeight: 'bold',
        
    },
  
    outline: {
        height: 48,
        backgroundColor: 'transparent',
        borderColor: '#FFF',
        borderWidth: 3,
        borderRadius: 50,
        marginTop: '5%',
        marginBottom: '5%',
        paddingLeft: 20,
        color: '#FFF',
        fontWeight: 'bold',
    },
  
    solid: {
        height: 48,
        backgroundColor: '#FFF',
        borderWidth: 3,
        borderColor: '#FFF',
        borderRadius: 50,
        marginTop: '5%',
        marginBottom: '5%',
        paddingLeft: 20,
        fontWeight: 'bold',

    },

  });
  