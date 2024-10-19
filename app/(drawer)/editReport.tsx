import React, { useState, useEffect, useContext } from "react";
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
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/styles"; // Adjust the path if necessary
import { router } from "expo-router";
import { SpacerView } from "@/components/SpacerView"; // Adjust the path if necessary
import { useLocalSearchParams } from "expo-router"; // Ensure you have expo-router installed
import { webstyles } from "@/styles/webstyles"; // For web styles
import { RouteProp, useRoute } from "@react-navigation/native";
import EditReportMobile from "./mobile/EditReport";

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

export default function EditReport({ navigation }: { navigation: any }) {
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

  const handleSubmit = () => {
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

    console.log("UpdatedReport: ", updatedReport);

    navigation.navigate("ViewReports", { updatedReport });
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

        <View style={webstyles.mainContainer}>
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
        </View>
      </View>
    );
  }
}
