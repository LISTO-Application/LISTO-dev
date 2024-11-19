import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  TextInput,
  Platform,
  ImageBackground,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/styles"; // Adjust the path if necessary
import { router } from "expo-router";
import { SpacerView } from "@/components/SpacerView"; // Adjust the path if necessary
import { useLocalSearchParams } from "expo-router"; // Ensure you have expo-router installed
import { webstyles } from "@/styles/webstyles"; // For web styles
import { RouteProp, useRoute } from "@react-navigation/native";
import EditReportMobile from "./mobile/EditReport";
import { doc, updateDoc } from "@react-native-firebase/firestore";
import { db } from "../FirebaseConfig";
import { getIconName } from "@/assets/utils/getIconName";
import SideBar from "@/components/SideBar";

interface CrimeType {
  label: string;
  value:
    | "murder"
    | "robbery"
    | "homicide"
    | "injury"
    | "rape"
    | "carnapping"
    | "theft";
}

function EditReport({ navigation }: { navigation: any }) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const route = useRoute();
  const { report }: { report: any } = route.params as { report: Report };

  const [category, setCategory] = useState<CrimeType["value"] | null>(null);
  const [title, setTitle] = useState(report.title);
  const [name, setName] = useState(report.name);
  const [selectedValue, setSelectedValue] = useState("Select Crime Type");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const crimeTypes: CrimeType[] = [
    { label: "Murder", value: "murder" },
    { label: "Robbery", value: "robbery" },
    { label: "Homicide", value: "homicide" },
    { label: "Injury", value: "injury" },
    { label: "Rape", value: "rape" },
    { label: "Carnapping", value: "carnapping" },
    { label: "Theft", value: "theft" },
  ];
  const handleSelect = (item: CrimeType) => {
    setSelectedValue(item.label); // Update the selected value
    setIsDropdownVisible(false); // Close the dropdown
  };

  console.log(report);

  const handleSubmit = async () => {
    console.log("Crime Type:", selectedValue);
    console.log("Location:", location);
    console.log("Additional Information:", additionalInfo);
    const updatedReport = {
      ...report,
      name: name,
      title: title,
      category: selectedValue,
      location: location,
    };

    try {
      // Update the Firestore document with the new report data
      const reportRef = doc(db, "reports", report.id); // Ensure 'report.id' holds the correct document ID
      await updateDoc(reportRef, updatedReport);

      console.log("Report updated successfully:", updatedReport);
      Alert.alert("Success", "Report updated successfully");
      navigation.navigate("ViewReports");
    } catch (error) {
      console.error("Error updating report:", error);
      Alert.alert("Error", "Error updating report. Please try again.");
    }
    // console.log("UpdatedReport: ", updatedReport);

    // navigation.navigate("ViewReports", { updatedReport });
  };

  //Animation to Hide side bar
  const { width: screenWidth } = Dimensions.get("window"); // Get the screen width
  const sidebarWidth = screenWidth * 0.25; // 25% of screen width
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sideBarPosition = useRef(new Animated.Value(-sidebarWidth)).current;
  const contentPosition = useRef(new Animated.Value(0)).current;

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
    setSidebarVisible(!isSidebarVisible);
  };

  if (Platform.OS === "android" || Platform.OS === "ios") {
    return (
      <EditReportMobile
        isDropdownVisible={isDropdownVisible}
        setIsDropdownVisible={setIsDropdownVisible}
        selectedValue={selectedValue}
        crimeTypes={crimeTypes}
        location={location}
        setLocation={setLocation}
        additionalInfo={additionalInfo}
        setAdditionalInfo={setAdditionalInfo}
        handleSelect={handleSelect}
        handleSubmit={handleSubmit}
      />
    );
  } else if (Platform.OS === "web") {
    return (
      <View style={webstyles.container}>
        {/* Sidebar */}
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
          <Text style={webstyles.headerText}>Edit Report</Text>

          <ScrollView contentContainerStyle={webstyles.reportList}>
            {/* Report Details */}
            <Text>Reporter's Username:</Text>
            <TextInput
              style={webstyles.inputField}
              value={name}
              onChange={setName}
            />

            <Text>Select Crime Type:</Text>
            <TouchableOpacity
              style={webstyles.dropdown}
              onPress={() => setIsDropdownVisible(!isDropdownVisible)}
            >
              <Text style={webstyles.selectedText}>
                {selectedValue || "Select Crime Type"}
              </Text>
              <Ionicons name="chevron-down" size={24} color="gray" />
            </TouchableOpacity>

            {isDropdownVisible && (
              <FlatList
                data={crimeTypes}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={webstyles.item}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={webstyles.itemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                style={webstyles.dropdownList} // Optional: Add styles to control dropdown position
              />
            )}

            <Text>Location:</Text>
            <TextInput
              style={webstyles.inputField}
              value={location}
              onChangeText={setLocation}
            />

            <Text>Additional Information:</Text>
            <TextInput
              style={webstyles.textArea}
              multiline
              numberOfLines={4}
              value={title}
              onChangeText={setTitle}
            />

            <Text>Image Upload:</Text>
            <TextInput
              style={webstyles.inputField}
              value="https://cloud.com/BarangayBatasan/Virus.img"
              editable={false}
            />

            {/* Buttons */}
            <View style={webstyles.buttonContainereditReport}>
              <TouchableOpacity
                style={webstyles.cancelButtoneditReport}
                onPress={() => navigation.navigate("ViewReports")}
              >
                <Text style={webstyles.buttonTexteditReport}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={webstyles.submitButtoneditReport}
                onPress={handleSubmit}
              >
                <Text
                  style={[webstyles.buttonTexteditReport, { color: "#FFF" }]}
                >
                  SAVE CHANGES
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    );
  }
}

export default EditReport;
