import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
  Button,
  FlatList,
  Modal,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { webstyles } from "@/styles/webstyles"; // For web styles
import { styles } from "@/styles/styles"; // For mobile styles
import { db } from "../FirebaseConfig";
import { Report } from "../(tabs)/data/reports";
import "firebase/database";
import {
  GeoPoint as FirestoreGeoPoint,
  Timestamp,
} from "@react-native-firebase/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
} from "@react-native-firebase/firestore";
import SideBar from "@/components/SideBar";
import { doc, updateDoc } from "@react-native-firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";
import ClearFilter from "@/components/ClearFilter";
import ValidateReportCard from "@/components/ValidateReportCard";
import PaginationReport from "@/components/PaginationReport";
import TitleCard from "@/components/TitleCard";
import SearchSort from "@/components/SearchSort";
import dayjs from "dayjs";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { app, dbWeb } from "../(auth)";

const database = db;

export default function ValidateReports({ navigation }: { navigation: any }) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const handleTitlePress = (report: Report) => {
    console.log("Navigating to details page for report:", report);
    navigation.navigate("ReportDetails", {
      id: report.id,
      category: report.category,
      status: report.status,
      additionalInfo: report.additionalInfo,
      image: report.image,
    });
  };
  const handleStatusChange = async (id: string, newStatus: number) => {
    try {
      // Query the "reports" collection where the `id` field matches the provided `id`
      console.log("Handling status...");
      const reportsCollection = collection(db, "reports");
      const querySnapshot = await getDocs(reportsCollection);

      const snapshot = querySnapshot.docs.filter((doc) => doc.id === id);

      console.log(`Obtained snapshot ${querySnapshot.docs}`);
      console.log(querySnapshot);
      if (querySnapshot.empty) {
        console.error(`No report found with ID: ${id}`);
        return;
      }
      const reportRef = doc(db, "reports", snapshot[0].id);
      const reportData = snapshot[0].data();

      // Update the status in Firestore
      await updateDoc(reportRef, { status: newStatus });
      window.confirm(`Status updated to ${newStatus} for report ID ${id}`);

      if (newStatus === 2) {
        const newCrime = {
          additionalInfo: reportData.additionalInfo || "",
          category: reportData.category || "",
          coordinate: reportData.coordinate || [],
          location: reportData.location || "",
          time: reportData.time || "",
          timeOfCrime: reportData.timeOfCrime || "",
          timeReported: reportData.timeReported || "",
          unixTOC: reportData.unixTOC || null,
        };
        const crimeRef = collection(db, "crimes");
        await addDoc(crimeRef, newCrime);
        window.confirm(`Report ${id} transferred to crimes.`);
        navigation.navigate("ViewAdminEmergencyList");
      }

      // If status is 0 (archived), just log the action
      if (newStatus === 0) {
        const archivedCrime = snapshot[0].data();
        const archiveRef = collection(db, "archives");
        await addDoc(archiveRef, archivedCrime);
        window.confirm(`Report ${id} transferred to archives.`);
        window.confirm(`Report ${id} archived.`);
        navigation.navigate("ViewReports");
      }

      // Re-sort the reports (optional)
      setFilteredReports((prevReports) => {
        const sortedReports = [...prevReports].sort(
          (a, b) => a.status - b.status
        );
        return sortedReports;
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsCollectionRef = collection(db, "reports");
        const reportsSnapshot = await getDocs(reportsCollectionRef);

        if (reportsSnapshot.empty) {
          console.log("No reports found in Firestore.");
          return;
        }

        const reportsArray = reportsSnapshot.docs.map((doc) => {
          const data = doc.data();

          // Handle GeoPoint for coordinates
          let coordinate = data.coordinate;
          if (coordinate instanceof FirestoreGeoPoint) {
            coordinate = coordinate;
          } else {
            coordinate = new FirestoreGeoPoint(0, 0);
          }

          return {
            uid: data.uid,
            id: doc.id,
            additionalInfo: data.additionalInfo || "No additional info",
            category: data.category || "Unknown",
            location: data.location || "Unknown location",
            coordinate,
            image: data.image || { filename: "", uri: "" },
            name: data.name || "Anonymous",
            phone: data.phone || "No phone",
            status: data.status || 1,
            time: data.time || "Unknown time",
            timeOfCrime: data.timeOfCrime,
            timeReported: data.timeReported,
            unixTOC: data.unixTOC || 0,
            date: data.date || new Date(),
            timestamp: data.timestamp || Date.now(),
          };
        });

        console.log("Mapped Reports:", reportsArray);
        setReports(reportsArray);
        setFilteredReports(reportsArray);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    const unsubscribe = navigation.addListener("focus", fetchReports);

    return unsubscribe;
  }, [navigation]);

  const [reports, setReports] = useState<Report[]>([]);

  const getStatusStyle = (status: number) => {
    switch (status) {
      case 0: // Archived
        return { backgroundColor: "gray", color: "white" };
      case 1: // Pending or Default
        return { backgroundColor: "yellow", color: "black" };
      case 2: // Valid
        return { backgroundColor: "green", color: "white" };
      default:
        return { backgroundColor: "white", color: "black" };
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10; // Adjust this number based on how many reports per page
  const currentReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

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

  // Get unique crime categories from reports
  const crimeCategories = Array.from(
    new Set(reports.map((report) => report.category))
  );

  // Filter reports based on search query and selected category
  const filterReports = (searchQuery: string, category: string | null) => {
    let filtered = reports; // Start with all reports

    // Apply category filter if a category is selected
    if (category) {
      filtered = filtered.filter(
        (report: { category: string }) => report.category === category
      );
    }

    // Apply search query filter if a query is provided
    if (searchQuery) {
      filtered = filtered.filter(
        (report: {
          time: any;
          location: string;
          category: string;
          timeOfCrime: Date;
        }) => {
          const query = searchQuery.toLowerCase();
          const date = dayjs(report.timeOfCrime).format("YYYY-MM-DD");
          return (
            report.location.toLowerCase().includes(query) ||
            report.category.toLowerCase().includes(query) ||
            date.toLowerCase().includes(query)
          );
        }
      );
    }

    setFilteredReports(filtered); // Update the filtered reports state
  };
  // Handle category selection from the modal
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category); // Set the selected category
    setCategoryModalVisible(false); // Close the modal
    filterReports(searchQuery, category); // Apply the category filter along with the current search query
  };

  if (Platform.OS === "android" || Platform.OS === "ios") {
    return (
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backIcon}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Validate Reports (ADMINS)</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {currentReports.map((report) => (
            <View key={report.id}>
              {/* Report content */}
              <View style={styles.reportContainer}>
                <View style={styles.reportIcon}>
                  <Ionicons
                    name={
                      report.category === "homicide" ? "alert-circle" : "alert"
                    }
                    size={24}
                    color="white"
                  />
                </View>

                <View style={styles.reportTextContainer}>
                  {/* Title wrapped in TouchableOpacity for navigation */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("reportDetails", {
                        id: report.id,
                        category: report.category,
                      })
                    }
                  >
                    <Text style={styles.reportTitle}>{report.category}</Text>
                  </TouchableOpacity>
                  <Text style={styles.reportDetails}>
                    {report.additionalInfo}
                  </Text>
                </View>

                {/* Status badge */}
                <View style={styles.statusContainer}>
                  <Text
                    style={[styles.statusBadge, getStatusStyle(report.status)]}
                  >
                    {report.status}
                  </Text>
                </View>

                {/* {report.status === "PENDING" ? (
                  <View style={styles.actionContainer}>
                    <TouchableOpacity
                      style={webstyles.approveButton}
                      onPress={() => handleApprove(report.id)}
                    >
                      <Text style={webstyles.buttonText}>Validate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={webstyles.rejectedButton}
                      onPress={() => handleReject(report.id)}
                    >
                      <Text style={webstyles.buttonText}>Penalize</Text>
                    </TouchableOpacity>
                  </View>
                ) : report.status === "VALID" ? (
                  <TouchableOpacity
                    style={webstyles.approvedButton}
                    onPress={() => {

                    }}
                  >
                    <Text style={webstyles.approvedButtonText}>Validated</Text>
                  </TouchableOpacity>
                ) : report.status === "PENALIZED" ? (
                  <TouchableOpacity
                    style={webstyles.rejectedButton}
                    onPress={() => {

                    }}
                  >
                    <Text style={webstyles.rejectedButtonText}>Penalized</Text>
                  </TouchableOpacity>
                ) : null} */}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  } else if (Platform.OS === "web") {
    return (
      <View style={webstyles.container}>
        <SideBar sideBarPosition={sideBarPosition} navigation={navigation} />
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
        <Animated.View
          style={[
            webstyles.mainContainer,
            { transform: [{ translateX: contentPosition }] },
          ]}
        >
          <TitleCard />
          <SearchSort
            reports={reports}
            setCategoryModalVisible={setCategoryModalVisible}
            setFilteredReports={setFilteredReports}
            isAlignedRight={isAlignedRight}
            filterReports={filterReports}
            handleExport={undefined}
            handleImport={undefined}
          />
          <Modal
            visible={isCategoryModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setCategoryModalVisible(false)}
          >
            {/* TouchableWithoutFeedback to close the modal when clicking outside */}
            <TouchableWithoutFeedback
              onPress={() => setCategoryModalVisible(false)}
            >
              <View style={webstyles.modalContainer}>
                <View style={webstyles.modalContent}>
                  <Text style={webstyles.modalHeader}>
                    Select a Crime Category
                  </Text>
                  <FlatList
                    data={crimeCategories}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={webstyles.modalOption}
                        onPress={() => handleCategorySelect(item)}
                      >
                        <Text style={webstyles.modalOptionText}>
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          <ScrollView
            contentContainerStyle={[
              webstyles.reportList,
              isAlignedRight && { width: "75%" },
            ]}
          >
            {/* Filtered reports that have status = 1 */}
            {currentReports.length > 0 ? (
              currentReports
                .filter((report) => report.status === 1) // Only show reports with status 1 (pending)
                .map((report) => (
                  <View
                    key={report.id}
                    style={{
                      marginBottom: 20,
                      padding: 15,
                      borderRadius: 8,
                      backgroundColor: "#f9f9f9",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    }}
                  >
                    <ValidateReportCard
                      report={report}
                      handleTitlePress={handleTitlePress}
                      handleStatusChange={(reportId, newStatus) =>
                        handleStatusChange(reportId, newStatus)
                      } // Pass the correct status value
                    />
                  </View>
                ))
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No reports available.
              </Text>
            )}
          </ScrollView>

          <PaginationReport
            filteredReports={filteredReports}
            reportsPerPage={reportsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isAlignedRight={isAlignedRight}
          />
        </Animated.View>
      </View>
    );
  }
}
