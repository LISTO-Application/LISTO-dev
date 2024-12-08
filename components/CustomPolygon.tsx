import React, { useRef } from 'react';
import { Polygon } from 'react-native-maps';

interface CustomPolygonProps {
  onLayout?: () => void;
  fillColor?: string;
  [key: string]: any; // Allows additional props to be passed to Polygon
}

const CustomPolygon: React.FC<CustomPolygonProps> = ({ onLayout, ...props }) => {
  const ref = useRef<any>();

  function onLayoutPolygon() {
    if (ref.current) {
      ref.current.setNativeProps({ fillColor: props.fillColor });
    }
    // Call onLayout() from the props if needed
    if (onLayout) {
      onLayout();
    }
  }

  return <Polygon coordinates={[]} ref={ref} onLayout={onLayoutPolygon} {...props} />;
};

export default CustomPolygon;