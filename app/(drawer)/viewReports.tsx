import React, { useContext, useEffect, useRef, useState } from "react";
import https from "https";
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
  TextInput,
  Modal,
  FlatList,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { SpacerView } from "@/components/SpacerView";
import { styles } from "@/styles/styles"; // For mobile styles
import { webstyles } from "@/styles/webstyles"; // For web styles
import { Report } from "../(tabs)/data/reports";
import { Route } from "expo-router/build/Route";
import { useRoute } from "@react-navigation/native";
import { getIconName } from "@/assets/utils/getIconName";
import { initializeApp } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  firebase,
  getDocs,
  getFirestore,
} from "@react-native-firebase/firestore";
import { GeoPoint, Timestamp } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { AuthContext } from "../AuthContext";
import SideBar from "@/components/SideBar";
import ImageViewer from "@/components/ImageViewer";
import DropDownPicker from "react-native-dropdown-picker";
import ClearFilter from "@/components/ClearFilter";
import PaginationReport from "@/components/PaginationReport";
import TitleCard from "@/components/TitleCard";
import SearchSort from "@/components/SearchSort";
import dayjs from "dayjs";
import { format, formatDate, fromUnixTime } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { Icon } from "@expo/vector-icons/build/createIconSet";
import firestore from "@react-native-firebase/firestore";
import { GeoPoint as FirestoreGeoPoint } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { authWeb } from "@/app/(auth)";
export default function ViewReports({ navigation }: { navigation: any }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [currentStatusSort, setCurrentStatusSort] = useState<"1" | "0" | "2">(
    "1"
  );
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // State for selected category filter
  const [isSortedAsc, setIsSortedAsc] = useState(true); // State for sorting direction
  const [filteredReports, setFilteredReports] = useState<Report[]>([]); // Add this state for filtered reports
  const auth = authWeb;
  const authID = auth.currentUser;
  console.log("AuthID", authID?.uid);
  //FETCH REPORTS
  const fetchReports = async () => {
    try {
      const reportsCollectionRef = collection(db, "reports");
      const reportsSnapshot = await getDocs(reportsCollectionRef);

      if (reportsSnapshot.empty) {
        console.log("No reports found in Firestore.");
        return;
      }
      // Process records from Firestore
      const reportsArray: Report[] = reportsSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          console.log("doc", doc);

          if (data.uid === authID) {
            // Handle GeoPoint for coordinates
            let coordinate = data.coordinate;
            return {
              uid: data.uid,
              additionalInfo: data.additionalInfo || "No additional info",
              category: data.category || "Unknown category",
              location: data.location || "Unknown location",
              coordinate: coordinate, // FirestoreGeoPoint directly from Firestore
              image: data.image || { filename: "", uri: "" }, // Handle image data
              name: data.name || "Anonymous",
              phone: data.phone || "No phone",
              status: data.status || 1, // Default to 1
              id: doc.id || "Unknown account",
              timeOfCrime: data.timeOfCrime,
              timeReported: data.timeReported,
              time: data.time,
              unixTOC: data.unixTOC,
            };
          }

          // Return nothing if authID doesn't match
          return null;
        })
        .filter((report) => report !== null);
      console.log("Mapped Reports:", reportsArray);
      setReports(reportsArray);
      setFilteredReports(reportsArray);
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

  //PAGINATIONS
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  const currentReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  //HANDLERS
  const handleDeleteReport = async (reportId: any) => {
    try {
      await deleteDoc(doc(db, "reports", reportId));
      setFilteredReports((prevReports) =>
        prevReports.filter((r) => r.uid !== reportId)
      );
      Alert.alert("Report deleted successfully");
    } catch (error) {
      console.error("Error deleting report: ", error);
    }
  };
  const handleEditReport = (report: Report) => {
    // Redirect to the report edit page with the report ID in the query
    console.log("Report UID:", report.uid);
    navigation.navigate("EditReports", { report });
  };
  const handleSubmitReport = () => {
    navigation.navigate("newReports");
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterReports(query, selectedCategory);
  };
  reports.forEach((report) => {
    const image = report.image;
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

  //Filter and Sorts
  const filterReports = (searchQuery: string, category: string | null) => {
    let filtered = reports;
    if (category) {
      filtered = filtered.filter((report) => report.category === category);
    }
    if (searchQuery) {
      filtered = filtered.filter((report) => {
        const query = searchQuery.toLowerCase();
        return (
          report.location.toLowerCase().includes(query) ||
          report.category.toLowerCase().includes(query) ||
          dayjs(new Date(report.date))
            .format("YYYY-MM-DD")
            .toLowerCase()
            .includes(query) ||
          report.additionalInfo.toLowerCase().includes(query)
        );
      });
    }
    setFilteredReports(filtered);
  };
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category); // Set the selected category
    // Close the modal
    filterReports(searchQuery, category); // Apply the category filter along with the current search query
  };
  const crimeCategories = Array.from(
    new Set(reports.map((report) => report.category))
  );
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
            <View key={report.uid} style={styles.reportContainer}>
              <SpacerView height={20} />
              <View style={styles.reportIcon}>
                <Ionicons name="alert-circle-outline" size={24} color="white" />
              </View>
              <View style={styles.reportTextContainer}>
                <Text style={styles.reportTitle}>{report.category}</Text>
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
                  onPress={() => handleDeleteReport(report.uid)}
                >
                  <Ionicons name="trash-bin" size={24} color="white" />
                </TouchableOpacity>

                <Text style={styles.timeText}>{report.time}</Text>
              </View>
            </View>
          ))}

          {/* Pagination Controls */}
          <PaginationReport
            filteredReports={filteredReports}
            reportsPerPage={reportsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isAlignedRight={isAlignedRight}
          />

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
            {
              transform: [{ translateX: contentPosition }],
            },
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
            <TouchableWithoutFeedback
              onPress={() => setCategoryModalVisible(false)}
            >
              <View style={[webstyles.modalContainer, { height: "100%" }]}>
                <View style={webstyles.modalContent}>
                  <Text style={webstyles.modalHeader}>
                    Select A Crime Category
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
            {currentReports.map((report) => {
              let iconSource;
              if (report.category === "carnapping") {
                iconSource = require("@/assets/images/car-icon.png");
              } else if (report.category === "rape") {
                iconSource = require("@/assets/images/rape-icon.png");
              } else if (report.category === "homicide") {
                iconSource = require("@/assets/images/homicide-icon.png");
              } else if (report.category === "murder") {
                iconSource = require("@/assets/images/knife-icon.png");
              } else if (report.category === "injury") {
                iconSource = require("@/assets/images/injury-icon.png");
              } else if (report.category === "theft") {
                iconSource = require("@/assets/images/thief-icon.png");
              } else if (report.category === "robbery") {
                iconSource = require("@/assets/images/robbery-icon.png");
              } else {
                iconSource = require("@/assets/images/question-mark.png");
              }

              // const date = new Date(
              //   report.date._seconds * 1000 + report.date._nanoseconds / 1000000
              // );
              // const parsedDate = format(report.date, "yyyy-MM-dd");
              // console.log(parsedDate);
              // console.log(new Date(report.timestamp * 1000));
              // const timestamp = new Date(report.timestamp * 1000);
              // const localTime = dayjs(timestamp).format("hh:mm A");
              // console.log(format(new Date(report.timestamp * 1000), "hh:mm a"));
              console.log(report.timeReported);
              const timeReported = new Date(
                report.timeReported._seconds * 1000 +
                  report.timeReported._nanoseconds / 1000000
              );
              const date = new Date(
                report.timeOfCrime._seconds * 1000 +
                  report.timeOfCrime._nanoseconds / 1000000
              );
              console.log(date);
              console.log(timeReported);
              const parsedDate = format(date, "yyyy-MM-dd");
              const parsedTimeCrime = format(date, "hh:mm");
              const parsedTimeReported = format(timeReported, "hh:mm a");
              console.log(parsedTimeReported);

              return (
                <View key={report.id} style={webstyles.reportContainer}>
                  <Image source={iconSource} style={webstyles.reportIcon} />
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
                        {parsedDate} &nbsp; {parsedTimeCrime}
                      </Text>
                      <Text
                        style={{ flex: 1, color: "white", fontWeight: "300" }}
                      >
                        {report.location.toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={[webstyles.reportInfo, { marginLeft: 20 }]}>
                        {report.phone}
                      </Text>
                      <Text style={[webstyles.reportInfo]}>
                        <b>Remarks:</b> {report.additionalInfo}
                      </Text>
                      <Text style={webstyles.reportInfo}></Text>
                    </View>
                  </View>
                  <View
                    style={[
                      {
                        borderWidth: 2,
                        borderRadius: 10,
                        borderColor: "black",
                      },
                    ]}
                  >
                    <View
                      style={[
                        { borderWidth: 5, borderRadius: 10 },
                        report.status === 2
                          ? { borderColor: "green" } // Status 2 -> Green
                          : report.status === 1
                            ? { borderColor: "yellow" } // Status 1 -> Orange
                            : report.status === 0
                              ? { borderColor: "grey" } // Status 0 -> Grey
                              : null,
                      ]}
                    ></View>
                  </View>
                  <View style={webstyles.reportActions}>
                    <TouchableOpacity
                      style={[
                        webstyles.editIcon,
                        report.status === 2 && webstyles.disabledIcon, // Disabled when status is 2 (green)
                      ]}
                      onPress={() =>
                        report.status !== 2 && handleEditReport(report)
                      } // Only allow edit if status is not 2
                      disabled={report.status === 2} // Disable if status is 2 (green)
                    >
                      <Ionicons
                        name="create-outline"
                        size={30}
                        color={
                          report.status === 0
                            ? "gray"
                            : report.status === 1
                              ? "yellow"
                              : "green"
                        } // Set color based on status
                        style={
                          report.status === 0 && {
                            textDecorationLine: "line-through",
                          } // Strike-through when status is 0 (grey)
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={webstyles.editIcon}
                      onPress={() => handleDeleteReport(report.uid)}
                    >
                      <Ionicons
                        name="trash-bin-outline"
                        size={30}
                        color="#DA4B46"
                      />
                    </TouchableOpacity>
                    <Text style={webstyles.timeText}>{parsedTimeReported}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <PaginationReport
            filteredReports={filteredReports}
            reportsPerPage={reportsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isAlignedRight={isAlignedRight}
          />
        </Animated.View>
        <TouchableOpacity
          style={webstyles.fab}
          onPress={() => navigation.navigate("NewReports")}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Add a report
            </Text>
            <View style={{ alignSelf: "center" }}>
              <Ionicons name="add" size={30} color="white" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
