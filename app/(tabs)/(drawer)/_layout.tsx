import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ViewReports from "./viewReports";
import newReports from "./newReports";
import EditReport from "../editReport";
import ReportDetails from "./reportDetails";
import ViewAdminEmergencyList from "./ViewAdminEmergencyList";
import ValidateReports from "./validateReports";
import NewAdminReports from "./newAdminReports";
import { Stack } from "expo-router";

const RootReports = () => {
  return (
    <Stack initialRouteName="viewReports">
      <Stack.Screen
        name="viewReports"
        options={{ headerShown: false, title: "View Reports" }}
      />
      <Stack.Screen
        name="newReports"
        options={{ headerShown: false, title: "Create Reports" }}
      />
      <Stack.Screen
        name="[id]"
        options={{ headerShown: false, title: "Edit Reports" }}
      />
      <Stack.Screen
        name="editReport/[id]"
        options={{ headerShown: false, title: "Edit Reports" }}
      />
      <Stack.Screen
        name="reportDetails"
        options={{ headerShown: false, title: "Report Details" }}
      />
      <Stack.Screen
        name="validateReports"
        options={{
          headerShown: false,
          title: "Validate Reports",
        }}
      />
      <Stack.Screen
        name="ViewAdminEmergencyList"
        options={{ headerShown: false, title: "Admin View Emergency Report" }}
      />
      <Stack.Screen
        name="viewDistress"
        options={{ headerShown: false, title: "Admin View Emergency Report" }}
      />
      <Stack.Screen
        name="newAdminReports"
        options={{ headerShown: false, title: "New Admin Reports" }}
      />
    </Stack>
  );
};

export default RootReports;

const styles = StyleSheet.create({});
