//USED FOR INPUTS WITH DIFFERENT STYLES

import { ImageBackground, type ImageBackgroundProps, StyleSheet } from "react-native";

export type ThemedImageBackgroundProps = ImageBackgroundProps & {
    justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    
  };
  
  export function ThemedImageBackground({
    style,
    justifyContent,
    ...rest
  }: ThemedImageBackgroundProps) {
  
    // The component that is returned
    return (
      <ImageBackground
        style={[
            { justifyContent },
          style,
        ]}
        {...rest}
      />
    );
  }
  