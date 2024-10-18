import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ViewReports from "./viewReports";
import newReports from "./newReports";

const RootReports = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ViewReports"
        component={ViewReports}
        options={{ headerShown: false, title: "View Reports" }}
      />
      <Stack.Screen
        name="NewReports"
        component={newReports}
        options={{ headerShown: false, title: "Create Reports" }}
      />
    </Stack.Navigator>
  );
};

export default RootReports;

const styles = StyleSheet.create({});
