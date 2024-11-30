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
} from "@react-native-firebase/firestore";

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
  const [reportTitles, setReportTitles] = useState<string[]>([]); // State to hold the titles of pending reports

  // Fetch the count and titles of new reports whenever the component mounts or updates
  useEffect(() => {
    const reportsCollection = collection(db, "reports");
    const q = query(reportsCollection, where("status", "==", "PENDING"));

    // Fetch the reports initially
    const fetchReports = async () => {
      try {
        const snapshot = await getDocs(q);
        setNewReportsCount(snapshot.size); // Set initial count
        const titles: string[] = snapshot.docs.map((doc) => doc.data().title); // Extract titles from the documents
        setReportTitles(titles); // Set the report titles
        console.log("Initial fetch: Number of PENDING reports:", snapshot.size); // Debugging line
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    // Fetch the reports initially
    fetchReports();
  }, []);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
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
      <TouchableOpacity onPress={openModal}>
        <MaterialIcons
          name="notifications"
          size={35}
          color="#115272"
          style={layoutStyles.icon}
        />
        {newReportsCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{newReportsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>
              {newReportsCount > 0
                ? `${newReportsCount} reports still needs validation`
                : "No new reports to validate"}
            </Text>
            <Text>Title of reports: </Text>
            {/* List the titles of the reports */}
            {reportTitles.length > 0 && (
              <ScrollView style={styles.reportListContainer}>
                {reportTitles.map((title, index) => (
                  <Text key={index} style={styles.reportTitle}>
                    {title}
                  </Text>
                ))}
              </ScrollView>
            )}

            <Button title="Close" onPress={closeModal} color="#115272" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const layoutStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row", // Align items horizontally
    justifyContent: "space-between", // Push menu to the left and bell to the right
    alignItems: "center", // Center items vertically
    paddingHorizontal: 16,
    paddingVertical: 30, // Reduced padding to make it thinner vertically
    backgroundColor: "#115272", // Optional, can match the app theme
    height: 20, // You can also explicitly set a height to make it smaller
  },
  icon: {
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 2,
    width: 40, // Slightly larger size for better visibility
    height: 40,
    borderColor: "#115272",
    backgroundColor: "white",
    textAlign: "center", // Center icon horizontally
    textAlignVertical: "center", // Center icon vertically (Android-specific)
  },
});

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
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
    maxHeight: 200, // Limit the height to make it scrollable if there are many reports
    marginTop: 10,
  },
  reportTitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
});

export default MyHeader;
