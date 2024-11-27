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
import { getIconName } from "../../assets/utils/getIconName";
import { initializeApp } from "firebase/app";
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
import DropDownPicker from "react-native-dropdown-picker";

export default function ViewReports({ navigation }: { navigation: any }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [currentStatusSort, setCurrentStatusSort] = useState<
    "PENDING" | "VALID" | "PENALIZED"
  >("PENDING");
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

  const [currentPage, setCurrentPage] = useState(1);
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
    const [isSortedAlphabetAsc, setIsSortedAlphabetAsc] = useState(true);
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
            report.status.toLowerCase().includes(query) ||
            report.additionalInfo.toLowerCase().includes(query) ||
            report.date.includes(query)
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
    const sortReportsByAlphabetDesc = () => {
      setFilteredReports((prevReports) => {
        const sortedReports = [...prevReports].sort((a, b) => {
          return b.title.localeCompare(a.title); // Sort Z to A
        });
        return sortedReports;
      });
      setIsSortedAlphabetAsc((prev) => !prev); // Toggle the sorting order
    };
    const sortReportsByAlphabetAsc = () => {
      setFilteredReports((prevReports) => {
        const sortedReports = [...prevReports].sort((a, b) => {
          return a.title.localeCompare(b.title); // Sort A to Z
        });
        return sortedReports;
      });
      setIsSortedAlphabetAsc((prev) => !prev); // Toggle the sorting order
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
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 10; // Adjust this number based on how many reports per page

    // Calculate total pages
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

    // Get the reports for the current page

    // Pagination functions
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
    const currentReports = filteredReports.slice(
      (currentPage - 1) * reportsPerPage,
      currentPage * reportsPerPage
    );

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
        case 'status':
          sortReportsByStatus(); // Call the sort function when "Sort by Status" is selected
          break;
        case 'category':
          setCategoryModalVisible(true); // Show category modal
          break;
        default:
          break;
      }
      console.log(selectedValue);
    };

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
          {/* Header Component */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start", // Makes sure the header and search bar are spaced
              marginBottom: 10, // Space between this row and the rest of the content
              paddingLeft: 20,
            }}
          >
            <Text style={[webstyles.headerText, { marginRight: 10 }]}>
              Reports
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
                style={{
                  width: 300, // Set a fixed width for the search bar
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 8,
                  padding: 10,
                }}
                placeholder="Search reports..."
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <View style={{ alignSelf: "center", left: -40 }}>
                <Ionicons name={"search-outline"} size={24} />
              </View>
            </View>
            <View
              style={[
                {
                  alignSelf: "flex-end",
                  paddingRight: 20,
                  width: "18%",
                },
                isAlignedRight && {
                  left: -450,
                },
              ]}
            >
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

          {/* Crime Category Modal */}
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
                  <Pressable
                    onPress={handleClearFilter}
                    style={{
                      height: 30,
                      width: "50%",
                      alignSelf: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#dc3545",
                        width: "100%",
                        flex: 1,
                        justifyContent: "center",
                        height: "100%",
                        borderRadius: 50,
                      }}
                    >
                      {" "}
                      <Text
                        style={{
                          alignSelf: "center",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        Clear Filter
                      </Text>
                    </View>
                  </Pressable>
                  {/* Clear Filter Component */}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Reports List */}
          <ScrollView
            contentContainerStyle={[
              webstyles.reportList,
              isAlignedRight && { width: "75%" },
            ]}
          >
            {currentReports.map((report) => {
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
                      <Text style={[webstyles.reportInfo, { marginLeft: 20 }]}>
                        {report.title.charAt(0).toUpperCase() +
                          report.title.slice(1)}
                      </Text>
                      <Text style={[webstyles.reportInfo]}>
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
              );
            })}
          </ScrollView>

          {/* Pagination Controls */}
          <View
            style={[
              webstyles.paginationContainer,
              isAlignedRight && { width: "75%" },
            ]}
          >
            <TouchableOpacity
              disabled={currentPage === 1}
              onPress={handlePreviousPage}
              style={webstyles.paginationButton}
            >
              <Text style={webstyles.paginationText}>Previous</Text>
            </TouchableOpacity>
            <Text style={webstyles.paginationText}>
              Page {currentPage} of {totalPages}
            </Text>
            <TouchableOpacity
              disabled={currentPage === totalPages}
              onPress={handleNextPage}
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
