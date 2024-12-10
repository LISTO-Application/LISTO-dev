//React Imports
import { Platform } from "react-native";

//Expo Imports
import {
  useRouter,
  Tabs,
  useFocusEffect,
  useNavigation,
  router,
} from "expo-router";
//Component Imports
import { TabBar } from "@/components/navigation/TabBar";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
//Hooks
import { useColorScheme } from "@/hooks/useColorScheme";
import CrimeMap from "./crimemap";
import UserAccount from "./account";
import { AuthContext, AuthProvider } from "../AuthContext";

import UserBanner from "../../components/navigation/UserBanner";
import DrawerScreenOptions from "../../components/navigation/DrawerScreenOptions";
import RootReports from "../(drawer)/RootReports";
import Index from "./crimemap";
import { Drawer } from "expo-router/drawer";
import ViewReports from "./(drawer)/viewReports";

const report = require("../../assets/images/report-icon.png");

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const navigation = useNavigation();

  if (Platform.OS === "web") {
    return (
      <Drawer
        initialRouteName="crimemap"
        screenOptions={({ route, navigation }) =>
          DrawerScreenOptions({ route, navigation })
        }
        drawerContent={(props) => {
          return <UserBanner {...props} />;
        }}
      >
        <Drawer.Screen name="crimemap" options={{ title: "Report Incident" }} />
        <Drawer.Screen name="account" options={{ title: "Account" }} />
        <Drawer.Screen
          name="(drawer)"
          options={{
            title: "View Reports",
          }}
        />
      </Drawer>
    );
  } else if (Platform.OS === "android") {
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
