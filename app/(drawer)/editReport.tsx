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
import { crimeImages, CrimeType } from "../(tabs)/data/marker";
import { crimeType, DropdownCrimeTypes } from "./newReports";
import DropDownPicker from "react-native-dropdown-picker";
import { add } from "date-fns";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";

function EditReport({ navigation }: { navigation: any }) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const route = useRoute();
  const { report }: { report: any } = route.params as { report: Report };

  //Parsing the date
  const editDate = report.date; //11-20-2024
  const editTime = report.time; //04:02 PM
  const editedDateTime = `${editDate} ${editTime}`;
  const parsedEditedDateTime = new Date(editedDateTime);
  console.log(parsedEditedDateTime);
  console.log(editDate, editTime);

  const [category, setCategory] = useState<DropdownCrimeTypes | null>(null);
  const [title, setTitle] = useState(report.title);
  const [name, setName] = useState(report.name);
  const [date, setDate] = useState(report.date);
  const [dateTime, setDateTime] = useState();
  const [time, setTime] = useState(report.time);
  const [selectedValue, setSelectedValue] = useState(report.category);
  const [location, setLocation] = useState(report.location);
  const [additionalInfo, setAdditionalInfo] = useState(report.additionalInfo);

  const handleSelect = (item: DropdownCrimeTypes) => {
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
      additionalInfo: additionalInfo,
      date: date,
      time: time,
      icon: crimeImages[selectedValue.toLowerCase() as CrimeType] || undefined,
      category: selectedValue.toLowerCase(),
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

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(report.category);
  const [items, setItems] = useState(crimeType);

  //Date
  const [startDate, setStartDate] = useState<Date | null>(parsedEditedDateTime);

  useEffect(() => {
    const dateInput = dayjs(startDate).format("MM-DD-YYYY");
    const timeInput = dayjs(startDate).format("hh:mm A");
    setDate(dateInput);
    setTime(timeInput);
    console.log(startDate);

    console.log(dateInput, timeInput);
    console.log(date);
  }, [startDate]);

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
      <EditReportMobile
        isDropdownVisible={isDropdownVisible}
        setIsDropdownVisible={setIsDropdownVisible}
        selectedValue={selectedValue}
        crimeTypes={crimeType}
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

          <ScrollView
            contentContainerStyle={[
              webstyles.reportList,
              isAlignedRight && { width: "75%" },
            ]}
          >
            {/* Report Details */}
            <Text>Reporter's Username:</Text>
            <TextInput
              style={webstyles.inputField}
              value={name}
              onChange={setName}
            />

            <Text>Subject:</Text>
            <TextInput
              style={webstyles.inputField}
              value={title}
              onChangeText={setTitle}
            />

            <Text>Select Crime Type:</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              placeholder="Select Crime Type:"
              onChangeValue={(selectedValue) => {
                const selectedItem = items.find(
                  (item) => item.value === selectedValue
                );
                handleSelect(selectedItem);
              }}
            />

            <Text>Location:</Text>
            <TextInput
              style={webstyles.inputField}
              value={location}
              onChangeText={setLocation}
            />

            <Text>Date and Time Happened:</Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TextInput
                style={webstyles.inputField}
                value={date}
                onChangeText={setDate}
                aria-disabled
              />
              <TextInput
                style={webstyles.inputField}
                value={time}
                onChangeText={setTime}
                aria-disabled
              />
            </View>
            <View style={{ width: 250 }}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                value={dateTime}
                showTimeInput
                inline
              />
            </View>

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
        </Animated.View>
      </View>
    );
  }
}

export default EditReport;
