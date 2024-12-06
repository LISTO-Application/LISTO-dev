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

export default function newReports({ navigation }: { navigation: any }) {
  const { id } = useLocalSearchParams(); // Get the report ID from the URL
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const crimeTypes = [
    { label: "Theft", value: "theft" },
    { label: "Assault", value: "assault" },
    { label: "Vandalism", value: "vandalism" },
  ];

  const handleSelect = (item: { label: any; value?: string }) => {
    setSelectedValue(item.label); // Update the selected value
    setIsDropdownVisible(false); // Close the dropdown
  };

  if (Platform.OS === "web") {
    return (
      <View style={webstyles.container}>
        {/* Sidebar */}
        <View style={webstyles.sidebar}>
          <Text style={webstyles.sidebarTitle}>Beth Logan</Text>
          <TouchableOpacity style={webstyles.sidebarItem}>
            <Text style={webstyles.sidebarText}>Emergency Dial</Text>
          </TouchableOpacity>
          <TouchableOpacity style={webstyles.sidebarItem}>
            <Text style={webstyles.sidebarText}>Report Incident</Text>
          </TouchableOpacity>
          <TouchableOpacity style={webstyles.sidebarItem}>
            <Text style={webstyles.sidebarText}>Report Tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={webstyles.sidebarItem}>
            <Text style={webstyles.sidebarText}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={webstyles.sidebarItem}>
            <Text style={webstyles.sidebarText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={webstyles.mainContainer}>
          <Text style={webstyles.headerText}>New Report</Text>
          <ScrollView contentContainerStyle={webstyles.reportList}>
            {/* Report Details */}
            <Text>Reporter's Username:</Text>
            <TextInput style={webstyles.inputField} value="" editable={false} />

            <Text>Select Crime Type:</Text>
            <TouchableOpacity
              style={webstyles.dropdown}
              onPress={() => setIsDropdownVisible(!isDropdownVisible)}
            >
              <Text>
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
                onPress={() => router.replace({
                  pathname: "/viewReports"
                })}
              >
                <Text style={webstyles.buttonTexteditReport}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={webstyles.submitButtoneditReport}
                onPress={() => navigation.navigate("ViewReports")}
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
