//React Imports
import React from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";

//Expo Imports
import { useRouter, Tabs, useFocusEffect } from "expo-router";

//Component Imports
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { TabBar } from "@/components/navigation/TabBar";

import {
  createDrawerNavigator,
  DrawerItemList,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import { NavigationContainer, RouteProp } from "@react-navigation/native";

//Hooks
import { useColorScheme } from "@/hooks/useColorScheme";
import Emergency from "./emergency";
import CrimeMap from ".";
import UserAccount from "./[id]";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const report = require("../../assets/images/report-icon.png");

type DrawerParamList = {
  emergency: undefined;
  index: undefined;
  "[id]": undefined;
  Custom: undefined;
};

type CustomNavigatorProps = {
  navigation: DrawerNavigationProp<DrawerParamList>;
};

const MyHeader: React.FC<CustomNavigatorProps> = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        opacity: 0,
        justifyContent: "center",
        padding: 16,
      }}
    >
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <MaterialIcons name="menu" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isLoggedIn = true;
  const Drawer = createDrawerNavigator();

  if (isLoggedIn && Platform.OS === "web") {
    return (
      <NavigationContainer independent={true}>
        <Drawer.Navigator
          initialRouteName="index"
          screenOptions={({ navigation }) => ({
            headerShown: true,
            header: () => <MyHeader navigation={navigation} />,
            drawerStyle: {
              backgroundColor: "#f0f0f0", // Change drawer background color
              width: 600, // Change drawer width
            },
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#6200EE",
            },
          })}
          drawerContent={(props) => {
            return (
              <SafeAreaView>
                <View
                  style={{
                    height: 200,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottomColor: "#f4f4f4",
                    borderBottomWidth: 1,
                    backgroundColor: "blue",
                  }}
                >
                  Image
                </View>
                <DrawerItemList {...props} />
              </SafeAreaView>
            );
          }}
        >
          <Drawer.Screen
            name="Emergency"
            options={{ drawerLabel: "Emergency", title: "Emergency " }}
            component={Emergency}
          />
          <Drawer.Screen name="Report Incident" component={CrimeMap} />
          <Drawer.Screen name="[i d]" component={UserAccount} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  } else if (isLoggedIn && Platform.OS === "android") {
    return (
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen
          name="emergency"
          options={{
            tabBarShowLabel: false,
            title: "Emergency",
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            tabBarShowLabel: false,
            title: "Crime Map",
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            tabBarShowLabel: false,
            title: "Report",
          }}
        />

        <Tabs.Screen
          name="[id]"
          options={{
            tabBarShowLabel: false,
            title: "Account",
          }}
        />
      </Tabs>
    );
  } else {
    console.log("User is not logged in");
    router.replace({
      pathname: "/",
    });
  }
}
