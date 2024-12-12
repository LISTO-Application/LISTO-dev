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
import { getAuth, signOut } from "firebase/auth";
import { app, authWeb } from "@/app/(auth)";

export const SideBar = ({
  sideBarPosition,
  navigation,
}: {
  sideBarPosition: any;
  navigation: any;
}) => {
  //Assets
  const auth = authWeb;
  const id = auth.currentUser?.displayName;
  const image = require("../assets/images/texture.svg");

  const handleLogout = () => {
    signOut(authWeb);
    console.log(auth.currentUser);
  };

  //Icon assets
  const menuItems = [
    { name: "Crime Map", route: "crimemap" },
    { name: "Account", route: "account" },
    { name: "View Reports", route: "viewReports" },
    { name: "Validate Tickets", route: "validateReports" },
    { name: "View Crimes List", route: "ViewAdminEmergencyList" },
    { name: "View Distress List", route: "viewDistress" },
  ];

  const [newReportsCount, setNewReportsCount] = useState(0);
  const [reportTitles, setReportTitles] = useState<string[]>([]); // State to hold the titles of pending reports
  const [distressMessagesCount, setDistressMessagesCount] = useState(0);
  const [distressMessagesDetails, setDistressMessagesDetails] = useState<
    {
      emergencyType: string;
      addInfo: string;
      location: { latitude: number; longitude: number };
      timestamp: Date;
      id: string;
      acknowledge: boolean;
    }[] // Adding the 'id' property
  >([]);
  // Fetch the count and titles of new reports whenever the component mounts or updates
  useEffect(() => {
    const reportsCollection = collection(db, "reports");
    const q = query(reportsCollection, where("status", "==", 1));

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
            const parsedTimestamp = new Date(timestamp);
            const location = data.location;
            const latitude = location.latitude;
            const longitude = location.longitude;
            console.log("emergency type", data.emergencyType);
            return {
              emergencyType: data.emergencyType || {},
              addInfo: data.addInfo || "",
              location: { latitude, longitude },
              timestamp: parsedTimestamp,
              id: doc.id, // Document ID
              acknowledge: data.acknowledged || false,
            };
          });

          setDistressMessagesCount(messagesDetails.length);
          setDistressMessagesDetails(messagesDetails);
        } else {
          setDistressMessagesCount(0);
          setDistressMessagesDetails([]);
        }
      } catch (error) {
        console.error("Error fetching distress messages:", error);
      }
    };

    fetchDistressMessages();
  }, []);

  console.log("Distresses", distressMessagesDetails);

  const [userRole, setUserRole] = useState("User");

  const authen = getAuth(app);
  useEffect(() => {
    const fetchUserRole = async () => {
      const user = authen.currentUser;
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const claims = idTokenResult.claims;
        console.log("ID token result", idTokenResult);
        console.log("Claims", claims);
        console.log("Admin?", claims.admin);
        if (claims.admin) {
          setUserRole("Admin");
        } else {
          setUserRole("User");
        }
      }
    };

    fetchUserRole();
  }, []);

  console.log("Auth", auth);

  return (
    <Animated.View
      style={[
        webstyles.sidebar,
        { transform: [{ translateX: sideBarPosition }] },
      ]}
    >
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={webstyles.userSection}
      >
        <TouchableOpacity onPress={() => router.push("/account")}>
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
          ([
            "Validate Tickets",
            "View Crimes List",
            "View Distress List",
          ].includes(item.name) &&
            userRole === "Admin") ||
          ![
            "Validate Tickets",
            "View Crimes List",
            "View Distress List",
          ].includes(item.name) ? (
            <TouchableOpacity
              key={index}
              style={webstyles.sidebarItem}
              onPress={() => router.push(`/${item.route}`)}
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
