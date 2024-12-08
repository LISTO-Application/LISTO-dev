//React Imports
import { Platform, Text, } from "react-native";

//Expo Imports
import {
  Tabs,
} from "expo-router";
//Component Imports
import { TabBar } from "@/components/navigation/TabBar";
//Hooks
import CrimeMap from "./";
import UserAccount from ".";
import { firebase } from "@react-native-firebase/firestore";

const report = require("../../assets/images/report-icon.png");

export default function TabLayout() {

  const session = firebase.auth().currentUser;

  if (Platform.OS === "android") {

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
