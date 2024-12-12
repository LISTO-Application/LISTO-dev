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
import { db } from "@/app/FirebaseConfig";
import { Timestamp, updateDoc } from "@react-native-firebase/firestore";
import { GeoPoint as FirestoreGeoPoint, GeoPoint } from "firebase/firestore";
import "firebase/database";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  onSnapshot,
  firebase,
} from "@react-native-firebase/firestore";
import SideBar from "@/components/SideBar";
import { styles } from "@/styles/styles";
import TitleCard from "@/components/TitleCard";
import SearchSort from "@/components/SearchSort";
import { Report } from "../../../constants/data/reports";
import PaginationReport from "@/components/PaginationReport";
import { format, formatDate } from "date-fns";
import dayjs, { Dayjs } from "dayjs";
import * as XLSX from "xlsx";
import * as DocumentPicker from "expo-document-picker"; // For mobile file selection
import { v4 as uuidv4 } from "uuid";
import { crimeImages, CrimeType } from "../../../constants/data/marker";
import { Asset } from "expo-asset";
import { authWeb, dbWeb } from "@/app/(auth)";
import { Distress } from "@/constants/data/distress";

export default function ViewDistress() {
  const [distress, setDistress] = useState<Distress[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [filteredReports, setFilteredReports] = useState<Distress[]>([]);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const distressCollectionRef = collection(db, "distress");
      const distressSnapshot = await getDocs(distressCollectionRef);

      if (distressSnapshot.empty) {
        console.log("No incidents found in Firestore.");
        return;
      }

      // Process records from Firestore without geocoding.
      const distressArray = distressSnapshot.docs.map((doc) => {
        const data = doc.data();

        // Handle GeoPoint or plain object coordinates
        let coordinate = data.location;
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
          acknowledged: data.acknowledged,
          addInfo: data.addInfo || "No additional info",
          barangay: data.barangay,
          emergencyType: {
            crime: data.emergencyType.crime,
            fire: data.emergencyType.fire,
            injury: data.emergencyType.injury,
          },
          location: coordinate,
          timestamp: data.timestamp,
        };
      });

      console.log("Mapped Incidents:", distressArray);
      setDistress(distressArray);
      setFilteredReports(distressArray);
    } catch (error) {
      console.error("Error fetching incidents:", error);
    }
  };

  const geocodeAddress = async (
    address: string
  ): Promise<FirestoreGeoPoint | null> => {
    if (!address || address.trim() === "") {
      console.warn("Empty or invalid address provided.");
      return null;
    }

    const apiKey = "AIzaSyDoWF8JDzlhT2xjhuInBtMmkhWGXg2My0g"; // Replace with your API key
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&region=PH&key=${apiKey}`;

    console.log(`Geocoding request for address: ${address}`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          `Geocoding API request failed with status ${response.status}`
        );
        return null;
      }

      const data = await response.json();
      console.log("Geocoding API response:", data);

      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        console.log(
          `Geocoding succeeded, coordinates: Latitude ${lat}, Longitude ${lng}`
        );
        return new firebase.firestore.GeoPoint(lat, lng);
      } else {
        console.error("Geocoding failed or returned no results:", data);
        return null;
      }
    } catch (error) {
      console.error("Error occurred during geocoding:", error);
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
    if (period === "pm" && hour !== 12) {
      hour += 12;
    } else if (period === "am" && hour === 12) {
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
  // const handleImport = async () => {
  //   try {
  //     const result = await DocumentPicker.getDocumentAsync({
  //       type: [
  //         "text/csv",
  //         "application/vnd.ms-excel",
  //         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       ],
  //     });

  //     if (result.canceled) {
  //       console.log("File selection was canceled.");
  //       return;
  //     }

  //     const file = result.assets?.[0];
  //     if (!file?.uri) {
  //       console.error("No URI found for the selected file.");
  //       return;
  //     }

  //     const response = await fetch(file.uri);
  //     const data = await response.blob();
  //     const reader = new FileReader();

  //     reader.onload = async (event) => {
  //       const binaryData = event.target?.result;
  //       if (!binaryData) {
  //         console.error("Failed to read the file.");
  //         return;
  //       }

  //       const workbook = XLSX.read(binaryData, { type: "binary" });
  //       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //       const jsonData = XLSX.utils.sheet_to_json(worksheet);

  //       const importedReports = await Promise.all(
  //         jsonData.map(async (item: any) => {
  //           let timeOfCrime = item["Time of Crime"]
  //             ? parseTime(item["Time of Crime"])
  //             : null;
  //           let timeReported = item["Time Reported"]
  //             ? parseTime(item["Time Reported"])
  //             : null;

  //           if (!timeOfCrime) {
  //             timeOfCrime = new Date(); // Default to current time
  //             console.warn(
  //               "Time of Crime missing or invalid, using current time."
  //             );
  //           }

  //           if (!timeReported) {
  //             timeReported = new Date(); // Default to current time
  //             console.warn(
  //               "Time Report missing or invalid, using current time."
  //             );
  //           }

  //           let coordinate: FirestoreGeoPoint | null = null;
  //           const lat = item["Latitude"] ? parseFloat(item["Latitude"]) : null;
  //           const lng = item["Longitude"]
  //             ? parseFloat(item["Longitude"])
  //             : null;

  //           // Check if latitude and longitude exist in the file
  //           if (lat && lng) {
  //             coordinate = new FirestoreGeoPoint(lat, lng);
  //           } else if (item["Location"]) {
  //             // Geocode the address if coordinates aren't available
  //             coordinate = await geocodeAddress(item["Location"]);
  //           }

  //           if (!coordinate) {
  //             console.warn(
  //               "Geocoding failed or no coordinates provided, using default coordinates for Barangay Holy Spirit."
  //             );
  //             coordinate = new FirestoreGeoPoint(14.6522, 121.0633); // Default coordinates
  //           }

  //           // Log coordinate values for debugging
  //           console.log("Coordinates before formatting:", {
  //             latitude: coordinate.latitude,
  //             longitude: coordinate.longitude,
  //           });

  //           // Format the coordinates for display or usage

  //           // Convert the time to Firestore Timestamp
  //           const timestampOfCrime = Timestamp.fromMillis(
  //             timeOfCrime.getTime()
  //           );
  //           const timestampReported = Timestamp.fromMillis(
  //             timeReported.getTime()
  //           );

  //           const report = {
  //             uid: authWeb.currentUser?.uid,
  //             additionalInfo: item["Additional Info"] || "No additional info",
  //             category: item["Category"] || "Unknown",
  //             location: item["Location"] || "Unknown location",
  //             time: item["Time"] || "00:00",
  //             timeOfCrime: timestampOfCrime,
  //             timeReported: timestampReported,
  //             coordinate, // Store GeoPoint directly
  //           };

  //           console.log("Imported Report Details:", report);
  //           return report;
  //         })
  //       );

  //       console.log("Total Reports Imported: ", importedReports.length);
  //       console.log("Imported Reports: ", importedReports);

  //       const distressCollection = collection(db, "distress");

  //       try {
  //         const addDistressPromise = importedReports.map(async (report) => {
  //           console.log("Adding report to Firestore:", report);
  //           try {
  //             await addDoc(distressCollection, report);
  //           } catch (error) {
  //             console.error("Error adding report to Firestore:", error);
  //           }
  //         });

  //         await Promise.all(addDistressPromise);

  //         alert("Reports successfully added.");
  //         await fetchIncidents();
  //       } catch (error) {
  //         console.error("Error adding reports to Firestore:", error);
  //         alert("Failed to add reports. Please try again.");
  //       }
  //     };

  //     reader.readAsBinaryString(data);
  //   } catch (error) {
  //     console.error("Error during file import:", error);
  //     alert(
  //       "An error occurred during file import. Please check the file format."
  //     );
  //   }
  // };

  // Helper function to parse the date format in the CSV

  // const formatDate = (date: Date | null): string => {
  //   if (date && date._seconds) {
  //     date = dayjs(date._seconds * 1000);
  //   } else {
  //     date = dayjs(date, ["MM/DD/YYYY", "MM-DD-YYYY"], true);
  //   }
  //   return format(date.toLocaleString(), "yyyy-MM-dd");
  // };

  const getStatusStyle = (status: number) => {
    switch (status) {
      case 2:
        return { backgroundColor: "#115272", color: "red" };
      case 1:
        return { backgroundColor: "grey", color: "blue" };
      case 0:
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

  const handleDeleteRequest = async (reportId: string) => {
    setSelectedReportId(reportId);
    setDeleteModalVisible(true);
    if (selectedReportId !== null) {
      await readDistress(reportId);
    }
  };

  const readDistress = async (reportId: string) => {
    try {
      // Reference the specific document in the "distress" collection
      const reportRef = doc(db, "distress", reportId);
      console.log("deleting distress...", reportRef);
      // Delete the document
      await updateDoc(reportRef, { acknowledged: true });

      console.log(`Report with ID ${reportId} has been updated`);
    } catch (error) {
      console.error("Error updating distress:", error);
    }
  };

  // Import GeoPoint from Firebase Firestore

  //   const handleExport = () => {
  //     if (filteredReports.length === 0) {
  //       alert("No reports to export.");
  //       return;
  //     }

  //     // Prepare data for export
  //     const dataToExport = filteredReports.map((report, index) => {
  //       let formattedDate = "N/A"; // Default to N/A if date is invalid
  //       let date = report.timeOfCrime || null;
  //       if (date) {
  //         console.log(format(date, "yyyy-MM-dd"));
  //       } else {
  //         console.log("Date is null");
  //       }
  //       if (date) {
  //         if (typeof date === "object") {
  //           formattedDate = format(date, "yyyy-MM-dd");
  //         } else if (report.timeOfCrime instanceof Timestamp) {
  //           formattedDate = format(date, "yyyy-MM-dd");
  //         }
  //       }

  //       // Ensure report.coordinate is a GeoPoint
  //       let FirestoregeoPoint = report.coordinate;
  //       if (
  //         FirestoregeoPoint &&
  //         !(FirestoregeoPoint instanceof FirestoreGeoPoint)
  //       ) {
  //         FirestoregeoPoint = new FirestoreGeoPoint(
  //           FirestoregeoPoint.latitude,
  //           FirestoregeoPoint.longitude
  //         );
  //       }

  //       // Ensure the location is available or default to 'Unknown'
  //       const location = report.location || "Unknown";

  //       // Now geoPoint is guaranteed to be a GeoPoint
  //       return {
  //         "S. No.": index + 1,
  //         Category:
  //           report.category.charAt(0).toUpperCase() + report.category.slice(1),
  //         Date: formattedDate,
  //         Coordinates: FirestoregeoPoint
  //           ? `${FirestoregeoPoint.latitude}, ${FirestoregeoPoint.longitude}`
  //           : "N/A",
  //         Location: location,

  //         Description: report.additionalInfo || "N/A",
  //       };
  //     });

  //     // Ensure that the columns have proper headers and the data is in the correct format
  //     const headers = [
  //       "S. No.",
  //       "Category",
  //       "Date",
  //       "Coordinates",
  //       "Location",
  //       "Description",
  //     ];

  //     // Create a new worksheet with the provided data and header
  //     const worksheet = XLSX.utils.json_to_sheet(dataToExport, {
  //       header: headers,
  //     });

  //     // Automatically adjust column widths based on content
  //     const colWidths = headers.map((header) => {
  //       // Find the maximum length of content in each column and adjust width accordingly
  //       let maxLength = header.length;
  //       dataToExport.forEach((report: { [key: string]: any }) => {
  //         const cellValue = report[header];
  //         if (
  //           cellValue &&
  //           typeof cellValue === "string" &&
  //           cellValue.length > maxLength
  //         ) {
  //           maxLength = cellValue.length;
  //         } else if (
  //           typeof cellValue === "number" &&
  //           String(cellValue).length > maxLength
  //         ) {
  //           maxLength = String(cellValue).length;
  //         }
  //       });

  //       // Increase the width padding more significantly
  //       return { wch: maxLength + 100 }; // Increased padding for better readability
  //     });

  //     worksheet["!cols"] = colWidths; // Apply the column widths to the worksheet

  //     // Convert worksheet to CSV
  //     const csvData = XLSX.utils.sheet_to_csv(worksheet);

  //     // Trigger download of the CSV file
  //     const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  //     const url = URL.createObjectURL(blob);
  //     const generateFileName = () => {
  //       const now = new Date();
  //       const day = String(now.getDate()).padStart(2, "0");
  //       const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is 0-based
  //       const year = now.getFullYear();
  //       return `LISTO-crimes-${month}-${day}-${year}.csv`;
  //     };
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", generateFileName()); // Save as CSV
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   };

  //   interface Report {
  //     id: string;
  //     additionalInfo: string;
  //     category: string;
  //     coordinate: {
  //       latitude: number;
  //       longitude: number;
  //     };
  //     location: string;
  //     time: string;
  //     timeOfCrime: Date | null;
  //     timeReported: Date | null;
  //     unixTOC: number;
  //   }

  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  const currentReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  const distressType = Array.from(
    new Set(distress.map((report) => report.emergencyType))
  );

  //   const filterReports = (searchQuery: string, type: string | null) => {
  //     let filtered = distress;

  //     if (type) {
  //       filtered = filtered.filter(
  //         (distress: { type: string }) => distress.type === type
  //       );
  //     }

  //     if (searchQuery) {
  //       filtered = filtered.filter(
  //         (report: {
  //           time: any;
  //           location: string;
  //           category: string;
  //           timeOfCrime: any;
  //         }) => {
  //           const query = searchQuery.toLowerCase();
  //           const date = dayjs(report.timeOfCrime).format("YYYY-MM-DD");
  //           console.log(date);
  //           return (
  //             report.location.toLowerCase().includes(query) ||
  //             report.category.toLowerCase().includes(query) ||
  //             date.toLowerCase().includes(query)
  //           );
  //         }
  //       );
  //     }

  //     setFilteredReports(filtered); // Update the filtered reports state
  //   };
  // Handle category selection from the modal
  //   const handleCategorySelect = (category: string) => {
  //     setSelectedCategory(category); // Set the selected category
  //     setCategoryModalVisible(false); // Close the modal
  //     filterReports(searchQuery, category); // Apply the category filter along with the current search query
  //   };
  const [addresses, setAddresses] = useState<string[]>([]);

  const geocoder = new google.maps.Geocoder();

  function reverseGeocode(lat: any, lng: any, index: number) {
    const latLng = {
      lat,
      lng,
    };

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        console.log("Address: " + results[0].formatted_address);
        setAddresses((prev) => {
          const updated = [...prev];
          updated[index] = results[0].formatted_address;
          return updated;
        });
      } else {
        console.error("Geocode failed: " + status);
      }
    });
  }

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
          {crimes.map(
            (report: {
              id: React.Key | null | undefined;
              title:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | null
                | undefined;
              details:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | null
                | undefined;
              status:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | null
                | undefined;
            }) => (
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
                    <TouchableOpacity
                      onPress={() => handleTitlePress(report.id)}
                    >
                      <Text style={webstyles.reportTitle}>{report.title}</Text>
                    </TouchableOpacity>
                    <Text style={webstyles.reportDetails}>
                      {report.details}
                    </Text>
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
                      <Text style={webstyles.approvedButtonText}>
                        Validated
                      </Text>
                    </TouchableOpacity>
                  ) : report.status === "PENALIZED" ? (
                    <TouchableOpacity
                      style={webstyles.rejectedButton}
                      onPress={() => {
                        /* Optional: Add any action for rejected state */
                      }}
                    >
                      <Text style={webstyles.rejectedButtonText}>
                        Penalized
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            )
          )}
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
            reports={distress}
            setCategoryModalVisible={setCategoryModalVisible}
            setFilteredReports={setFilteredReports}
            isAlignedRight={isAlignedRight}
            // filterReports={filterReports}
            // handleExport={handleExport}
            // handleImport={handleImport}
            pickFile={() => {}} // Add appropriate function or state
            excelData={[]} // Add appropriate state
            uploading={false} // Add appropriate state
            uploadToFirestore={() => {}} // Add appropriate function
          />

          {/* <Modal
            visible={isCategoryModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setCategoryModalVisible(false)}
          >
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
          </Modal> */}
          <ScrollView
            contentContainerStyle={[
              webstyles.reportList,
              isAlignedRight && { width: "75%" },
            ]}
          >
            {currentReports.length > 0 ? (
              currentReports.map((incident, index) => {
                // Destructure coordinates (_lat, _long) from incident.coordinate
                const { latitude, longitude } = incident.location;
                const isValidCoordinate = latitude && longitude;
                if (isValidCoordinate && !addresses[index]) {
                  reverseGeocode(latitude, longitude, index);
                }

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
                          {incident.emergencyType.crime ? "Crime" : null}
                          {incident.emergencyType.fire ? "Fire" : null}
                          {incident.emergencyType.injury ? "Injury" : null}
                        </Text>
                        <Text
                          style={{
                            color: "#115272",
                            fontSize: 14,
                            marginLeft: 10, // Space between title and date
                          }}
                        ></Text>
                      </View>
                      <TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={() => setDeleteModalVisible(true)}
                      >
                        <Text style={{ color: "#DA4B46" }}>Unread</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Coordinates: Display both latitude/longitude and location */}
                    <Text
                      style={{ color: "#115272", fontSize: 14, marginTop: 10 }}
                    >
                      {/* Always display standard coordinates, even if invalid */}
                      {isValidCoordinate
                        ? `Latitude: ${latitude}, Longitude: ${longitude}`
                        : ""}
                    </Text>
                    <Text
                      style={{ color: "#115272", fontSize: 14, marginTop: 5 }}
                    >
                      {addresses[index] || "Fetching address..."}
                    </Text>

                    {/* Modal for delete confirmation */}
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
                                Do you acknowledge this report as read?
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
                                  onPress={() =>
                                    handleDeleteRequest(incident.id)
                                  } // Handle the confirm action here
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
