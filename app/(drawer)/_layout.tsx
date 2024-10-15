// //React Imports
// import React from "react";
// import { Platform, View } from "react-native";

// //Expo Imports
// import { useRouter, Tabs, useFocusEffect } from "expo-router";

// //Component Imports
// import { TabBarIcon } from "@/components/navigation/TabBarIcon";
// import { TabBar } from "@/components/navigation/TabBar";

// //Hooks
// import { useColorScheme } from "@/hooks/useColorScheme";

// const report = require("../../assets/images/report-icon.png");

// export default function DrawerLayout() {
//   const colorScheme = useColorScheme();
//   const router = useRouter();
//   const isLoggedIn = true;

//   if (isLoggedIn && Platform.OS === "web") {
//     return (
//       <Tabs
//         initialRouteName="emergency"
//         screenOptions={{
//           headerShown: false,
//         }}
//         tabBar={(props) => <TabBar {...props} />}
//       >
//         <Tabs.Screen
//           name="emergency"
//           options={{
//             tabBarShowLabel: false,
//             title: "Emergency",
//           }}
//         />

//         <Tabs.Screen
//           name="index"
//           options={{
//             tabBarShowLabel: false,
//             title: "Crime Map",
//           }}
//         />

//         <Tabs.Screen
//           name="[id]"
//           options={{
//             tabBarShowLabel: false,
//             title: "Account",
//           }}
//         />
//       </Tabs>
//     );
//   } else {
//     console.log("User is not logged in");
//     router.replace({
//       pathname: "/",
//     });
//   }
// }
