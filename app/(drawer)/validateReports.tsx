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
import { addDoc, collection, getDocs } from "@react-native-firebase/firestore";
import SideBar from "@/components/SideBar";
import { doc, updateDoc } from "@react-native-firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";
import ClearFilter from "@/components/ClearFilter";
import ValidateReportCard from "@/components/ValidateReportCard";

const database = db;

export default function ValidateReports({ navigation }: { navigation: any }) {
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [currentStatusSort, setCurrentStatusSort] = useState<
    "PENDING" | "VALID" | "PENALIZED"
  >("PENDING");
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // State for selected category filter
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false); // State for category modal visibility
  const [filteredReports, setFilteredReports] = useState<Report[]>([]); // Add this state for filtered reports
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

      // const reportRef = doc(db, "reports", reportId);
      // await updateDoc(reportRef, { status: newStatus });
      // console.log(`Status updated to ${newStatus} for report ID ${reportId}`);
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
  const sortReportsByDateAsc = () => {
    setFilteredReports((prevReports) => {
      const sortedReports = [...prevReports];
      sortedReports.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
      return sortedReports;
    });
    setIsSortedAsc((prev) => !prev); // Toggle sorting order
  };

  const sortReportsByDateDesc = () => {
    setFilteredReports((prevReports) => {
      const sortedReports = [...prevReports];
      sortedReports.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      return sortedReports;
    });
    setIsSortedAsc((prev) => !prev); // Toggle sorting order
  };

  // Sort reports alphabetically by title
  const sortReportsByAlphabetAsc = () => {
    setFilteredReports((prevReports) => {
      const sortedReports = [...prevReports].sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      return sortedReports;
    });
  };

  // Sort reports alphabetically by title
  const sortReportsByAlphabetDesc = () => {
    setFilteredReports((prevReports) => {
      const sortedReports = [...prevReports].sort((a, b) => {
        return b.title.localeCompare(a.title);
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

  //DropDown Sorter
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Sort by Date (Earliest)", value: "date-asc" },
    { label: "Sort by Date (Latest)", value: "date-desc" },
    { label: "Sort by Alphabet (A-Z)", value: "alphabet-asc" },
    { label: "Sort by Alphabet (Z-A)", value: "alphabet-desc" },
    { label: "Sort by Crime Category", value: "category" },
    { label: "Sort by Status", value: "status" },
  ]);

  const handleDropDownChange = (selectedValue: any) => {
    switch (selectedValue) {
      case "date-asc":
        sortReportsByDateAsc();
        break;
      case "date-desc":
        sortReportsByDateDesc();
        break;
      case "alphabet-asc":
        sortReportsByAlphabetAsc();
        break;
      case "alphabet-desc":
        sortReportsByAlphabetDesc();
        break;
      case "status":
        sortReportsByStatus(); // Call the sort function when "Sort by Status" is selected
        break;
      case "category":
        setCategoryModalVisible(true); // Show category modal
        break;
      default:
        break;
    }
    console.log(selectedValue);
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
          {/* Header Component */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
              paddingLeft: 20,
            }}
          >
            <Text style={[webstyles.headerText, { marginRight: 10 }]}>
              Listed Reports
            </Text>
          </View>
          {/* Search and Sort Component */}
          <View
            style={[
              {
                zIndex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 20,
              },
            ]}
          >
            <View style={{ flexDirection: "row" }}>
              <TextInput
                placeholder="Search reports..."
                value={searchQuery}
                onChangeText={handleSearch}
                style={{
                  width: 200,
                  borderWidth: 1,
                  borderColor: "#000",
                  borderRadius: 8,
                  padding: 8,
                }}
              />
              <View style={{ alignSelf: "center", left: -40 }}>
                <Ionicons name={"search-outline"} size={24} />
              </View>
            </View>
            <View
              style={[
                {
                  alignSelf: "flex-end",
                  paddingRight: 40,
                  width: "25%",
                  flexDirection: "row",
                  gap: 20,
                },
                isAlignedRight && {
                  left: -450,
                },
              ]}
            >
              <ClearFilter handleClearFilter={handleClearFilter} />
              <View style={{ width: "75%" }}>
                <DropDownPicker
                  multiple={false}
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setItems={setItems}
                  setValue={setValue}
                  onChangeValue={handleDropDownChange}
                  placeholder="Select a filter"
                />
              </View>
            </View>
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

          <ScrollView
            contentContainerStyle={[
              webstyles.reportList,
              isAlignedRight && { width: "75%" },
            ]}
          >
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
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
        </Animated.View>
      </View>
    );
  }
}
