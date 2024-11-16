import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ViewReports from "./viewReports";
import newReports from "./newReports";
import EditReport from "./EditReport";
import ReportDetails from "./reportDetails";

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
      <Stack.Screen
        name="EditReports"
        component={EditReport}
        options={{ headerShown: false, title: "Edit Reports" }}
      />
      <Stack.Screen
        name="ReportDetails"
        component={ReportDetails}
        options={{ headerShown: false, title: "Report Details" }}
      />
    </Stack.Navigator>
  );
};

export default RootReports;

const styles = StyleSheet.create({});
