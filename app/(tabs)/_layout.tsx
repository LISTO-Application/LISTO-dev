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
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { TabBar } from "@/components/navigation/TabBar";
import { ThemedText } from "@/components/ThemedText";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

//Hooks
import { useColorScheme } from "@/hooks/useColorScheme";
import Emergency from "./emergency";
import CrimeMap from "./crimemap";
import UserAccount from "./[id]";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ViewReports from "../(drawer)/ViewReports";
import ValidateReports from "../(drawer)/validateReports";
import viewAdminEmergencyList from "../(drawer)/viewAdminEmergencyList";
import Login from "..";
import { AuthContext, AuthProvider } from "../AuthContext";
import MyHeader from "../(drawer)/MyHeader";
import UserBanner from "../(drawer)/UserBanner";
import DrawerScreenOptions from "../(drawer)/DrawerScreenOptions";
import RootReports from "../(drawer)/RootReports";
import ChangeUserAccount from "../changeUserInformation";

const report = require("../../assets/images/report-icon.png");

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const Drawer = createDrawerNavigator();

  if (Platform.OS === "web") {
    return (
      <AuthProvider>
        <NavigationContainer independent={true}>
          <Drawer.Navigator
            initialRouteName="Report Incident"
            screenOptions={({ route, navigation }) =>
              DrawerScreenOptions({ route, navigation })
            }
            drawerContent={(props) => {
              return <UserBanner {...props} />;
            }}
          >
            <Drawer.Screen name="Emergency" component={Emergency} />
            <Drawer.Screen name="Report Incident" component={CrimeMap} />
            <Drawer.Screen name="Account" component={UserAccount} />
            <Drawer.Screen name="Change Account" component={ChangeUserAccount} /> 
            <Drawer.Screen name="ADMIN View Emergency Messeges" component={viewAdminEmergencyList} /> 
            <Drawer.Screen
              name="Reports"
              component={RootReports} 
              options={{
                title: "View Reports",
              }}
            />
            <Drawer.Screen
              name="Validate"
              component={ValidateReports}
              options={{
                title: "Validate Reports",
              }}
            />
          </Drawer.Navigator>
        </NavigationContainer>
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
