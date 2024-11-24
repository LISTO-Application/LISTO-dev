import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Animated,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { webstyles } from "@/styles/webstyles"; // For web styles
import { db } from "../FirebaseConfig";
import { Timestamp } from "firebase/firestore";
import "firebase/database";
import { collection, getDocs } from "@react-native-firebase/firestore";
import SideBar from "@/components/SideBar";
import { styles } from "@/styles/styles";
interface Incident {
  coordinates: { _latitude: number; _longitude: number };
  date: Timestamp | string;
  type: string;
}

export default function ViewAdminEmergencyList({
  navigation,
}: {
  navigation: any;
}) {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        // Fetch the incidents collection from Firestore
        const incidentsSnapshot = await getDocs(collection(db, "incidents"));

        console.log("Fetched Incidents Snapshot:", incidentsSnapshot); // Debugging log

        if (incidentsSnapshot.empty) {
          console.log("No incidents found in Firestore.");
          return; // No incidents, so return early
        }

        // Map over the fetched documents and extract data
        const incidentsArray = incidentsSnapshot.docs.map((doc) => ({
          coordinates: doc.data().coordinates || {
            _latitude: 0,
            _longitude: 0,
          }, // Fallback if coordinates are not available
          date: doc.data().date || "No date", // Add fallback value
          type: doc.data().type || "No type", // Add fallback value
        }));

        console.log("Mapped Incidents:", incidentsArray); // Debugging log
        setIncidents(incidentsArray); // Update state with incidents
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    fetchIncidents(); // Fetch incidents when the component mounts
  }, []);

  // Helper function to format Firebase Timestamp to a string
  const formatDate = (timestamp: Timestamp | string): string => {
    if (typeof timestamp === "string") return timestamp; // If it's already a string
    const date = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date
    return date.toLocaleString(); // Format it as a readable string
  };

  // Helper function to format coordinates (latitude, longitude) into a string
  const formatCoordinates = (coordinates: {
    _latitude: number;
    _longitude: number;
  }): string => {
    return `Latitude: ${coordinates._latitude}, Longitude: ${coordinates._longitude}`;
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
          {reports.map((report) => (
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
          <Text style={webstyles.headerText}>Listed Distress Messeges</Text>

          <ScrollView
            contentContainerStyle={[
              webstyles.reportList,
              isAlignedRight && { width: "75%" },
            ]}
          >
            {incidents.length > 0 ? (
              incidents.map((incident, index) => (
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
                  {/* Title and Time Row */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#115272",
                      }}
                    >
                      {incident.type}
                    </Text>
                    <Text
                      style={{ color: "#115272", fontSize: 14, marginLeft: 10 }}
                    >
                      {formatDate(incident.date)}
                    </Text>
                  </View>
                  <Text
                    style={{ color: "#115272", fontSize: 14, marginTop: 10 }}
                  >
                    {formatCoordinates(incident.coordinates)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No incidents available.
              </Text>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}
