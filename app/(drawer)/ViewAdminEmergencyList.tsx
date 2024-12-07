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
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { webstyles } from "@/styles/webstyles"; // For web styles
import { db } from "../FirebaseConfig";
import { GeoPoint, Timestamp } from "@react-native-firebase/firestore";
import "firebase/database";
import { collection, getDocs, deleteDoc,doc, addDoc, onSnapshot} from "@react-native-firebase/firestore";
import SideBar from "@/components/SideBar";
import { styles } from "@/styles/styles";
import TitleCard from "@/components/TitleCard";
import SearchSort from "@/components/SearchSort";
import { Report } from "../(tabs)/data/reports";
import PaginationReport from "@/components/PaginationReport";
import { format, formatDate } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import * as XLSX from "xlsx";
import * as DocumentPicker from "expo-document-picker"; // For mobile file selection
import { v4 as uuidv4 } from "uuid";
import { crimeImages, CrimeType } from "../(tabs)/data/marker";
import { Asset } from "expo-asset";

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



  const fetchIncidents = async () => {
    try {
      // Reference to the 'crimes' collection in Firestore
      const crimesCollectionRef = collection(db, "crimes");
  
      // Fetch documents from the 'crimes' collection
      const crimesSnapshot = await getDocs(crimesCollectionRef);
  
      if (crimesSnapshot.empty) {
        console.log("No incidents found in Firestore.");
        return; // Exit if no incidents are found
      }
  
      // Map over the documents and format them
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
  
      // Debugging log for mapped incidents
      console.log("Mapped Incidents:", crimesArray);
  
      // Update state with incidents
      setCrimes(crimesArray);
      setFilteredReports(crimesArray);
  
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };
  
  // Call the fetchIncidents function when the component mounts
  useEffect(() => {
    fetchIncidents();
  }, []); // Empty dependency array means this will run only once when the component mounts
  
  // Inside your handleImport function
  
  const handleImport = async () => {
    try {
      // Open file picker to select the document
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      });
  
      if (result.canceled) {
        console.log('File selection was canceled.');
        return;
      }
  
      // Get the selected file
      const file = result.assets?.[0];
      if (!file?.uri) {
        console.error('No URI found for the selected file.');
        return;
      }
  
      console.log('File selected:', file.name);
  
      // Fetch the file data
      const response = await fetch(file.uri);
      const data = await response.blob();
      console.log('File data fetched successfully.');
  
      // Read the file content
      const reader = new FileReader();
      reader.onload = async (event) => {
        const binaryData = event.target?.result;
        if (!binaryData) {
          console.error('Failed to read the file.');
          return;
        }
  
        console.log('File read successfully, parsing data...');
  
        // Parse the binary data into a workbook
        const workbook = XLSX.read(binaryData, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
        console.log('Parsed Data:', jsonData);
  
        // Map the data to the Report interface
        const importedReports: Report[] = jsonData.map((item: any) => {
          // Parsing logic for date and other fields...
          const rawDate = item['Date'] || '';
          let formattedDate = '';
          if (typeof rawDate === 'number') {
            const excelEpoch = new Date(Date.UTC(1900, 0, 1));
            const adjustedDate = new Date(excelEpoch.getTime() + (rawDate - 1 - 1) * 86400000);
            formattedDate = adjustedDate.toLocaleDateString('en-PH');
          } else if (typeof rawDate === 'string' && rawDate.trim()) {
            const dateParts = rawDate.split('/');
            if (dateParts.length === 3) {
              const formattedRawDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
              const parsedDate = new Date(formattedRawDate);
              if (!isNaN(parsedDate.getTime())) {
                const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
                const day = parsedDate.getDate().toString().padStart(2, '0');
                const year = parsedDate.getFullYear().toString().slice(2);
                formattedDate = `${month}/${day}/${year}`;
              } else {
                formattedDate = new Date().toLocaleDateString(); // Default if invalid
              }
            }
          }
  
          // Construct the report object
          const report = {
            id: uuidv4(),
            category: item['Category'] || 'Unknown',
            date: formattedDate,
            coordinate: {
              latitude: parseFloat(item['Latitude'] || '0'),
              longitude: parseFloat(item['Longitude'] || '0'),
            },
            icon: 'No Icon',
            title: item['Title'] || 'Untitled Report',
            additionalInfo: item['Additional Info'] || 'No additional info',
            location: item['Location'] || 'Unknown location',
            name: item['Name'] || 'Unknown name',
            time: item['Time'] || '',
            image: {
              filename: item['Image Filename'] || 'default.png',
              uri: item['Image URI'] || 'default-image-url',
            },
            status: item['Status'] || 'Valid',
          };
  
          console.log('Mapped Report:', report);
          return report;
        });
  
        // Add reports to Firestore
        const crimesCollection = collection(db, 'crimes');
        try {
          for (const report of importedReports) {
            await addDoc(crimesCollection, report); // Add each report to Firestore
          }
          console.log('Reports successfully added to Firestore.');
          alert('Reports successfully added.');
  
          // Fetch the updated list of incidents after adding the reports
          await fetchIncidents(); // Ensure this waits until the reports are added
        } catch (error) {
          console.error('Error adding reports to Firestore:', error);
          alert('Failed to add reports. Please try again.');
        }
      };
  
      // Read the file as binary string
      reader.readAsBinaryString(data);
  
    } catch (error) {
      console.error('Error during file import:', error);
      alert('An error occurred during file import. Please check the file format.');
    }
  };
  

  // const formatDate = (date: Date | null): string => {
  //   if (date && date._seconds) {
  //     date = dayjs(date._seconds * 1000);
  //   } else {
  //     date = dayjs(date, ["MM/DD/YYYY", "MM-DD-YYYY"], true);
  //   }
  //   return format(date.toLocaleString(), "yyyy-MM-dd");
  // };

  const formatCoordinates = (
    coordinates: GeoPoint | { latitude: number; longitude: number }
  ): string => {
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

  // Import GeoPoint from Firebase Firestore

  const handleExport = () => {
    if (filteredReports.length === 0) {
      alert("No reports to export.");
      return;
    }

    // Prepare data for export
    const dataToExport = filteredReports.map((report, index) => {
      let formattedDate = "N/A"; // Default to N/A if date is invalid
      let date = report.date;
      console.log(format(date, "yyyy-MM-dd"));
      if (date) {
        if (typeof date === "object") {
          formattedDate = format(date, "yyyy-MM-dd");
        } else if (report.date instanceof Timestamp) {
          formattedDate = format(date, "yyyy-MM-dd");
        }
      }

      // Ensure report.coordinate is a GeoPoint
      let geoPoint = report.coordinate;
      if (geoPoint && !(geoPoint instanceof GeoPoint)) {
        geoPoint = new GeoPoint(geoPoint.latitude, geoPoint.longitude);
      }

      // Ensure the location is available or default to 'Unknown'
      const location = report.location || "Unknown";

      // Now geoPoint is guaranteed to be a GeoPoint
      return {
        "S. No.": index + 1,
        Category:
          report.category.charAt(0).toUpperCase() + report.category.slice(1),
        Date: formattedDate,
        Coordinates: geoPoint
          ? `${geoPoint.latitude}, ${geoPoint.longitude}`
          : "N/A", // Show coordinates as string
        Location: location, // Add the location field here
        Title: report.title || "N/A", // Assuming there's a title field
        Description: report.additionalInfo || "N/A", // Assuming there's a description field
        Status: report.status || "N/A", // Assuming there's a status field
      };
    });

    // Ensure that the columns have proper headers and the data is in the correct format
    const headers = [
      "S. No.",
      "Category",
      "Date",
      "Coordinates",
      "Location",
      "Title",
      "Description",
      "Status",
    ];

    // Create a new worksheet with the provided data and header
    const worksheet = XLSX.utils.json_to_sheet(dataToExport, {
      header: headers,
    });

    // Automatically adjust column widths based on content
    const colWidths = headers.map((header) => {
      // Find the maximum length of content in each column and adjust width accordingly
      let maxLength = header.length;
      dataToExport.forEach((report: { [key: string]: any }) => {
        const cellValue = report[header];
        if (
          cellValue &&
          typeof cellValue === "string" &&
          cellValue.length > maxLength
        ) {
          maxLength = cellValue.length;
        } else if (
          typeof cellValue === "number" &&
          String(cellValue).length > maxLength
        ) {
          maxLength = String(cellValue).length;
        }
      });

      // Increase the width padding more significantly
      return { wch: maxLength + 100 }; // Increased padding for better readability
    });

    worksheet["!cols"] = colWidths; // Apply the column widths to the worksheet

    // Convert worksheet to CSV
    const csvData = XLSX.utils.sheet_to_csv(worksheet);

    // Trigger download of the CSV file
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "FilteredReports.csv"); // Save as CSV
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  interface Report {
    id: string;
    category: string;
    date: string | Date;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    icon: string; // Icon is a string
    title: string;
    location: string;
    name: string;
    time: string | Date;
    image: {
      filename: string;
      uri: string;
    };
    status: string;
    timestamp: number;
    additionalInfo: string;
  }
  
 
  
  
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  const currentReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  const crimeCategories = Array.from(
    new Set(crimes.map((report) => report.category))
  );

  const filterReports = (searchQuery: string, category: string | null) => {
    let filtered = crimes;

    if (category) {
      filtered = filtered.filter(
        (report: { category: string }) => report.category === category
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((report) => {
        const query = searchQuery.toLowerCase();
        return (
          report.category.toLowerCase().includes(query) ||
          report.date.toString().includes(query)
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
            handleExport={handleExport}
            handleImport={handleImport}
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
              currentReports.map((incident, index) => {
                const date = incident.date;
                const formattedDate = format(date, "yyyy-MM-dd");
                return (
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
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Left side: Title and Date */}
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
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
                          {formattedDate}
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
                        <TouchableWithoutFeedback
                          onPress={() => setDeleteModalVisible(false)}
                        >
                          <View
                            style={[
                              webstyles.modalContainer,
                              { backgroundColor: "transparent" },
                            ]}
                          >
                            <TouchableWithoutFeedback>
                              <View style={webstyles.modalContent}>
                                <Text style={webstyles.modalHeader}>
                                  Confirm Read?
                                </Text>
                                <Text style={webstyles.modalText}>
                                  Do you acknowledge this
                                </Text>
                                <View style={webstyles.modalActions}>
                                  <TouchableOpacity
                                    style={[
                                      webstyles.modalButton,
                                      { backgroundColor: "#ccc" },
                                    ]}
                                    onPress={() => setDeleteModalVisible(false)}
                                  >
                                    <Text style={webstyles.modalButtonText}>
                                      Cancel
                                    </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    style={[
                                      webstyles.modalButton,
                                      { backgroundColor: "#DA4B46" },
                                    ]}
                                    onPress={() => setDeleteModalVisible(false)}
                                  >
                                    <Text style={webstyles.modalButtonText}>
                                      Confirm
                                    </Text>
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
                );
              })
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
