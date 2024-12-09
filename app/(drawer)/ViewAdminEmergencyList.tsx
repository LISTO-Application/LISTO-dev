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
import { Timestamp } from "@react-native-firebase/firestore";
import { GeoPoint as FirestoreGeoPoint } from "firebase/firestore";
import "firebase/database";
import { collection, getDocs, deleteDoc,doc, addDoc, onSnapshot,firebase} from "@react-native-firebase/firestore";
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

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
  try {
    const crimesCollectionRef = collection(db, 'crimes');
    const crimesSnapshot = await getDocs(crimesCollectionRef);

    if (crimesSnapshot.empty) {
      console.log('No incidents found in Firestore.');
      return;
    }

    // Process records from Firestore without geocoding.
    const crimesArray = crimesSnapshot.docs.map((doc) => {
      const data = doc.data();
      
      // Handle GeoPoint or plain object coordinates
      let coordinate = data.coordinate;
      if (coordinate instanceof FirestoreGeoPoint) {
        // If the coordinate is a GeoPoint (Firestore GeoPoint)
        coordinate = {
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
        };
      } else {
        // If it's a plain object or not available, use default coordinates
        coordinate = coordinate || { latitude: 0, longitude: 0 };
      }

      return {
        id: doc.id,
        additionalInfo: data.additionalInfo || 'No additional info',
        category: data.category || 'Unknown',
        location: data.location || 'Unknown location',
        coordinate: coordinate,  // Updated coordinates based on GeoPoint or plain object
        time: data.time || '00:00',
        timeOfCrime: data.timeOfCrime instanceof Timestamp ? data.timeOfCrime.toDate() : new Date(data.timeOfCrime || null),
        timeReported: data.timeReported instanceof Timestamp ? data.timeReported.toDate() : new Date(data.timeReported || null),
        unixTOC: data.unixTOC || 0,
      };
    });

    console.log('Mapped Incidents:', crimesArray);
    setCrimes(crimesArray);
    setFilteredReports(crimesArray);
  } catch (error) {
    console.error('Error fetching incidents:', error);
  }
};

const geocodeAddress = async (address: string): Promise<FirestoreGeoPoint | null> => {
  if (!address || address.trim() === '') {
    console.warn('Empty or invalid address provided.');
    return null;
  }

  const apiKey = "AIzaSyBa31nHNFvIEsYo2D9NXjKmMYxT0lwE6W0"; // Replace with your API key
  const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&region=PH&key=${apiKey}`;

  console.log(`Geocoding request for address: ${address}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Geocoding API request failed with status ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log("Geocoding API response:", data);

    if (data.status === 'OK' && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      console.log(`Geocoding succeeded, coordinates: Latitude ${lat}, Longitude ${lng}`);
      return new firebase.firestore.GeoPoint(lat, lng);
    } else {
      console.error('Geocoding failed or returned no results:', data);
      return null;
    }
  } catch (error) {
    console.error('Error occurred during geocoding:', error);
    return null;
  }
};
  const parseTime = (timeString: string | null | undefined): Date => {
    // Check if the timeString is missing or null/undefined
    if (!timeString) {
      console.warn("Time of Crime missing, using current time.");
      return new Date(); // Return the current time
    }
  
    // Clean up the time string to handle spaces and case-insensitive matching
    const cleanedTimeString = timeString.trim().toLowerCase();
  
    // Regex for 12/25/2024 12:30 pm format (handles space between time and am/pm)
    const regex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{1,2}):(\d{2})\s*(am|pm)$/i;
    const match = cleanedTimeString.match(regex);
  
    if (!match) {
      console.warn(`Invalid time format: ${timeString}, using current time.`);
      return new Date(); // Return the current time if the format is invalid
    }
  
    // Extract date components from matched groups
    const month = parseInt(match[1], 10) - 1; // JavaScript months are 0-based
    const day = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    let hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);
    const period = match[6]; // 'am' or 'pm'
  
    // Adjust the hour for 12-hour format (AM/PM)
    if (period === 'pm' && hour !== 12) {
      hour += 12;
    } else if (period === 'am' && hour === 12) {
      hour = 0; // Midnight case
    }
  
    // Create a Date object using the parsed values
    const date = new Date(year, month, day, hour, minute, 0, 0);
  
    // Check for invalid date
    if (isNaN(date.getTime())) {
      console.warn(`Invalid time format: ${timeString}, using current time.`);
      return new Date(); // Return the current time if the date is invalid
    }
  
    // Convert to UTC and apply Philippine Standard Time (PST) offset
    const utcDate = new Date(date.toUTCString());
    const phOffset = 8 * 60; // Philippines is UTC +8
    utcDate.setMinutes(utcDate.getMinutes() + phOffset);
  
    return utcDate;
  };

  
  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
      });
  
      if (result.canceled) {
        console.log('File selection was canceled.');
        return;
      }
  
      const file = result.assets?.[0];
      if (!file?.uri) {
        console.error('No URI found for the selected file.');
        return;
      }
  
      const response = await fetch(file.uri);
      const data = await response.blob();
      const reader = new FileReader();
  
      reader.onload = async (event) => {
        const binaryData = event.target?.result;
        if (!binaryData) {
          console.error('Failed to read the file.');
          return;
        }
  
        const workbook = XLSX.read(binaryData, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
        const importedReports = await Promise.all(
          jsonData.map(async (item: any) => {
            // Validation for required fields
            const requiredFields = ['Category', 'Title', 'Additional Info', 'Location', 'Time', 'Time of Crime', 'Time Reported'];
            const missingFields = requiredFields.filter((field) => !item[field]);
  
            if (missingFields.length > 0) {
              console.warn(`Missing required fields: ${missingFields.join(', ')}`);
              return null; // Skip this report
            }
  
            let timeOfCrime = item['Time of Crime'] ? parseTime(item['Time of Crime']) : null;
            let timeReported = item['Time Reported'] ? parseTime(item['Time Reported']) : null;
  
            if (!timeOfCrime) {
              timeOfCrime = new Date(); // Default to current time
              console.warn('Time of Crime missing or invalid, using current time.');
            }
  
            if (!timeReported) {
              timeReported = new Date(); // Default to current time
              console.warn('Time Report missing or invalid, using current time.');
            }
  
            let coordinate: FirestoreGeoPoint | null = null;
            const lat = item['Latitude'] ? parseFloat(item['Latitude']) : null;
            const lng = item['Longitude'] ? parseFloat(item['Longitude']) : null;
  
            // Check if latitude and longitude exist in the file
            if (lat && lng) {
              coordinate = new FirestoreGeoPoint(lat, lng);
            } else if (item['Location']) {
              // Geocode the address if coordinates aren't available
              coordinate = await geocodeAddress(item['Location']);
            }
  
            if (!coordinate) {
              console.warn(
                'Geocoding failed or no coordinates provided, using default coordinates for Barangay Holy Spirit.'
              );
              coordinate = new FirestoreGeoPoint(14.6522, 121.0633); // Default coordinates
            }
  
            // Convert the time to Firestore Timestamp
            const timestampOfCrime = Timestamp.fromMillis(timeOfCrime.getTime());
            const timestampReported = Timestamp.fromMillis(timeReported.getTime());
  
            const report = {
              id: uuidv4(),
              additionalInfo: item['Additional Info'],
              category: item['Category'],
              title: item['Title'],
              location: item['Location'],
              time: item['Time'],
              timeOfCrime: timestampOfCrime,
              timeReported: timestampReported,
              coordinate, // Store GeoPoint directly
            };
  
            console.log('Imported Report Details:', report);
            return report;
          })
        );
  
        const validReports = importedReports.filter(Boolean); // Filter out invalid reports
        console.log('Total Reports Imported: ', validReports.length);
        console.log('Imported Reports: ', validReports);
  
        const crimesCollection = collection(db, 'crimes');
  
        try {
          const addReportsPromises = validReports.map(async (report) => {
            console.log('Adding report to Firestore:', report);
            try {
              await addDoc(crimesCollection, report);
            } catch (error) {
              console.error('Error adding report to Firestore:', error);
            }
          });
  
          await Promise.all(addReportsPromises);
  
          alert('Reports successfully added.');
          await fetchIncidents();
        } catch (error) {
          console.error('Error adding reports to Firestore:', error);
          alert('Failed to add reports. Please try again.');
        }
      };
  
      reader.readAsBinaryString(data);
    } catch (error) {
      console.error('Error during file import:', error);
      alert('An error occurred during file import. Please check the file format.');
    }
  };
  
  
  // Helper function to parse the date format in the CSV
  
  
  
  // const formatDate = (date: Date | null): string => {
  //   if (date && date._seconds) {
  //     date = dayjs(date._seconds * 1000);
  //   } else {
  //     date = dayjs(date, ["MM/DD/YYYY", "MM-DD-YYYY"], true);
  //   }
  //   return format(date.toLocaleString(), "yyyy-MM-dd");
  // };
 

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
    // Validate if there are any reports to export
    if (!filteredReports || filteredReports.length === 0) {
      alert("No reports to export.");
      return;
    }
  
    // Prepare data for export
    const dataToExport = filteredReports.map((report, index) => {
      // Validate and format the date
      let formattedDate = "N/A"; // Default to N/A if date is invalid
      let date = report.timeOfCrime || null;
      if (date) {
        try {
          if (typeof date === "object") {
            formattedDate = format(date, "yyyy-MM-dd");
          } else if (report.timeOfCrime instanceof Timestamp) {
            formattedDate = format(report.timeOfCrime.toDate(), "yyyy-MM-dd");
          }
        } catch (error) {
          console.error("Error formatting date:", error);
          formattedDate = "Invalid Date";
        }
      }
  
      // Validate and format the coordinates
      let FirestoregeoPoint = report.coordinate || null;
      if (FirestoregeoPoint) {
        try {
          if (
            !(FirestoregeoPoint instanceof FirestoreGeoPoint) &&
            FirestoregeoPoint.latitude !== undefined &&
            FirestoregeoPoint.longitude !== undefined
          ) {
            FirestoregeoPoint = new FirestoreGeoPoint(
              FirestoregeoPoint.latitude,
              FirestoregeoPoint.longitude
            );
          }
        } catch (error) {
          console.error("Error processing GeoPoint:", error);
          FirestoregeoPoint = { latitude: 0, longitude: 0 };
        }
      }
  
      // Validate the location field
      const location =
        report.location && typeof report.location === "string"
          ? report.location
          : "Unknown";
  
      // Capitalize category field
      const category =
        report.category && typeof report.category === "string"
          ? report.category.charAt(0).toUpperCase() + report.category.slice(1)
          : "Uncategorized";
  
      // Validate description field
      const description =
        report.additionalInfo && typeof report.additionalInfo === "string"
          ? report.additionalInfo
          : "N/A";
  
      // Ensure each report object is properly structured
      return {
        "S. No.": index + 1,
        Category: category,
        Date: formattedDate,
        Coordinates: FirestoregeoPoint
          ? `${FirestoregeoPoint.latitude}, ${FirestoregeoPoint.longitude}`
          : "N/A", // Show coordinates as string
        Location: location,
        Title: report.title || "Untitled",
        Description: description,
        Status: report.status || "Unknown", // Assuming there's a status field
      };
    });
  
    // Ensure the data array is not empty
    if (dataToExport.length === 0) {
      alert("No valid data available for export.");
      return;
    }
  
    // Define headers explicitly to ensure proper order
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
      let maxLength = header.length;
      dataToExport.forEach((report) => {
        const cellValue = report[header as keyof typeof report];
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
  
      return { wch: maxLength + 2 }; // Add padding for readability
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
    additionalInfo: string;
    category: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    location: string;
    time: string;
    timeOfCrime: Date | null;
    timeReported: Date | null;
    unixTOC: number;
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
          <View style={{ marginBottom: 10, paddingHorizontal: 15 }}>
  <Text style={{ fontSize: 14, color: "#DA4B46", fontWeight: "bold" }}>
    Reminder when importing:
  </Text>
  <Text style={{ fontSize: 14, color: "#333", marginTop: 5 }}>
    Ensure that the following fields are in the first row:
  </Text>
  <Text style={{ fontSize: 14, color: "#333", marginTop: 5 }}>
    <Text style={{ fontWeight: "bold" }}>Category</Text>, 
    <Text style={{ fontWeight: "bold" }}> Title</Text>, 
    <Text style={{ fontWeight: "bold" }}> Additional Info</Text>, 
    <Text style={{ fontWeight: "bold" }}> Time</Text>, 
    <Text style={{ fontWeight: "bold" }}> Time of Crime</Text>, and 
    <Text style={{ fontWeight: "bold" }}> Time Reported</Text>.
  </Text>
  <Text style={{ fontSize: 14, color: "#333", marginTop: 5 }}>
    <Text style={{ fontWeight: "bold" }}>Note:</Text> Time of Crime and Time Reported must follow this format: 
    <Text style={{ fontWeight: "bold", color: "#DA4B46" }}> MM/DD/YYYY HH:mm AM/PM</Text> 
    (e.g., <Text style={{ fontStyle: "italic" }}>12/25/2024 12:30 PM</Text>).
  </Text>
</View>
          <SearchSort
            reports={crimes}
            setCategoryModalVisible={setCategoryModalVisible}
            setFilteredReports={setFilteredReports}
            isAlignedRight={isAlignedRight}
            filterReports={filterReports}
            handleExport={handleExport}
            handleImport={handleImport}
            pickFile={() => {}} // Add appropriate function or state
            excelData={[]} // Add appropriate state
            uploading={false} // Add appropriate state
            uploadToFirestore={() => {}} // Add appropriate function
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
      // Destructure coordinates (_lat, _long) from incident.coordinate
      const { latitude, longitude } = incident.coordinate;
      const isValidCoordinate = latitude && longitude;

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
          {/* Title, Date, and Unread Button */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Left side: Title and Date */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#115272",
                }}
              >
                {incident.category.charAt(0).toUpperCase() + incident.category.slice(1)}
              </Text>
              <Text
                style={{
                  color: "#115272",
                  fontSize: 14,
                  marginLeft: 10, // Space between title and date
                }}
              >
                {format(new Date(incident.timeOfCrime || new Date()), "yyyy-MM-dd")}
              </Text>
            </View>
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={() => setDeleteModalVisible(true)}
            >
              <Text style={{ color: "#DA4B46" }}>Unread</Text>
            </TouchableOpacity>
          </View>

          {/* Coordinates: Display both latitude/longitude and location */}
          <Text style={{ color: "#115272", fontSize: 14, marginTop: 10 }}>
            {/* Always display standard coordinates, even if invalid */}
            {isValidCoordinate
              ? `Latitude: ${latitude}, Longitude: ${longitude}`
              : ""}
          </Text>
          <Text style={{ color: "#115272", fontSize: 14, marginTop: 5 }}>
            {/* Display location if available */}
            {incident.location ? `Location: ${incident.location}` : "Location not provided"}
          </Text>

          {/* Modal for delete confirmation */}
          <Modal
            visible={isDeleteModalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setDeleteModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
              <View
                style={[
                  webstyles.modalContainer,
                  { backgroundColor: "transparent" },
                ]}
              >
                <TouchableWithoutFeedback>
                  <View style={webstyles.modalContent}>
                    <Text style={webstyles.modalHeader}>Confirm Read?</Text>
                    <Text style={webstyles.modalText}>
                      Do you acknowledge this report as read?
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
                        onPress={() => handleDeleteRequest(incident.id)} // Handle the confirm action here
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
        <TouchableOpacity
          style={webstyles.fab}
          onPress={() => navigation.navigate("newAdminReports")}
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
              Add a crime
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
