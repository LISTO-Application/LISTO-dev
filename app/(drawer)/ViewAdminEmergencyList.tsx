import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  TouchableWithoutFeedback, Alert
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { webstyles } from "@/styles/webstyles"; // For web styles
import { db } from "../FirebaseConfig";
import { GeoPoint, Timestamp } from "@react-native-firebase/firestore";
import "firebase/database";
import { collection, getDocs, deleteDoc,doc} from "@react-native-firebase/firestore";
import SideBar from "@/components/SideBar";
import { styles } from "@/styles/styles";
import TitleCard from "@/components/TitleCard";
import SearchSort from "@/components/SearchSort";
import { Report } from "../(tabs)/data/reports";
import PaginationReport from "@/components/PaginationReport";

export default function ViewAdminEmergencyList({
  navigation,
}: {
  navigation: any;
}) {
  const [crimes, setCrimes] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);



  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        // Fetch the incidents collection from Firestore
        const crimesSnapshot = await getDocs(collection(db, "crimes"));

        console.log("Fetched Incidents Snapshot:", crimesSnapshot); // Debugging log

        if (crimesSnapshot.empty) {
          console.log("No incidents found in Firestore.");
          return; // No incidents, so return early
        }
        const crimesArray: Report[] = crimesSnapshot.docs.map((doc) => {
          const imageData = doc.data().image || {};

          return {
            id: doc.id,
            icon: doc.data().icon,
            name: doc.data().name,
            title: doc.data().title,
            status: doc.data().status || "PENDING",
            location: doc.data().location,
            coordinate: doc.data().coordinate || {
              _latitude: 0,
              _longitude: 0,
            }, // Fallback if coordinates are not available
            image: {
              filename: imageData.filename || "Unknown Filename",
              uri: imageData.uri || "Unknown Uri",
            },
            date: doc.data().date || "No date",
            time: doc.data().time,
            category: doc.data().category || "No type",
            additionalInfo: doc.data().additionalInfo || "No info",
            timeStamp: doc.data().timeStamp,
          };
        });

        console.log("Mapped Incidents:", crimesArray); // Debugging log
        setCrimes(crimesArray); // Update state with incidents
        setFilteredReports(crimesArray);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    fetchIncidents(); // Fetch incidents when the component mounts
  }, []);

  const formatDate = (timestamp: Timestamp | string): string => {
    if (typeof timestamp === "string") return timestamp; // If it's already a string
    const date = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date
    return date.toLocaleString(); // Format it as a readable string
  };

  const formatCoordinates = (coordinates: GeoPoint): string => {
    return `Latitude: ${coordinates.latitude}, Longitude: ${coordinates.longitude}`;
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "VALID":
        return { backgroundColor: "#115272", color: "red" };
      case "PENDING":
        return { backgroundColor: "grey", color: "blue" };
      case "PENALIZED":
        return { backgroundColor: "#dc3545", color: "green" };
      default:
        return { backgroundColor: "#6c757d", color: "" };
    }
  };

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

  const handleDeleteRequest = (reportId: string) => {
    setSelectedReportId(reportId);
    setDeleteModalVisible(true);
  };


  


  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10; // Adjust this number based on how many reports per page
  const currentReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );
  // Get unique crime categories from reports
  const crimeCategories = Array.from(
    new Set(crimes.map((report) => report.category))
  );

  // Filter reports based on search query and selected category
  const filterReports = (searchQuery: string, category: string | null) => {
    let filtered = crimes; // Start with all reports

    // Apply category filter if a category is selected
    if (category) {
      filtered = filtered.filter(
        (report: { category: string }) => report.category === category
      );
    }

    // Apply search query filter if a query is provided
    if (searchQuery) {
      filtered = filtered.filter((report) => {
        const query = searchQuery.toLowerCase();
        return (
          report.title.toLowerCase().includes(query) ||
          report.category.toLowerCase().includes(query) ||
          report.status.toLowerCase().includes(query)
        );
      });
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
      <View style={webstyles.mainContainer}>
        {/* Header */}
        <View style={webstyles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={webstyles.backIcon}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={webstyles.headerText}>Distress Messages (ADMINS)</Text>
        </View>

        <ScrollView contentContainerStyle={webstyles.scrollViewContent}>
          {crimes.map((report) => (
            <View key={report.id}>
              {/* Report content */}
              <View style={webstyles.reportContainer}>
                <View style={webstyles.reportIcon}>
                  <Ionicons
                    name={
                      report.title === "HOMICIDE" ? "alert-circle" : "alert"
                    }
                    size={24}
                    color="white"
                  />
                </View>

                <View style={webstyles.reportTextContainer}>
                  {/* Title wrapped in TouchableOpacity for navigation */}
                  <TouchableOpacity onPress={() => handleTitlePress(report.id)}>
                    <Text style={webstyles.reportTitle}>{report.title}</Text>
                  </TouchableOpacity>
                  <Text style={webstyles.reportDetails}>{report.details}</Text>
                </View>

                {/* Status badge */}
                <View style={webstyles.statusContainer}>
                  <Text
                    style={[
                      webstyles.statusBadge,
                      getStatusStyle(report.status),
                    ]}
                  >
                    {report.status}
                  </Text>
                </View>

                {/* Approve and Reject buttons */}
                {report.status === "PENDING" ? (
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
                      /* Optional: Add any action for approved state */
                    }}
                  >
                    <Text style={webstyles.approvedButtonText}>Validated</Text>
                  </TouchableOpacity>
                ) : report.status === "PENALIZED" ? (
                  <TouchableOpacity
                    style={webstyles.rejectedButton}
                    onPress={() => {
                      /* Optional: Add any action for rejected state */
                    }}
                  >
                    <Text style={webstyles.rejectedButtonText}>Penalized</Text>
                  </TouchableOpacity>
                ) : null}
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
        <Animated.View
          style={[
            webstyles.mainContainer,
            { transform: [{ translateX: contentPosition }] },
          ]}
        >
          <TitleCard />
          <SearchSort
            reports={crimes}
            setCategoryModalVisible={setCategoryModalVisible}
            setFilteredReports={setFilteredReports}
            isAlignedRight={isAlignedRight}
            filterReports={filterReports}
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
                        <Text style={webstyles.modalOptionText}>{item}</Text>
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
            {currentReports.length > 0 ? (
              currentReports.map((incident, index) => (
                <View
                  key={index}
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
                  {/* Row: Title, Date, and Delete Button */}
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      {/* Left side: Title and Date */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#115272",
          }}
        >
          {incident.category.charAt(0).toUpperCase() +
            incident.category.slice(1)}
        </Text>
        <Text
          style={{
            color: "#115272",
            fontSize: 14,
            marginLeft: 10, // Space between title and date
          }}
        >
          {formatDate(incident.date)}
        </Text>
      </View>
      <TouchableOpacity
  style={{ padding: 10 }}
  onPress={() => handleDeleteRequest(incident.id)}
>
  Unread
</TouchableOpacity>
      {/* Right side: Delete Button */}
      <Modal
  visible={isDeleteModalVisible}
  animationType="fade"
  transparent={true}
  onRequestClose={() => setDeleteModalVisible(false)}
>
  <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
    <View style={[webstyles.modalContainer, { backgroundColor: 'transparent' }]}>
      <TouchableWithoutFeedback>
        <View style={webstyles.modalContent}>
          <Text style={webstyles.modalHeader}>Confirm Read?</Text>
          <Text style={webstyles.modalText}>
            Do you acknowledge this
          </Text>
          <View style={webstyles.modalActions}>
            <TouchableOpacity
              style={[webstyles.modalButton, { backgroundColor: "#ccc" }]}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={webstyles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[webstyles.modalButton, { backgroundColor: "#DA4B46" }]}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={webstyles.modalButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  </TouchableWithoutFeedback>
</Modal>
    </View>

    {/* Coordinates */}
    <Text
      style={{ color: "#115272", fontSize: 14, marginTop: 10 }}
    >
      {formatCoordinates(incident.coordinate)}
    </Text>
  </View>
              ))
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No incidents available.
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
