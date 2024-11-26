import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
  TextInput,
  Modal,
  FlatList,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
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
  setDoc,
} from "@react-native-firebase/firestore";
import SideBar from "@/components/SideBar";
import { doc, updateDoc } from "@react-native-firebase/firestore";

const database = db;

export default function ValidateReports({ navigation }: { navigation: any }) {
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [currentStatusSort, setCurrentStatusSort] = useState<
    "PENDING" | "VALID" | "PENALIZED"
  >("PENDING");
  const handleTitlePress = (report: Report) => {
    console.log("Navigating to details page for report:", report); // Debugging log
    navigation.navigate("ReportDetails", {
      id: report.id,
      title: report.title,
      category: report.category,
      status: report.status,
      additionalInfo: report.additionalInfo,
      image: report.image,
    });
  };
  const handleStatusChange = async (
    reportId: string,
    newStatus: "PENDING" | "VALID" | "PENALIZED"
  ) => {
    try {
      // Update the status of the report locally
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );

      const report = reports.find((r) => r.id === reportId);
      if (report) {
        const reportRef = doc(db, "reports", reportId);
        await updateDoc(reportRef, { status: newStatus });
        console.log(`Status updated to ${newStatus} for report ID ${reportId}`);

        if (newStatus === "VALID") {
          try {
            const newCrime = {
              ...report,
              status: "VALID",
            };
            console.log(newCrime);
            const crimeRef = collection(database, "crimes");
            await addDoc(crimeRef, newCrime);
            console.log(
              `Report ${report.id} transferred to incidents from ${report}`
            );
            setReports((prevReports) =>
              prevReports.filter((r) => r.id !== reportId)
            );

            // Re-sort the reports based on the new status
            setFilteredReports((prevReports) => {
              const sortedReports = [...prevReports].sort((a, b) => {
                const statusOrder = ["PENDING", "VALID", "PENALIZED"];
                return (
                  statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
                );
              });
              return sortedReports;
            });
            console.log(`Report ${report.id} removed from reports.`);
          } catch (error) {
            console.error("Error transferring report:", error);
          }
        }
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
            status: doc.data().status || "PENDING",
            timeStamp: doc.data().timeStamp || new Date().toISOString(),
          };
        });
        setReports(reportList);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const transferToCrimes = async (report: Report) => {};

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

  //Animation to Hide side bar
  const { width: screenWidth } = Dimensions.get("window"); // Get the screen width
  const sidebarWidth = screenWidth * 0.25; // 25% of screen width
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sideBarPosition = useRef(new Animated.Value(-sidebarWidth)).current;
  const contentPosition = useRef(new Animated.Value(0)).current;
  const [isAlignedRight, setIsAlignedRight] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredReports, setFilteredReports] = useState<Report[]>(reports);
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
          <Text style={styles.headerText}>Listed Reports (ADMINS)</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {reports.map((report) => (
            <View key={report.id}>
              {/* Report content */}
              <View style={styles.reportContainer}>
                <View style={styles.reportIcon}>
                  <Ionicons
                    name={
                      report.title === "HOMICIDE" ? "alert-circle" : "alert"
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
                        title: report.title,
                        category: report.category,
                      })
                    }
                  >
                    <Text style={styles.reportTitle}>{report.title}</Text>
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
    const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null
    ); // State for selected category filter
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false); // State for category modal visibility
    const [isSortedAsc, setIsSortedAsc] = useState(true); // State for sorting direction
    const [filteredReports, setFilteredReports] = useState<Report[]>([]); // Add this state for filtered reports

    useEffect(() => {
      const fetchReports = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "reports"));
          const reportList = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              icon: data.icon || "",
              category: data.category || "Unknown",
              title: data.title || "Untitled",
              additionalInfo: data.additionalInfo || "Unknown Report",
              location: data.location || "Unknown Location",
              name: data.name || "Anonymous",
              date: data.date || new Date().toDateString(),
              time: data.time || new Date().toTimeString(),
              image: {
                filename: data.image?.filename || "Unknown Filename",
                uri: data.image?.uri || "Unknown Uri",
              },
              status: data.status || "PENDING",
              timeStamp: data.timeStamp || new Date().toISOString(),
            };
          });
          setReports(reportList);
          setFilteredReports(reportList); // Initialize filteredReports with all reports initially
        } catch (error) {
          console.error("Error fetching reports:", error);
        }
      };

      fetchReports();
    }, []);

    // Handle search query change
    const handleSearch = (query: string) => {
      setSearchQuery(query); // Update search query state
      filterReports(query, selectedCategory); // Re-filter reports based on query and selected category
    };

    // Filter reports based on search query and selected category
    const filterReports = (searchQuery: string, category: string | null) => {
      let filtered = reports; // Start with all reports

      // Apply category filter if a category is selected
      if (category) {
        filtered = filtered.filter((report) => report.category === category);
      }

      // Apply search query filter if a query is provided
      if (searchQuery) {
        filtered = filtered.filter((report) => {
          const query = searchQuery.toLowerCase();
          return (
            report.title.toLowerCase().includes(query) ||
            report.location.toLowerCase().includes(query) ||
            report.category.toLowerCase().includes(query) ||
            report.date.toLowerCase().includes(query) ||
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

    // Clear category filter
    const handleClearFilter = () => {
      setSearchQuery(""); // Clear search query
      setSelectedCategory(null); // Clear selected category
      setFilteredReports(reports); // Show all reports again
    };

    // Get unique crime categories from reports
    const crimeCategories = Array.from(
      new Set(reports.map((report) => report.category))
    );

    // Sort reports by date (ascending/descending)
    const sortReportsByDate = () => {
      setFilteredReports((prevReports) => {
        const sortedReports = [...prevReports];
        sortedReports.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return isSortedAsc
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        });
        return sortedReports;
      });
      setIsSortedAsc((prev) => !prev); // Toggle sorting order
    };

    // Sort reports alphabetically by title
    const sortReportsByAlphabet = () => {
      setFilteredReports((prevReports) => {
        const sortedReports = [...prevReports].sort((a, b) => {
          return a.title.localeCompare(b.title); // Sort by title alphabetically
        });
        return sortedReports;
      });
    };

    const sortReportsByStatus = () => {
      // Cycle through status types
      const nextStatus =
        currentStatusSort === "PENDING"
          ? "VALID"
          : currentStatusSort === "VALID"
            ? "PENALIZED"
            : "PENDING";

      setCurrentStatusSort(nextStatus); // Update the state to the next status

      // Sort the reports based on the new status
      setFilteredReports((prevReports) => {
        const sortedReports = [...prevReports].sort((a, b) => {
          const statusOrder = ["PENDING", "VALID", "PENALIZED"];
          // Sort reports by the status order
          return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });
        return sortedReports;
      });
    };
    return (
      <View style={webstyles.container}>
        <SideBar sideBarPosition={sideBarPosition} navigation={navigation} />
        <TouchableOpacity
          onPress={toggleSideBar}
          style={[
            webstyles.toggleButton,
            { left: isSidebarVisible ? sidebarWidth : 10 },
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text style={[webstyles.headerText, { marginRight: 10 }]}>
              Listed Reports
            </Text>
            <TextInput
              style={{
                width: 200,
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
              paddingHorizontal: 25,
            }}
          >
            <TouchableOpacity onPress={sortReportsByDate}>
              <Text style={webstyles.sortButtonText}>
                {isSortedAsc
                  ? "Sort by Date (Latest)"
                  : "Sort by Date (Earliest)"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={sortReportsByAlphabet}>
              <Text style={webstyles.sortButtonText}>Sort by Alphabet</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCategoryModalVisible(true)}>
              <Text style={webstyles.sortButtonText}>
                Sort by Crime Category
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={sortReportsByStatus}>
              <Text style={webstyles.sortButtonText}>
                Sort by Report Status ({currentStatusSort})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category Modal */}
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
                  <Button
                    title="Clear Filter"
                    onPress={handleClearFilter}
                    color="#dc3545"
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <ScrollView contentContainerStyle={webstyles.reportList}>
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <View
                  key={report.id}
                  style={{
                    marginBottom: 20,
                    padding: 15,
                    borderRadius: 8,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {/* Title and Time Row */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => handleTitlePress(report)}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#115272",
                        }}
                      >
                        {report.title}
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{ color: "#115272", fontSize: 14, marginLeft: 10 }}
                    >
                      {report.time} &nbsp; {report.date}
                    </Text>
                  </View>

                  {/* Report Category */}
                  <Text style={{ color: "#115272", marginTop: 5 }}>
                    {`Category: ${report.category}`}
                  </Text>

                  {/* Report Location */}
                  <Text style={{ color: "#115272", marginTop: 5 }}>
                    {`Location: ${report.location || "Not provided"}`}
                  </Text>

                  {/* Action Buttons */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    {report.status === "PENDING" ? (
                      <>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#28a745",
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                            marginLeft: 5,
                          }}
                          onPress={() => handleStatusChange(report.id, "VALID")}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 20,
                              textAlign: "center",
                            }}
                          >
                            Validate
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#dc3545",
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                            marginLeft: 5,
                          }}
                          onPress={() =>
                            handleStatusChange(report.id, "PENALIZED")
                          }
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 20,
                              textAlign: "center",
                            }}
                          >
                            Penalize
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Text
                        style={{
                          color:
                            report.status === "VALID"
                              ? "#28a745"
                              : report.status === "PENALIZED"
                                ? "#dc3545"
                                : "#6c757d",
                          fontWeight: "bold",
                          fontSize: 20,
                          textAlign: "right",
                        }}
                      >
                        {report.status === "VALID" ? "Valid" : "Penalized"}
                      </Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No reports available.
              </Text>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}
