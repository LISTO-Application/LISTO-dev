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
  addDoc,
  collection,
  deleteDoc,
  getDocs,
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

const database = db;

export default function ValidateReports({ navigation }: { navigation: any }) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const handleTitlePress = (report: Report) => {
    console.log("Navigating to details page for report:", report);
    navigation.navigate("ReportDetails", {
      uid: report.uid,
      category: report.category,
      status: report.status,
      additionalInfo: report.additionalInfo,
      image: report.image,
    });
  };
  const handleStatusChange = async (reportId: string, newStatus: boolean) => {
    try {
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.uid === reportId ? { ...report, status: newStatus } : report
        )
      );
      setFilteredReports((prevReports) =>
        prevReports.map((report) =>
          report.uid === reportId ? { ...report, status: newStatus } : report
        )
      );

      const report = reports.find((r) => r.uid === reportId);
      if (report) {
        const reportRef = doc(db, "reports", reportId);
        await updateDoc(reportRef, { status: newStatus });
        console.log(`Status updated to ${newStatus} for report ID ${reportId}`);

        if (newStatus === true) {
          try {
            const newCrime = {
              ...report,
              status: "VALID",
            };
            console.log(newCrime);
            const crimeRef = collection(database, "crimes");
            await addDoc(crimeRef, newCrime);
            console.log(
              `Report ${report.uid} transferred to incidents from ${report}`
            );
          } catch (error) {
            console.error("Error transferring report:", error);
          }
        }
        if (newStatus === true) {
          try {
            await deleteDoc(doc(db, "reports", reportId));
            setReports((prevReports) =>
              prevReports.filter((r) => r.uid !== reportId)
            );
            setFilteredReports((prevReports) =>
              prevReports.filter((r) => r.uid !== reportId)
            );
            console.log(`Report ${report.uid} removed from reports.`);
          } catch (error) {
            alert(
              `Error deleting the report ${report.category} by ${report.name} on ${report.date}`
            );
          }
        }

        // Re-sort the reports based on the new status
        setFilteredReports((prevReports) => {
          const sortedReports = [...prevReports].sort((a, b) => {
            const statusOrder = [true, false];
            return (
              statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
            );
          });
          return sortedReports;
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reports"));
        const reportList: Report[] = querySnapshot.docs.map((doc) => {
          const imageData = doc.data().image || {};
          const date = doc.data().date;

          const newDate = new Date(date._seconds * 1000);
          return {
            uid: doc.data().uid,
            phone: doc.data().phone || "Unknown Number",
            category: doc.data().category || "Unknown",
            additionalInfo: doc.data().additionalInfo || "Unknown Report",
            location: doc.data().location || "Unknown Location",
            coordinate: doc.data().coordinate,
            name: doc.data().name || "Anonymous",
            date: newDate || ["Unknown Date: ", new Date().toDateString()],
            time: doc.data().time || [
              "Unknown Time: ",
              new Date().toTimeString(),
            ],
            image: {
              filename: imageData.filename || "Unknown Filename",
              uri: imageData.uri || "Unknown Uri",
            },
            status: doc.data().status,
            timestamp: doc.data().timestamp || new Date().toISOString(),
          };
        });
        setReports(reportList);
        setFilteredReports(reportList);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const [reports, setReports] = useState<Report[]>([]);

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
          date: Date;
        }) => {
          const query = searchQuery.toLowerCase();
          const date = dayjs(report.date).format("YYYY-MM-DD");
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
            <View key={report.uid}>
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
                        uid: report.uid,
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
            {currentReports.length > 0 ? (
              currentReports.map((report) => (
                <View
                  key={report.uid}
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
                    handleStatusChange={handleStatusChange}
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
