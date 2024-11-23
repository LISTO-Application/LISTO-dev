import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { SpacerView } from "@/components/SpacerView";
import { styles } from "@/styles/styles"; // For mobile styles
import { webstyles } from "@/styles/webstyles"; // For web styles
import { Report } from "../(tabs)/data/reports";
import { Route } from "expo-router/build/Route";
import { useRoute } from "@react-navigation/native";
import { getIconName } from "../../assets/utils/getIconName";
import { initializeApp } from "@react-native-firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
} from "@react-native-firebase/firestore";
import { db } from "../FirebaseConfig";
import { AuthContext } from "../AuthContext";
import SideBar from "@/components/SideBar";
import ImageViewer from "./ImageViewer";

export default function ViewReports({ navigation }: { navigation: any }) {
  const [reports, setReports] = useState<Report[]>([]);

  const fetchReports = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reports"));
      const reportList: Report[] = querySnapshot.docs.map((doc) => {
        const imageData = doc.data().image || {};

        return {
          id: doc.id,
          icon: doc.data().icon || "",
          category: doc.data().category || "Unknown",
          title: doc.data().title || "Untitled",
          additionalInfo: doc.data().additionalInfo || "Unknown Report",
          location: doc.data().location || "Unknown Location",
          name: doc.data().name || "Anonymous",
          date: doc.data().date || [
            "Unknown Date: ",
            new Date().toDateString(),
          ],
          time: doc.data().time || [
            "Unknown Time: ",
            new Date().toTimeString(),
          ],
          image: {
            filename: imageData.filename || "Unknown Filename",
            uri: imageData.uri || "Unknown Uri",
          },
          timeStamp: doc.data().timeStamp || new Date().toISOString(),
        };
      });
      setReports(reportList);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchReports();
    });
    return unsubscribe;
  }, [navigation]);

  const [currentPage, setCurrentPage] = useState(1);

  console.log("Known Reports: ", reports);

  const reportsPerPage = 10;
  // Calculate total pages
  const totalPages = Math.ceil(reports.length / reportsPerPage);
  // Get the current reports based on the page
  const currentReports = reports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  const handleDeleteReport = async (reportId: any) => {
    try {
      await deleteDoc(doc(db, "reports", reportId));
      setReports((prevReports) => prevReports.filter((r) => r.id !== reportId));
      Alert.alert("Report deleted successfully");
    } catch (error) {
      console.error("Error deleting report: ", error);
    }
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

  reports.forEach((report) => {
    const image = report.image;
    console.log(image.uri);
  });

  //Animation to Hide side bar
  const { width: screenWidth } = Dimensions.get("window"); // Get the screen width
  const sidebarWidth = screenWidth * 0.25; // 25% of screen width
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sideBarPosition = useRef(new Animated.Value(-sidebarWidth)).current;
  const contentPosition = useRef(new Animated.Value(0)).current;
  const [isAlignedRight, setIsAlignedRight] = useState(false);

  const toggleSideBar = () => {
    Animated.timing(sideBarPosition, {
      toValue: isSidebarVisible ? -sidebarWidth : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(contentPosition, {
      toValue: isSidebarVisible ? 0 : sidebarWidth, // Shift main content
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsAlignedRight(!isAlignedRight);
    setSidebarVisible(!isSidebarVisible);
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
        <SideBar sideBarPosition={sideBarPosition} navigation={navigation} />
        {/* Toggle Button */}
        <TouchableOpacity
          onPress={toggleSideBar}
          style={[
            webstyles.toggleButton,
            { left: isSidebarVisible ? sidebarWidth : 10 }, // Adjust toggle button position
          ]}
        >
          <Ionicons
            name={isSidebarVisible ? "chevron-back" : "chevron-forward"}
            size={24}
            color={"#333"}
          />
        </TouchableOpacity>
        {/* Main Content */}
        <Animated.View
          style={[
            webstyles.mainContainer,
            {
              transform: [{ translateX: contentPosition }],
            },
          ]}
        >
          <Text style={webstyles.headerText}>Reports</Text>
          <ScrollView
            contentContainerStyle={[
              webstyles.reportList,
              isAlignedRight && { width: "75%" },
            ]}
          >
            {currentReports.map((report) => (
              <View key={report.id} style={webstyles.reportContainer}>
                <Image source={report.icon} style={webstyles.reportIcon} />
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={webstyles.reportTitle}>
                      {report.category.charAt(0).toUpperCase() +
                        report.category.slice(1)}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        color: "white",
                        alignSelf: "center",
                        fontWeight: "300",
                      }}
                    >
                      {report.date} | {report.time}
                    </Text>
                    <Text
                      style={{ flex: 1, color: "white", fontWeight: "300" }}
                    >
                      {report.location.toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={webstyles.reportInfo}>
                      {report.title.charAt(0).toUpperCase() +
                        report.title.slice(1)}
                    </Text>
                    <Text style={webstyles.reportInfo}>
                      <b>Remarks:</b> {report.additionalInfo}
                    </Text>
                    <Text style={webstyles.reportInfo}></Text>
                  </View>
                </View>
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
                  <Text style={webstyles.timeText}>{report.timeStamp}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Pagination Controls */}
          {/* Plus Sign Button */}
          <View style={[webstyles.paginationContainer]}>
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
        </Animated.View>
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
