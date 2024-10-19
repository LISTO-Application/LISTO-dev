import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { SpacerView } from "@/components/SpacerView";
import { styles } from "@/styles/styles"; // For mobile styles
import { webstyles } from "@/styles/webstyles"; // For web styles
import { Report } from "../(tabs)/data/reports";
import { Route } from "expo-router/build/Route";
import { useRoute } from "@react-navigation/native";

export default function ViewReports({ navigation }: { navigation: any }) {
  const [reports, setReports] = useState<Report[]>([]);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("Navigation params:", navigation.params);
      const updatedReport =
        navigation.getState().routes[navigation.getState().index].params
          ?.updatedReport;
      if (updatedReport) {
        setReports((prevReports) => [...prevReports, updatedReport]);
      }
    });
    // console.log(
    //   "Navigation State:",
    //   navigation.getState().routes[navigation.getState().index].params
    //     .updatedReport
    // );
    console.log("Navigation State:", navigation.getState());
    return unsubscribe;
  }, [navigation]);

  const handleDeleteReport = (reportId: number) => {
    setReports((prevReports) =>
      prevReports.filter((report) => report.id !== reportId)
    );
  };

  // Edit report handler (redirect to editReport.tsx with report ID)
  const handleEditReport = (report: Report) => {
    // Redirect to the report edit page with the report ID in the query
    navigation.navigate("EditReports", { report });
  };

  // Submit report handler (redirect to new report form)
  const handleSubmitReport = () => {
    // Redirect to the page where the user can fill in new report details
    navigation.navigate("NewReports"); // Adjust this path based on your routing setup
  };

  // Render for Android and iOS
  if (Platform.OS === "android" || Platform.OS === "ios") {
    return (
      <View style={styles.mainContainer}>
        {/* Blue Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backIcon}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Submitted Reports</Text>
          <SpacerView height={120} />
        </View>

        {/* Report List */}
        <SpacerView height={90} />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {reports.map((report) => (
            <View key={report.id} style={styles.reportContainer}>
              <SpacerView height={20} />
              <View style={styles.reportIcon}>
                <Ionicons name="alert-circle-outline" size={24} color="white" />
              </View>
              <View style={styles.reportTextContainer}>
                <Text style={styles.reportTitle}>{report.title}</Text>
              </View>
              <View style={styles.reportActions}>
                {/* Edit Icon */}
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => handleEditReport(report)}
                >
                  <Ionicons name="pencil" size={24} color="white" />
                </TouchableOpacity>

                {/* Trash Icon (Delete) */}
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => handleDeleteReport(report.id)}
                >
                  <Ionicons name="trash-bin" size={24} color="white" />
                </TouchableOpacity>

                <Text style={styles.timeText}>{report.time}</Text>
              </View>
            </View>
          ))}

          {/* Submit & Cancel Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitReport} // Redirect to the new report form
            >
              <Text style={[styles.buttonText, { color: "#FFF" }]}>
                Submit Report
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  } else if (Platform.OS === "web") {
    return (
      <View style={webstyles.container}>
        {/* Sidebar */}
        {/* Main Content */}
        <View style={webstyles.mainContainer}>
          <Text style={webstyles.headerText}>Reports</Text>
          <ScrollView contentContainerStyle={webstyles.reportList}>
            {reports.map((report, index) => (
              <View
                key={report.id}
                style={[
                  webstyles.reportContainer,
                  index === reports.length - 1 ? { marginBottom: 60 } : {},
                ]}
              >
                <Image source={report.icon} style={webstyles.reportIcon} />
                <Text style={webstyles.reportTitle}>{report.title}</Text>
                <View style={webstyles.reportActions}>
                  <TouchableOpacity
                    style={webstyles.editIcon}
                    onPress={() => handleEditReport(report)}
                  >
                    <Ionicons name="create-outline" size={30} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={webstyles.editIcon}
                    onPress={() => handleDeleteReport(report.id)}
                  >
                    <Ionicons
                      name="trash-bin-outline"
                      size={30}
                      color="#DA4B46"
                    />
                  </TouchableOpacity>
                  <Text style={webstyles.timeText}>{report.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Plus Sign Button */}
          <TouchableOpacity
            style={webstyles.fab}
            onPress={() => navigation.navigate("NewReports")} // Change this to the desired action
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
