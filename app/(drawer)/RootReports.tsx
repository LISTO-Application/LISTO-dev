import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ViewReports from "./viewReports";
import newReports from "./newReports";
import editReport from "./editReport";
import ReportDetails from "./reportDetails";
import ViewAdminEmergencyList from "./ViewAdminEmergencyList";
import ValidateReports from "./validateReports";
import NewAdminReports from "./newAdminReports";

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
        component={editReport}
        options={{ headerShown: false, title: "Edit Reports" }}
      />
      <Stack.Screen
        name="ReportDetails"
        component={ReportDetails}
        options={{ headerShown: false, title: "Report Details" }}
      />
      <Stack.Screen
        name="Validate"
        component={ValidateReports}
        options={{
          headerShown: false,
          title: "Validate Reports",
        }}
      />
      <Stack.Screen
        name="ViewAdminEmergencyList"
        component={ViewAdminEmergencyList}
        options={{ headerShown: false, title: "Admin View Emergency Report" }}
      />
      <Stack.Screen
        name="newAdminReports"
        component={NewAdminReports}
        options={{ headerShown: false, title: "New Admin Reports" }}
      />
    </Stack.Navigator>
  );
};

export default RootReports;

const styles = StyleSheet.create({});
