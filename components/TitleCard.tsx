import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { webstyles } from "@/styles/webstyles";
import { useRoute } from "@react-navigation/native";

export default function TitleCard() {
  const route = useRoute();

  const titles: { [key: string]: string } = {
    Validate: "Validate Reports",
    ViewReports: "User Reports",
    NewReports: "Create a Report",
    EditReports: "Edit a Report",
    ReportDetails: "Report Details",
    ViewAdminEmergencyList: "Listed Crimes",
    Default: "Default",
  };

  const title = titles[route.name] || titles.Default;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 10,
        paddingLeft: 20,
      }}
    >
      <Text style={[webstyles.headerText, { marginRight: 10 }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
