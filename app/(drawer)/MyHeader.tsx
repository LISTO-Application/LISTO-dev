import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { db } from "../FirebaseConfig"; // Ensure this is importing from the correct file
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "@react-native-firebase/firestore";
import MapView, { Marker } from "react-native-maps";
// TypeScript Types
import { DrawerNavigationProp } from "@react-navigation/drawer";

// Component Imports
import { ThemedButton } from "@/components/ThemedButton";

// Type for Navigation
type DrawerParamList = {
  emergency: undefined;
  index: undefined;
  "[id]": undefined;
  Custom: undefined;
};

type CustomNavigatorProps = {
  navigation: DrawerNavigationProp<DrawerParamList>;
};

const MyHeader: React.FC<CustomNavigatorProps> = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [newReportsCount, setNewReportsCount] = useState(0);
  const [reportTitles, setReportTitles] = useState<string[]>([]);
  const [exclamationModalVisible, setExclamationModalVisible] = useState(false);
  const [distressMessagesCount, setDistressMessagesCount] = useState(0);
  const [distressMessagesDetails, setDistressMessagesDetails] = useState<
    {
      emergencyType: string;
      addInfo: string;
      location: { latitude: number; longitude: number };
      timestamp: Date;
    }[]
  >([]);

  const [mapModalVisible, setMapModalVisible] = useState(false); // State for map modal visibility
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const quezonCityRegion = {
    latitude: 14.5995, // Quezon City's latitude
    longitude: 121.0394, // Quezon City's longitude
    latitudeDelta: 0.0001, // Adjust the zoom level to suit your needs
    longitudeDelta: 0.0001,
  };

  const handleRegionChange = (region: any) => {
    const { latitude, longitude } = quezonCityRegion;
    const delta = 0.01;

    // Lock the map region to QC only
    if (
      region.latitude < latitude - delta ||
      region.latitude > latitude + delta ||
      region.longitude < longitude - delta ||
      region.longitude > longitude + delta
    ) {
      // If user moves outside QC, reset the region back to QC center
      region.latitude = latitude;
      region.longitude = longitude;
    }
  };

  // Fetch the count and titles of new reports whenever the component mounts or updates
  useEffect(() => {
    const reportsCollection = collection(db, "reports");
    const q = query(reportsCollection, where("status", "==", "PENDING"));
    const fetchReports = async () => {
      try {
        const snapshot = await getDocs(q);
        setNewReportsCount(snapshot.size);
        const titles: string[] = snapshot.docs.map((doc) => doc.data().title);
        setReportTitles(titles);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  useEffect(() => {
    const distressCollection = collection(db, "distress");
    const q = query(distressCollection, where("acknowledged", "==", false));

    const fetchDistressMessages = async () => {
      try {
        const snapshot = await getDocs(q); // Fetch the distress messages

        if (!snapshot.empty) {
          const messagesDetails = snapshot.docs.map((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp;

            // Convert the Unix timestamp (milliseconds) into a Date object
            const parsedTimestamp = new Date(timestamp);

            // Handle location, which is a Firestore GeoPoint (latitude, longitude)
            const location = data.location;
            const latitude = location.latitude; // Extract latitude from GeoPoint
            const longitude = location.longitude; // Extract longitude from GeoPoint

            // Construct the message details
            return {
              emergencyType: data.emergencyType || {},
              addInfo: data.addInfo || "",
              location: { latitude, longitude }, // Use extracted latitude and longitude
              timestamp: parsedTimestamp, // Store timestamp as Date object
            };
          });

          setDistressMessagesCount(messagesDetails.length); // Set the count of messages
          setDistressMessagesDetails(messagesDetails); // Update the state with the details
        } else {
          setDistressMessagesCount(0); // No distress messages
          setDistressMessagesDetails([]); // Clear the details
        }
      } catch (error) {
        console.error("Error fetching distress messages:", error); // Handle errors
      }
    };
    fetchDistressMessages();
  }, []);

  const handleLocationClick = (location: string) => {
    if (!location) {
      console.error("Location is undefined or null");
      return;
    }

    const locationParts = location.split(",");
    if (locationParts.length < 2) {
      console.error("Invalid location format");
      return;
    }

    const [latitudeStr, longitudeStr] = locationParts;
    const latitude = parseFloat(latitudeStr.trim());
    const longitude = parseFloat(longitudeStr.trim());

    if (isNaN(latitude) || isNaN(longitude)) {
      console.error("Invalid latitude or longitude");
      return;
    }

    // Set the selected location and show the map modal
    setSelectedLocation({ latitude, longitude });
    setMapModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const [userRole, setUserRole] = useState("User");

  const toggleUserRole = () => {
    setUserRole((prevRole) => (prevRole === "Admin" ? "User" : "Admin"));
  };

  return (
    <View style={layoutStyles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <MaterialIcons
          name="menu"
          size={35}
          color="#115272"
          style={layoutStyles.icon}
        />
      </TouchableOpacity>

      {/* Notification and Exclamation Icons */}
      <Button
        title={`Switch to ${userRole === "Admin" ? "User" : "Admin"}`}
        onPress={toggleUserRole}
      />
      {userRole === "Admin" ? (
        <View style={layoutStyles.iconGroup}>
          {/* Notification Icon */}

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={layoutStyles.buttonContainer}
          >
            <View style={layoutStyles.iconContainer}>
              <MaterialIcons
                name="notifications"
                size={30}
                color="#115272"
                style={layoutStyles.iconInner}
              />
              {newReportsCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{newReportsCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Exclamation Icon */}
          <TouchableOpacity
            onPress={() => setExclamationModalVisible(true)} // Show modal for distress messages
            style={layoutStyles.buttonContainer}
          >
            <View style={layoutStyles.iconContainer}>
              <MaterialIcons
                name="error"
                size={30}
                color="#115272"
                style={layoutStyles.iconInner}
              />
              {distressMessagesCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>
                    {distressMessagesCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
      {/* Notification Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>
              {newReportsCount > 0
                ? `${newReportsCount} reports still need validation`
                : "No new reports to validate"}
            </Text>
            <ScrollView style={styles.reportListContainer}>
              {reportTitles.map((title, index) => (
                <Text key={index} style={styles.reportTitle}>
                  {title}
                </Text>
              ))}
            </ScrollView>
            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
              color="#115272"
            />
          </View>
        </View>
      </Modal>

      {/* Exclamation Modal */}
      <Modal
        visible={exclamationModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setExclamationModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>
              {distressMessagesCount > 0
                ? `${distressMessagesCount} new distress messages`
                : "No new distress messages"}
            </Text>
            <ScrollView style={styles.reportListContainer}>
              {distressMessagesDetails.map((message, index) => {
                const emergencyTypes = message.emergencyType || {}; // Ensure emergencyType exists

                // Cast to Record<string, boolean> to avoid TypeScript errors
                const typedEmergencyTypes = emergencyTypes as Record<
                  string,
                  boolean
                >;

                // Filter out the types that are true
                const activeEmergencyTypes = Object.keys(typedEmergencyTypes)
                  .filter((key) => typedEmergencyTypes[key] === true)
                  .join(", ");

                return (
                  <Text key={index} style={styles.reportTitle}>
                    {activeEmergencyTypes} - {message.addInfo} -{" "}
                    <Text
                      onPress={() =>
                        handleLocationClick(
                          `${message.location.latitude}, ${message.location.longitude}`
                        )
                      }
                    >
                      Click here for location
                    </Text>
                  </Text>
                );
              })}
            </ScrollView>
            <Button
              title="Close"
              onPress={() => setExclamationModalVisible(false)}
              color="#115272"
            />
          </View>
        </View>
      </Modal>
      <Modal
        visible={mapModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMapModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.mapModal}>
            <MapView
              provider="google"
              style={{ flex: 1 }}
              minZoomLevel={5}
              region={
                selectedLocation
                  ? {
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                      latitudeDelta: 0.01, // Adjust the zoom level to fit your needs
                      longitudeDelta: 0.01,
                    }
                  : quezonCityRegion
              }
              onRegionChangeComplete={handleRegionChange}
            >
              {selectedLocation && (
                <Marker
                  coordinate={selectedLocation}
                  title="Selected Location"
                />
              )}
            </MapView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMapModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const layoutStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 30,
    backgroundColor: "#115272",
  },
  iconGroup: {
    flexDirection: "row", // Icons side-by-side
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    borderRadius: 25, // Increase radius to ensure the icon is centered
    borderWidth: 2,
    width: 50, // Size of the circle
    height: 50, // Size of the circle
    borderColor: "#115272",
    backgroundColor: "white",
    justifyContent: "center", // Horizontally center the icon
    alignItems: "center", // Vertically center the icon
    lineHeight: 45, // Ensure text inside is centered vertically (if applicable)
    textAlign: "center", // Ensure text is centered if any
  },

  iconContainer: {
    borderRadius: 20,
    borderWidth: 2,
    width: 50, // Matches the size of `icon`
    height: 50,
    borderColor: "#115272",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5, // Spacing between the two icons
  },
  iconInner: {
    textAlign: "center",
  },
});

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#115272",
  },
  mapModal: {
    width: "90%",
    height: "50%", // Adjust the height as needed
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden", // Prevent map from overflowing
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  closeButton: {
    backgroundColor: "#115272",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: 250,
    alignItems: "center",
  },
  modalMessage: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 15,
    color: "#333",
  },
  notificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  reportListContainer: {
    maxHeight: 200,
    marginTop: 10,
  },
  messageCard: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  cardInfo: {
    fontSize: 14,
    color: "#555",
  },
  cardLocation: {
    fontSize: 14,
    color: "#555",
  },
  cardTimestamp: {
    fontSize: 12,
    color: "#888",
  },
  reportTitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
});

export default MyHeader;
