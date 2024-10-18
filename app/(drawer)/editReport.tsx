import React, { useState, useEffect } from "react";
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

export default function EditReport({ navigation }: { navigation: any }) {
  const { id } = useLocalSearchParams(); // Get the report ID from the URL
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Select Crime Type");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Example report data (this should come from your data source, such as an API or state)
  const reportData = [
    {
      id: "1",
      title: "Violent Activity near 6th street",
      location: "6th Street",
      additionalInfo: "Heard shouting and yelling.",
      crimeType: "Assault",
    },
    {
      id: "2",
      title: "Theft near 6th street",
      location: "6th Street",
      additionalInfo: "Someone stole my bike.",
      crimeType: "Theft",
    },
  ];

  useEffect(() => {
    // Find the report data based on the ID
    const report = reportData.find((report) => report.id === id);
    if (report) {
      setSelectedValue(report.crimeType);
      setLocation(report.location);
      setAdditionalInfo(report.additionalInfo);
    }
  }, [id]);

  const crimeTypes = [
    { label: "Theft", value: "theft" },
    { label: "Assault", value: "assault" },
    { label: "Vandalism", value: "vandalism" },
  ];

  const handleSelect = (item: any) => {
    setModalVisible(true);
    setSelectedValue(item.label);
  };

  const handleSubmit = () => {
    console.log("Crime Type:", selectedValue);
    console.log("Location:", location);
    console.log("Additional Information:", additionalInfo);
    navigation.navigate("ViewReports", {
      selectedValue: selectedValue,
      location: location,
      additionalInfo: additionalInfo,
    });
  };
  if (Platform.OS === "android" || Platform.OS === "ios") {
    return (
      <View style={styles.mainContainer}>
        {/* Blue Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backIcon}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit a Report</Text>
          <SpacerView height={120} />
        </View>

        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.dropdown} onPress={handleSelect}>
            <Text style={styles.selectedText}>{selectedValue}</Text>
            <Ionicons name="chevron-down" size={24} color="gray" />
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FlatList
                  data={crimeTypes}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => handleSelect(item)}
                    >
                      <Text style={styles.itemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>

          <TextInput
            style={styles.textInput}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />

          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Additional Information"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            multiline={true}
          />

          <TouchableOpacity style={styles.imageUpload}>
            <Ionicons name="image-outline" size={24} color="gray" />
            <Text style={styles.uploadText}>Add file</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => console.log("Cancel")}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={[styles.buttonText, { color: "#FFF" }]}>
              Submit Report
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (Platform.OS === "web") {
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
          <Text style={webstyles.headerText}>Edit Report</Text>

          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FlatList
                  data={crimeTypes}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => handleSelect(item)}
                    >
                      <Text style={styles.itemText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
          <ScrollView contentContainerStyle={webstyles.reportList}>
            {/* Report Details */}
            <Text>Reporter's Username:</Text>
            <TextInput
              style={webstyles.inputField}
              value="Mr. False Reporter"
              editable={false}
            />

            <Text>Select Crime Type:</Text>
            <TouchableOpacity style={webstyles.dropdown} onPress={handleSelect}>
              <Text style={webstyles.selectedText}>{selectedValue}</Text>
              <Ionicons name="chevron-down" size={24} color="gray" />
            </TouchableOpacity>

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
