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
import * as XLSX from "xlsx";
import * as DocumentPicker from 'expo-document-picker'; // For mobile file selection
import { v4 as uuidv4 } from "uuid";
import { crimeImages, CrimeType } from "../(tabs)/data/marker";

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

    // Import GeoPoint from Firebase Firestore

    const handleExport = () => {
      if (filteredReports.length === 0) {
        alert("No reports to export.");
        return;
      }
    
      // Prepare data for export
      const dataToExport = filteredReports.map((report, index) => {
        let formattedDate = "N/A";  // Default to N/A if date is invalid
    
        // Handle date formatting
        if (report.date) {
          if (typeof report.date === "string" && report.date !== "###") {
            formattedDate = report.date;
          } else if (report.date instanceof Timestamp) {
            formattedDate = formatDate(report.date);
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
          "Category": report.category.charAt(0).toUpperCase() + report.category.slice(1),
          "Date": formattedDate,
          "Coordinates": geoPoint ? `${geoPoint.latitude}, ${geoPoint.longitude}` : "N/A",  // Show coordinates as string
          "Location": location,  // Add the location field here
          "Title": report.title || "N/A",  // Assuming there's a title field
          "Description": report.additionalInfo || "N/A",  // Assuming there's a description field
          "Status": report.status || "N/A",  // Assuming there's a status field
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
        "Status"
      ];
    
      // Create a new worksheet with the provided data and header
      const worksheet = XLSX.utils.json_to_sheet(dataToExport, { header: headers });
    
      // Automatically adjust column widths based on content
      const colWidths = headers.map(header => {
        // Find the maximum length of content in each column and adjust width accordingly
        let maxLength = header.length;
        dataToExport.forEach((report: { [key: string]: any }) => {
          const cellValue = report[header];
          if (cellValue && typeof cellValue === 'string' && cellValue.length > maxLength) {
            maxLength = cellValue.length;
          } else if (typeof cellValue === 'number' && String(cellValue).length > maxLength) {
            maxLength = String(cellValue).length;
          }
        });
        
        // Increase the width padding more significantly
        return { wch: maxLength + 100 };  // Increased padding for better readability
      });
    
      worksheet["!cols"] = colWidths;  // Apply the column widths to the worksheet
    
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
    icon: string;  // Icon is a string
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


  const handleImport = async () => {
    try {
      // Step 1: Pick a document using DocumentPicker
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      });
  
      // Handle cancellation
      if (result.canceled) {
        console.log('File selection was canceled.');
        return;
      }
  
      const file = result.assets?.[0]; // Access the first file if multiple are supported
      if (!file?.uri) {
        console.error('No URI found for the selected file.');
        return;
      }
  
      console.log('File selected:', file.name);
  
      // Step 2: Fetch the file and convert it to a blob
      const response = await fetch(file.uri);
      const data = await response.blob();
  
      // Step 3: Read the file using FileReader
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryData = event.target?.result;
        if (!binaryData) {
          console.error('Failed to read the file.');
          return;
        }
  
        // Step 4: Parse the binary data into a workbook
        const workbook = XLSX.read(binaryData, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
  
        // Step 5: Convert the worksheet data into JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        console.log('Parsed Data:', jsonData);
  
        // Step 6: Map the data to match the Report type
        const importedReports: Report[] = jsonData.map((item: any) => ({
          id: uuidv4(),
          category: item['Category'] || 'Unknown',
          date: item['Date'] || 'N/A',
          coordinate: {
            latitude: parseFloat(item['Latitude'] || '0'),
            longitude: parseFloat(item['Longitude'] || '0'),
          },
          icon: 'No Icon',
          title: item['Title'] || 'Untitled Report',
          additionalInfo: item['Additional Info'] || 'No additional info',
          location: item['Location'] || 'Unknown location',
          name: item['Name'] || 'Unknown name',
          time: item['Time'] || '00:00',
          image: item['Image'] || 'default-image-url',
          status: item['Status'] || 'Valid',
          timestamp: item['Timestamp'] || new Date().toISOString(),
        }));
  
        // Step 7: Update the state with the imported reports
        setCrimes((prevCrimes) => [...prevCrimes, ...importedReports]);
      };
  
      // Read the file data as binary string
      reader.readAsBinaryString(data);
    } catch (error) {
      console.error('Error during file import:', error);
      alert('An error occurred during file import.');
    }
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
          
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10 }}>
  <TouchableOpacity
     style={{
      backgroundColor: "#115272",
      paddingVertical: 12, // Increased padding
      paddingHorizontal: 20, // Increased padding
      borderRadius: 8, // Increased border radius for a more rounded button
      marginRight: 10, // Adjusted spacing between buttons
    }}
    onPress={handleExport} // Define your export logic here
  >
    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>Export</Text>
  </TouchableOpacity>

  <TouchableOpacity
     style={{
      backgroundColor: "#115272",
      paddingVertical: 12, // Increased padding
      paddingHorizontal: 20, // Increased padding
      borderRadius: 8, // Increased border radius for a more rounded button
      marginRight: 10, // Adjusted spacing between buttons
    }}
    onPress={handleImport} // Define your import logic here
  >
    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>Import</Text>
  </TouchableOpacity>
  <TouchableOpacity
  style={{
    backgroundColor: "#115272",
    paddingVertical: 12, // Increased padding
    paddingHorizontal: 20, // Increased padding
    borderRadius: 8, // Increased border radius for a more rounded button
    marginRight: 10, // Adjusted spacing between buttons
  }}
  onPress={() => {
    // Redirect to newAdminReports screen
    navigation.navigate("newAdminReports"); // Replace with the correct screen name if different
  }}
>
  <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>Add Crime Report</Text>
</TouchableOpacity>
</View>
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
