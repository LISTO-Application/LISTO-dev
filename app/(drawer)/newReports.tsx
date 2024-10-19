import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { SpacerView } from "@/components/SpacerView";
import { styles } from "@/styles/styles"; // For mobile styles
import { webstyles } from "@/styles/webstyles"; // For web styles
import { useRoute } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import { db } from "../FirebaseConfig"; // Adjust the import path to your Firebase config
import { collection, addDoc } from "@react-native-firebase/firestore";

const database = db;

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

type CrimeCategory =
  | "murder"
  | "theft"
  | "robbery"
  | "homicide"
  | "injury"
  | "rape"
  | "carnapping";

export default function NewReports({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { report = [] } = route.params || {};
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [name, setName] = useState("");
  // const [reportList, setReports] = useState(report);

  const iconMapping: { [key in CrimeCategory]: any } = {
    murder: require("../../assets/images/knife-icon.png"),
    robbery: require("../../assets/images/robbery-icon.png"),
    homicide: require("../../assets/images/homicide-icon.png"),
    injury: require("../../assets/images/injury-icon.png"),
    rape: require("../../assets/images/rape-icon.png"),
    carnapping: require("../../assets/images/car-icon.png"),
    theft: require("../../assets/images/thief-icon.png"),
  };

  const crimeTypes: CrimeType[] = [
    { label: "Murder", value: "murder" },
    { label: "Robbery", value: "robbery" },
    { label: "Homicide", value: "homicide" },
    { label: "Injury", value: "injury" },
    { label: "Rape", value: "rape" },
    { label: "Carnapping", value: "carnapping" },
    { label: "Theft", value: "theft" },
  ];

  const handleSelect = (item: { label: any; value?: string }) => {
    setSelectedValue(item.label); // Update the selected value
    setIsDropdownVisible(false); // Close the dropdown
  };

  const handleSubmit = async () => {
    const newReport = {
      id: uuidv4(),
      icon:
        iconMapping[selectedValue.toLowerCase() as CrimeCategory] || undefined,
      name: name,
      category: selectedValue.toLowerCase(),
      title: additionalInfo || "Untitled Report",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      location: location,
    };

    try {
      const reportRef = collection(database, "reports"); // Ensure 'database' is the Firestore instance
      await addDoc(reportRef, newReport);
      navigation.navigate("ViewReports", { updatedReport: newReport });
    } catch (error) {
      console.error("Error saving report:", error);
      alert("Failed to save report. Please try again.");
    }
  };

  // setReports((prevReports: any) => [...prevReports, newReport]);
  //   console.log("Newly Created Report:", newReport);

  //   navigation.navigate("ViewReports", { updatedReport: newReport });
  // };

  if (Platform.OS === "web") {
    return (
      <View style={webstyles.container}>
        {/* Sidebar */}

        <View style={webstyles.mainContainer}>
          <View style={webstyles.sidebar}>
            <Ionicons name="backspace" size={30} color="white" />
          </View>
          <Text style={webstyles.headerText}>New Report</Text>
          <ScrollView contentContainerStyle={webstyles.reportList}>
            {/* Report Details */}
            <Text>Reporter's Username:</Text>
            <TextInput
              style={webstyles.inputField}
              value={name}
              editable={true}
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
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
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
        </View>
      </View>
    );
  }
}
