import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {

    const phone = require('../../assets/images/phone-icon.png');
    const report = require('../../assets/images/report-icon.png');
    const person = require('../../assets/images/person-icon.png');

    const icons = {
        emergency : (props : any) => <Image width={35} height = 'auto' source={phone} {...props}/>,
        index: (props: any) => <Image width= {35} height = 'auto' source={report} {...props}/>,
        account: (props: any) => <Image width={35} height = 'auto' source={person} {...props}/>
    }

    return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: any) => {
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
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={[
              route.name !== 'index' && styles.tabBarItem,
              route.name === 'index' && styles.tabBarMidItem,
            ]}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >

              {
                icons[route.name]({})
              }
              
              {route.name !== 'index' && (
                <Text style={{ color: isFocused ? '#673ab7' : '#222', fontWeight: 'bold' }}>
                  {label}
                </Text>
              )}

          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: '5%',
    },
    tabBarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    tabBarMidItem: {
        position: 'absolute',
        top: -30,
    }
})