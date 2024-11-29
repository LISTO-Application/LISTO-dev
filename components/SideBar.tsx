import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getIconName } from "@/assets/utils/getIconName";
import { webstyles } from "@/styles/webstyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { db } from "@/app/FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
} from "@react-native-firebase/firestore";

export const SideBar = ({
  sideBarPosition,
  navigation,
}: {
  sideBarPosition: any;
  navigation: any;
}) => {
  //Assets
  const id = "John Doe";
  const image = require("../assets/images/texture.svg");
  const handleLogout = () => {
    router.push("/");
  };

  //Icon assets
  const menuItems = [
    { name: "Emergency Dial", route: "Emergency" },
    { name: "Report Incident", route: "Report Incident" },
    { name: "Account", route: "Account" },
    { name: "View Reports", route: "ViewReports" },
    { name: "Validate Tickets", route: "Validate" },
    { name: "View Admin Emergency List", route: "ViewAdminEmergencyList" },
  ];

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

  const [userRole, setUserRole] = useState("User");

  const toggleUserRole = () => {
    setUserRole((prevRole) => (prevRole === "Admin" ? "User" : "Admin"));
  };

  return (
    <Animated.View
      style={[
        webstyles.sidebar,
        { transform: [{ translateX: sideBarPosition }] },
      ]}
    >
      <Button
        title={`Switch to ${userRole === "Admin" ? "User" : "Admin"}`}
        onPress={toggleUserRole}
      />
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={webstyles.userSection}
      >
        <TouchableOpacity onPress={() => router.push(`/${id}`)}>
          <Image
            source={require("../assets/images/user-icon.png")}
            style={webstyles.userImage}
          />
          <Text style={webstyles.userName}>{id}</Text>
        </TouchableOpacity>
      </ImageBackground>
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          paddingTop: 30,
        }}
      >
        <Text style={webstyles.sidebarTitle}>{userRole}</Text>
        {menuItems.map((item, index) =>
          (["Validate Tickets", "View Admin Emergency List"].includes(
            item.name
          ) &&
            userRole === "Admin") ||
          !["Validate Tickets", "View Admin Emergency List"].includes(
            item.name
          ) ? (
            <TouchableOpacity
              key={index}
              style={webstyles.sidebarItem}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={{ flex: 1, flexDirection: "row", gap: 20 }}>
                <Ionicons
                  name={getIconName(item.route, false)}
                  size={24}
                  color={"#333"}
                />
                <Text style={[webstyles.sidebarText]}>{item.name}</Text>
                {item.name === "Validate Tickets" && newReportsCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationText}>
                      {newReportsCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ) : null
        )}

        <View style={webstyles.logoutContainer}>
          <TouchableOpacity
            onPress={handleLogout}
            style={webstyles.logoutButton}
          >
            <Text style={webstyles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default SideBar;

const styles = StyleSheet.create({
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
});
