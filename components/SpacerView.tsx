//USED FOR SPACING BETWEEN COMPONENTS OR COMBINING MULTIPLE COMPONENTS IN A SINGLE ROW OR COLUMN

import { View, type ViewProps, StyleSheet, DimensionValue } from 'react-native';

export type SpacerViewProps = ViewProps & {
  height?: DimensionValue;
  flexDirection?: 'row' | 'column';
  marginVertical?: number;
  marginHorizontal?: number;
  marginLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
};

export function SpacerView({
  style,
  height = '10%',
  flexDirection = 'row',
  marginVertical = 0,
  marginHorizontal = 0,
  marginLeft = 0,
  marginTop = 0,
  marginRight = 0,
  marginBottom = 0,
  justifyContent = 'flex-start',
  ...rest
}: SpacerViewProps) {

      // The component that is returned
  return (
    <View
      style={[
        { height },
        {flexDirection},
        {marginVertical},
        {marginHorizontal},
        {marginLeft},
        {marginTop},
        {marginRight},
        {marginBottom},
        {justifyContent},
        style,
      ]}
      {...rest}
    />
  );
}
