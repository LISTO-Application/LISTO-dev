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
  TextInput
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
  const [sortCriteria, setSortCriteria] = useState("date");
  const [isSortedAsc, setIsSortedAsc] = useState(true); 
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
          status: doc.data().status,
          timeStamp: doc.data().timeStamp || new Date().toISOString(),
        };
      });
  
      // Sort the reports by date after fetching
      const sortedReports = reportList.sort((a, b) => {
        const dateA = new Date(a.date[1]);
        const dateB = new Date(b.date[1]);
        return dateA.getTime() - dateB.getTime(); // Sort in ascending order
      });
  
      setReports(sortedReports); // Update the state with sorted reports
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };
  
  const sortReportsByDate = () => {
    setReports((prevReports) => {
      const sortedReports = [...prevReports];
      sortedReports.sort((a, b) => {
        const dateA = new Date(a.date[1]);
        const dateB = new Date(b.date[1]);
        return isSortedAsc ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      });
      return sortedReports;
    });
  
    // Toggle the sorting order for next time
    setIsSortedAsc((prev) => !prev);
  };
  
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchReports();
    });
    return unsubscribe;
  }, [navigation]);
  const sortReportsByAlphabet = () => {
    setReports((prevReports) => {
      const sortedReports = [...prevReports].sort((a, b) => {
        return a.title.localeCompare(b.title); // Sort by title alphabetically
      });
      return sortedReports;
    });
  };
  
  // Sorting reports by crime category (Alphabetically)
  const sortReportsByCategory = () => {
    setReports((prevReports) => {
      const sortedReports = [...prevReports].sort((a, b) => {
        return a.category.localeCompare(b.category); // Sort by category alphabetically
      });
      return sortedReports;
    });
  };

  
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
    navigation.navigate("editReports", { report });
  };

  // Submit report handler (redirect to new report form)
  const handleSubmitReport = () => {
    // Redirect to the page where the user can fill in new report details
    navigation.navigate("newReports"); // Adjust this path based on your routing setup
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
    const [searchQuery, setSearchQuery] = useState<string>("");
  
      const handleSearch = (query: string) => {
        setSearchQuery(query);
        console.log("Search query:", query); // Add search logic here
    };

    const filteredReports = currentReports.filter((report) => {
      const lowercasedQuery = searchQuery.toLowerCase();
      return (
          report.title.toLowerCase().includes(lowercasedQuery) || // Search by title
          report.location.toLowerCase().includes(lowercasedQuery) || // Search by location
          report.category.toLowerCase().includes(lowercasedQuery) || // Search by category
          report.date.toLowerCase().includes(lowercasedQuery) // Search by date
      );
  });


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
    {/* Header and Search Bar */}
    <View
        style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between", // Makes sure the header and search bar are spaced
            marginBottom: 10, // Space between this row and the rest of the content
        }}
    >
        <Text style={[webstyles.headerText, { marginRight: 10 }]}>Reports</Text>
        <TextInput
    style={{
        width: 200, // Set a fixed width for the search bar
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
    }}
    placeholder="Search reports..."
    value={searchQuery}
    onChangeText={handleSearch}
/>
    </View>
  
                  {/* Sort Buttons */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, paddingHorizontal: 25 }}>
  {/* Sort by Date Button */}
  <TouchableOpacity onPress={sortReportsByDate}>
    <Text style={webstyles.sortButtonText}>
      {isSortedAsc ? "Sort by Date (Latest)" : "Sort by Date (Earliest)"}
    </Text>
  </TouchableOpacity>

  {/* Sort by Alphabetical Button */}
  <TouchableOpacity onPress={sortReportsByAlphabet}>
    <Text style={webstyles.sortButtonText}>Sort by Alphabet</Text>
  </TouchableOpacity>

  {/* Sort by Crime Category Button */}
  <TouchableOpacity onPress={sortReportsByCategory}>
    <Text style={webstyles.sortButtonText}>Sort by Crime Category</Text>
  </TouchableOpacity>

 
</View>
  
                  {/* Reports List */}
                  <ScrollView
    contentContainerStyle={[
        webstyles.reportList,
        isAlignedRight && { width: "75%" },
    ]}
>
    {filteredReports.map((report) => {
        let iconSource;
        if (report.category === "carnapping") {
            iconSource = require("../../assets/images/car-icon.png");
        } else if (report.category === "rape") {
            iconSource = require("../../assets/images/rape-icon.png");
        } else if (report.category === "homicide") {
            iconSource = require("../../assets/images/homicide-icon.png");
        } else if (report.category === "murder") {
            iconSource = require("../../assets/images/knife-icon.png");
        } else if (report.category === "injury") {
            iconSource = require("../../assets/images/injury-icon.png");
        } else if (report.category === "theft") {
            iconSource = require("../../assets/images/thief-icon.png");
        } else if (report.category === "robbery") {
            iconSource = require("../../assets/images/robbery-icon.png");
        } else {
            iconSource = require("../../assets/images/question-mark.png");
        }

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
                            {report.date}
                        </Text>
                        <Text
                            style={{ flex: 1, color: "white", fontWeight: "300" }}
                        >
                            {report.location.toUpperCase()}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={webstyles.reportInfo}>
                            {report.title.charAt(0).toUpperCase() + report.title.slice(1)}
                        </Text>
                        <Text style={webstyles.reportInfo}>
                            <b>Remarks:</b> {report.additionalInfo}
                        </Text>
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
                        <Ionicons name="trash-bin-outline" size={30} color="#DA4B46" />
                    </TouchableOpacity>
                    <Text style={webstyles.timeText}>{report.timeStamp}</Text>
                </View>
            </View>
        );
    })}
</ScrollView>
  
                  {/* Pagination Controls */}
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
  };
  }