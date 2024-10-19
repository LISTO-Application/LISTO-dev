import React, { useState } from "react";
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

export default function ViewReports({ navigation }: { navigation: any }) {
  // Icons for reports
  const murder = require("../../assets/images/knife-icon.png");
  const homicide = require("../../assets/images/homicide-icon.png");
  const theft = require("../../assets/images/thief-icon.png");
  const carnapping = require("../../assets/images/car-icon.png");
  const injury = require("../../assets/images/injury-icon.png");
  const robbery = require("../../assets/images/robbery-icon.png");
  const rape = require("../../assets/images/rape-icon.png");

  // Example report data stored in state
  const [reports, setReports] = useState([...Array(20).keys()].map(i => ({
      id: i + 1,
      title: `Report ${i + 1}`,
      time: "9:41 AM",
      icon: i % 2 === 0 ? robbery : theft,
    })));

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  // Calculate total pages
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  // Get the current reports based on the page
  const currentReports = reports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  // Delete report handler
  const handleDeleteReport = (reportId: number) => {
    // Show confirmation alert
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            // Remove the report from the state
            setReports(reports.filter((report) => report.id !== reportId));
          },
        },
      ]
    );
  };

  // Edit report handler (redirect to editReport.tsx with report ID)
  const handleEditReport = (reportId: number) => {
    navigation.navigate("EditReports", { id: reportId });
  };

  // Submit report handler (redirect to new report form)
  const handleSubmitReport = () => {
    navigation.navigate("/newReportsForm");
  };

  // Render for Android and iOS
  if (Platform.OS === "android" || Platform.OS === "ios") {
    return (
      <View style={styles.mainContainer}>
        {/* Blue Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Submitted Reports</Text>
          <SpacerView height={120} />
        </View>

        {/* Report List */}
        <SpacerView height={90} />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {currentReports.map((report) => (
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
                  onPress={() => handleEditReport(report.id)}
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

          {/* Pagination Controls */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              disabled={currentPage === 1}
              onPress={() => setCurrentPage(currentPage - 1)}
              style={styles.paginationButton}
            >
              <Text style={styles.paginationText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.paginationText}>
              Page {currentPage} of {totalPages}
            </Text>
            <TouchableOpacity
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage(currentPage + 1)}
              style={styles.paginationButton}
            >
              <Text style={styles.paginationText}>Next</Text>
            </TouchableOpacity>
          </View>

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
        {/* Main Content */}
        <View style={webstyles.mainContainer}>
          <Text style={webstyles.headerText}>Reports</Text>
          
          <ScrollView contentContainerStyle={webstyles.reportList}>
            {currentReports.map((report) => (
              <View key={report.id} style={webstyles.reportContainer}>
                <Image source={report.icon} style={webstyles.reportIcon} />
                <Text style={webstyles.reportTitle}>{report.title}</Text>
                <View style={webstyles.reportActions}>
                  <TouchableOpacity
                    style={webstyles.editIcon}
                    onPress={() => handleEditReport(report.id)}
                  >
                    <Ionicons name="create-outline" size={30} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={webstyles.editIcon}
                    onPress={() => handleDeleteReport(report.id)}
                  >
                    <Ionicons name="trash-bin-outline" size={30} color="#DA4B46" />
                  </TouchableOpacity>
                  <Text style={webstyles.timeText}>{report.time}</Text>
                  
                </View>
                
              </View>
              
            ))}
          </ScrollView>

          {/* Pagination Controls */}
        

          {/* Plus Sign Button */}
         
          <View style={webstyles.paginationContainer}>
            <TouchableOpacity
              disabled={currentPage === 1}
              onPress={() => setCurrentPage(currentPage - 1)}
              style={webstyles.paginationButton}
            >
              <Text style={webstyles.paginationText}>Previous</Text>
            </TouchableOpacity>
            <Text style={webstyles.paginationText}>
              Page {currentPage} of {totalPages}
            </Text>
            <TouchableOpacity
              disabled={currentPage === totalPages}
              onPress={() => setCurrentPage(currentPage + 1)}
              style={webstyles.paginationButton}
            >
              <Text style={webstyles.paginationText}>Next</Text>
            </TouchableOpacity>
            
          </View>
          
        </View>
        <TouchableOpacity
            style={webstyles.fab}
            onPress={() => navigation.navigate("NewReports")}
          >
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
      </View>
    );
  }
}
