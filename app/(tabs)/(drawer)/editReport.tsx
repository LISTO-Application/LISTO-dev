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
import { router, useRouter } from "expo-router";
import { SpacerView } from "@/components/SpacerView"; // Adjust the path if necessary
import { useLocalSearchParams } from "expo-router"; // Ensure you have expo-router installed
import { webstyles } from "@/styles/webstyles"; // For web styles
import { RouteProp, useRoute } from "@react-navigation/native";
import EditReportMobile from "./mobile/EditReport";
import { doc, GeoPoint, getDoc, updateDoc } from "firebase/firestore";
import { dbWeb } from "@/app/(auth)";
import { getIconName } from "@/assets/utils/getIconName";
import SideBar from "@/components/SideBar";
import { crimeImages, CrimeType } from "../../../constants/data/marker";
import { crimeType, DropdownCrimeTypes } from "./newReports";
import DropDownPicker from "react-native-dropdown-picker";
import { add, format, subDays, subYears } from "date-fns";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import TitleCard from "@/components/TitleCard";
import { collection, Timestamp } from "firebase/firestore";
import { useSearchParams } from "expo-router/build/hooks";
import { Report } from "@/constants/data/reports";

function EditReport({ navigation }: { navigation: any }) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const route = useRoute();
  const {
    id,
    timeReported,
    timeOfCrime,
    location,
    category,
    additionalInfo,
    phone,
    name,
    status,
    imageURI,
    filename,
    uid,
    time,
    unixTOC,
  } = route.params;
  const [report, setReport] = useState<Report | null>(null);

  // useEffect(() => {
  //   if (reportId) {
  //     const fetchReport = async () => {
  //       try {
  //         const reportRef = doc(dbWeb, "reports", reportId);
  //         console.log(reportRef);
  //         const reportDoc = await getDoc(reportRef);
  //         console.log(reportDoc);
  //         console.log(reportDoc.data());
  //         if (reportDoc.exists()) {
  //           setReport(reportDoc.data() as Report);
  //         } else {
  //           window.Error("No such document found.");
  //         }
  //       } catch (err) {
  //         window.Error(`Error fetching report details: ${err}`);
  //       }
  //     };

  //     fetchReport();
  //   }
  // }, [reportId]);

  console.log(report);
  const [newName, setNewName] = useState(name);
  const [newTime, setNewTime] = useState(time);
  const [newdate, setNewDate] = useState(new Date(timeOfCrime));
  const [dateTime, setDateTime] = useState();
  const [selectedValue, setSelectedValue] = useState("");
  const [newLocation, setNewLocation] = useState(report?.location);
  const [newAdditionalInfo, setNewAdditionalInfo] = useState(
    report?.additionalInfo
  );
  const [newCategory, setNewCategory] = useState<DropdownCrimeTypes | null>(
    null
  );

  const handleSelect = (item: DropdownCrimeTypes | undefined) => {
    setSelectedValue(item?.label); // Update the selected value
    setIsDropdownVisible(false); // Close the dropdown
  };
  // if (!report.uid) {
  //   console.error("UID is missing or invalid.");
  //   Alert.alert("Error", "Unable to identify the report.");
  //   return;
  // }
  //Parsing the date
  // console.log(report.date);
  // console.log(format(report.date, "yyyy-MM-dd"));
  // const editDate = format(report.date, "yyyy-MM-dd");
  // const editDate = report.date; //11-20-2024
  // const editTime = report.time; //04:02 PM
  // const editedDateTime = `${editDate} ${editTime}`;
  // const parsedEditedDateTime = new Date(editedDateTime);
  // console.log(parsedEditedDateTime);
  // console.log(editDate, editTime);
  const handleSubmit = async () => {
    console.log("Crime Type:", selectedValue);
    console.log("Location:", location);
    console.log("Additional Information:", additionalInfo);

    try {
      // Update the Firestore document with the new report data\
      console.log("Report UID:", report.uid);
      const reportRef = doc(db, "reports", report.uid); // Ensure 'report.id' holds the correct document ID

      const docSnap = await getDoc(reportRef);
      console.log("Document ID:", docSnap);
      console.log("Document:", docSnap.data());
      if (!docSnap.exists) {
        console.error("Document not found:", report.uid);
        Alert.alert("Error", "Document not found. Unable to update.");
        return;
      }

      // const formattedDate = new Date(date);
      const updatedReport = {
        ...report,
        additionalInfo: additionalInfo,
        date: formattedDate,
        time: time,
        category: selectedValue.toLowerCase(),
        location: location,
      };

      await updateDoc(reportRef, updatedReport);

      console.log("Report updated successfully:", updatedReport);
      Alert.alert("Success", "Report updated successfully");
      router.push({ pathname: "/viewReports", params: { updatedReport } });
    } catch (error) {
      console.error("Error updating report:", error);
      Alert.alert("Error", "Error updating report. Please try again.");
    }
    // console.log("UpdatedReport: ", updatedReport);
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(report?.category || null);
  const [items, setItems] = useState(crimeType);

  //Date
  const [startDate, setStartDate] = useState<Date | null>("");

  useEffect(() => {
    // const dateInput = startDate;
    // console.log("Date Input", format(dateInput, "yyyy-MM-dd"));
    // const timeInput = dayjs(startDate).format("hh:mm A");
    // setDate(format(dateInput, "yyyy-MM-dd"));
    // setTime(timeInput);
    // console.log(startDate);
    // console.log(dateInput, timeInput);
    // console.log(date);
  }, [startDate]);
  const minDate =
    value === "rape" ? subYears(new Date(), 5) : subDays(new Date(), 365);

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
        <SideBar sideBarPosition={sideBarPosition} navigation={navigation} />
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
          <TitleCard />
          <ScrollView
            contentContainerStyle={[
              webstyles.reportList,
              isAlignedRight && { width: "75%" },
            ]}
          >
            <Text>Reporter's Username:</Text>
            <TextInput
              style={webstyles.inputField}
              value={newName}
              editable={true}
              aria-disabled
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
                onChange={(date: Date | null) => setStartDate(date)}
                value={dateTime}
                maxDate={new Date()}
                minDate={minDate}
                showTimeInput
                showMonthYearDropdown
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
            <View style={webstyles.buttonContainereditReport}>
              <TouchableOpacity
                style={webstyles.cancelButtoneditReport}
                onPress={() => router.push("/viewReports")}
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
