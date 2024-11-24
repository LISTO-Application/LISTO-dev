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
import { styles } from "@/styles/styles"; // For mobile styles
import { db } from "../FirebaseConfig";
import { Report } from "../(tabs)/data/reports";

import "firebase/database";
import { collection, getDocs } from "@react-native-firebase/firestore";
import SideBar from "@/components/SideBar";
import { doc, updateDoc } from "@react-native-firebase/firestore";
export default function ValidateReports({ navigation }: { navigation: any }) {
  const handleTitlePress = (report: Report) => {
    console.log("Navigating to details page for report:", report); // Debugging log
    navigation.navigate("ReportDetails", {
      id: report.id,
      title: report.title,
      category: report.category,
      status: report.status,
      additionalInfo: report.additionalInfo,
      image: report.image,
    });
  };
  const handleStatusChange = async (
    reportId: string,
    newStatus: "PENDING" | "VALID" | "PENALIZED"
  ) => {
    try {
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );

      const reportRef = doc(db, "reports", reportId);
      await updateDoc(reportRef, { status: newStatus });
      console.log(`Status updated to ${newStatus} for report ID ${reportId}`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
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
            status: doc.data().status || "PENDING",
            timeStamp: doc.data().timeStamp || new Date().toISOString(),
          };
        });
        setReports(reportList);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const [reports, setReports] = useState<Report[]>([]);

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
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backIcon}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Listed Reports (ADMINS)</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {reports.map((report) => (
            <View key={report.id}>
              {/* Report content */}
              <View style={styles.reportContainer}>
                <View style={styles.reportIcon}>
                  <Ionicons
                    name={
                      report.title === "HOMICIDE" ? "alert-circle" : "alert"
                    }
                    size={24}
                    color="white"
                  />
                </View>

                <View style={styles.reportTextContainer}>
                  {/* Title wrapped in TouchableOpacity for navigation */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("reportDetails", {
                        id: report.id,
                        title: report.title,
                        category: report.category,
                      })
                    }
                  >
                    <Text style={styles.reportTitle}>{report.title}</Text>
                  </TouchableOpacity>
                  <Text style={styles.reportDetails}>
                    {report.additionalInfo}
                  </Text>
                </View>

                {/* Status badge */}
                <View style={styles.statusContainer}>
                  <Text
                    style={[styles.statusBadge, getStatusStyle(report.status)]}
                  >
                    {report.status}
                  </Text>
                </View>

                {/* {report.status === "PENDING" ? (
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

                    }}
                  >
                    <Text style={webstyles.approvedButtonText}>Validated</Text>
                  </TouchableOpacity>
                ) : report.status === "PENALIZED" ? (
                  <TouchableOpacity
                    style={webstyles.rejectedButton}
                    onPress={() => {

                    }}
                  >
                    <Text style={webstyles.rejectedButtonText}>Penalized</Text>
                  </TouchableOpacity>
                ) : null} */}
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
          <Text style={webstyles.headerText}>Listed Reports</Text>

          <ScrollView
            contentContainerStyle={[
              webstyles.reportList,
              isAlignedRight && { width: "75%" },
            ]}
          >
            {reports.length > 0 ? (
              reports.map((report) => (
                <View
                  key={report.id}
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
                    <TouchableOpacity onPress={() => handleTitlePress(report)}>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#115272",
                        }}
                      >
                        {report.title}
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{ color: "#115272", fontSize: 14, marginLeft: 10 }}
                    >
                      {report.time}
                    </Text>
                  </View>

                  {/* Report Category */}
                  <Text style={{ color: "#115272", marginTop: 5 }}>
                    {`Category: ${report.category}`}
                  </Text>

                  {/* Report Location */}
                  <Text style={{ color: "#115272", marginTop: 5 }}>
                    {`Location: ${report.location || "Not provided"}`}
                  </Text>

                  {/* Action Buttons */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    {report.status === "PENDING" ? (
                      <>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#28a745",
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                            marginLeft: 5,
                          }}
                          onPress={() => handleStatusChange(report.id, "VALID")}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 20,
                              textAlign: "center",
                            }}
                          >
                            Validate
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            backgroundColor: "#dc3545",
                            paddingVertical: 5,
                            paddingHorizontal: 10,
                            borderRadius: 5,
                            marginLeft: 5,
                          }}
                          onPress={() =>
                            handleStatusChange(report.id, "PENALIZED")
                          }
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 20,
                              textAlign: "center",
                            }}
                          >
                            Penalize
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Text
                        style={{
                          color:
                            report.status === "VALID"
                              ? "#28a745"
                              : report.status === "PENALIZED"
                                ? "#dc3545"
                                : "#6c757d",
                          fontWeight: "bold",
                          fontSize: 20,
                          textAlign: "right",
                        }}
                      >
                        {report.status === "VALID" ? "Validated" : "Penalized"}
                      </Text>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No reports available.
              </Text>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}
