//React Imports
import { Platform, Text, } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

//Expo Imports
import {
  Tabs,
} from "expo-router";

//JWT Imports
// import "core-js/stable/atob";
// import { jwtDecode } from "jwt-decode";

//Component Imports
import { TabBar } from "@/components/navigation/TabBar";

//Hooks
import { useColorScheme } from "@/hooks/useColorScheme";
import Emergency from "./emergency";
import CrimeMap from ".";
import UserAccount from "./account";
import ValidateReports from "../(drawer)/validateReports";
import UserBanner from "../(drawer)/UserBanner";
import DrawerScreenOptions from "../(drawer)/DrawerScreenOptions";
import RootReports from "../(drawer)/RootReports";
import ChangeUserAccount from "../changeUserInformation";
import { firebase } from "@react-native-firebase/firestore";

const report = require("../../assets/images/report-icon.png");

export default function TabLayout() {

  const session = firebase.auth().currentUser;
  const Drawer = createDrawerNavigator();

  if (Platform.OS === "web") {
    return (
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
            <Drawer.Screen name="ChangeAccount" component={ChangeUserAccount} />
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
    );
  } else if (Platform.OS === "android") {

    if(session == null) {
      return <Tabs tabBar={(props) => null}/>
    }
    
    return (
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen
          name="emergency"
          options={{
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            title: "Emergency",
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            title: "Crime Map",
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            title: "Report",
          }}
        />

        <Tabs.Screen
          name="account"
          options={{
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            title: "Account",
          }}
        />
      </Tabs>
    );
  }
} 
