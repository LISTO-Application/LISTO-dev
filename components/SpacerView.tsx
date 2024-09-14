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
  textAlign?: 'center' | 'left' | 'right';
  backgroundColor?: string;
  borderBottomWidth: number;
  borderBottomColor: string;
  opacity: number;
  padding: number;
  paddingTop : number;
  paddingLeft : number;
  paddingBottom : number;
  paddingRight : number;
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
  backgroundColor,
  borderBottomWidth,
  borderBottomColor,
  opacity,
  padding,
  paddingTop,
  paddingLeft,
  paddingBottom,
  paddingRight,
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
        {backgroundColor},
        {borderBottomWidth},
        {borderBottomColor},
        {opacity},
        {padding},
        {paddingTop},
        {paddingLeft},
        {paddingBottom},
        {paddingRight},
        style,
      ]}
      {...rest}
    />
  );
}
