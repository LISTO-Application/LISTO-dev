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

import UserBanner from "../(drawer)/UserBanner";
import DrawerScreenOptions from "../(drawer)/DrawerScreenOptions";
import RootReports from "../(drawer)/RootReports";
import Index from ".";

const report = require("../../assets/images/report-icon.png");

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const Drawer = createDrawerNavigator();

  if (Platform.OS === "web") {
    return (
      <AuthProvider>
        <Drawer.Navigator
          initialRouteName="Account"
          screenOptions={({ route, navigation }) =>
            DrawerScreenOptions({ route, navigation })
          }
          drawerContent={(props) => {
            return <UserBanner {...props} />;
          }}
        >
          <Drawer.Screen
            name="Crimemap"
            component={CrimeMap}
            options={{ title: "Report Incident" }}
          />
          <Drawer.Screen
            name="Account"
            component={UserAccount}
            options={{ title: "Account" }}
          />
          <Drawer.Screen
            name="Reports"
            component={RootReports}
            options={{
              title: "View Reports",
            }}
          />
        </Drawer.Navigator>
      </AuthProvider>
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
