import { View, Text, TouchableOpacity, StyleSheet, Image, Keyboard, useWindowDimensions} from "react-native";
import { useEffect, useState } from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const phone = require("../../assets/images/phone-icon.png");
  const report = require("../../assets/images/report-icon.png");
  const person = require("../../assets/images/person-icon.png");
  const map = require("../../assets/images/map-icon.png");

  const { width, height } = useWindowDimensions();
  
  let fontSize : number;
  if (width > 360) {
    fontSize = 16;
  } else if (width <= 360) {
    fontSize = 10;
  }

  const [visible, setVisible] = useState(true);

  useEffect(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
          //Whenever keyboard did show make it don't visible
          setVisible(false);
      });
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
          setVisible(true);
      });

      return () => {
          showSubscription.remove();
          hideSubscription.remove();
      };
  }, []);

  const icons = {
    adminEmergency: (props: any) => (
      <Image style={{ width: 36, height: 36 }} source={phone} {...props} />
    ),
    adminReport: (props: any) => (
      <Image style={{ width: 36, height: 36 }} source={report} {...props} />
    ),
    index: (props: any) => (
      <Image style={{ width: 36, height: 36 }} source={map} {...props} />
    ),
    account: (props: any) => (
      <Image style={{ width: 36, height: 36 }} source={person} {...props} />
    ),
  };

  if (visible) {
    return (
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: any) => {

          if(route.name === "adminSummary") {
            return null;
          }
          
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;
  
          const isFocused = state.index === index;
  
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
  
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
  
          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };
  
          return (
            <TouchableOpacity
              key={route.name}
              style={[styles.tabBarItem]}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
            >
              {icons[route.name as keyof typeof icons]({}) as React.JSX.Element}
  
              <Text
                style={{
                  opacity: isFocused ? 1 : 0.5,
                  fontSize: fontSize,
                  fontWeight: "bold",
                  marginTop: "2.5%",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "10%",
    backgroundColor: "#FFF",
    borderTopWidth: 2,
    borderTopColor: "#115272",
  },
  tabBarItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});
