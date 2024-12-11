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
import EditReportMobile from "../mobile/EditReport";
import {
  doc,
  DocumentReference,
  GeoPoint,
  getDoc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { authWeb, dbWeb } from "@/app/(auth)";
import { getIconName } from "@/assets/utils/getIconName";
import SideBar from "@/components/SideBar";
import { crimeImages, CrimeType } from "@/constants/data/marker";
import { crimeType, DropdownCrimeTypes } from "../newReports";
import DropDownPicker from "react-native-dropdown-picker";
import { add, format, subDays, subYears } from "date-fns";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import TitleCard from "@/components/TitleCard";
import { collection, Timestamp } from "firebase/firestore";
import { useSearchParams } from "expo-router/build/hooks";
import { Report } from "@/constants/data/reports";

function EditReport({ navigation }: { navigation: any }) {
  const auth = authWeb;
  const uid = auth.currentUser?.uid;
  // const name = auth.currentUser?.displayName;
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const route = useRouter();
  const {
    id,
    name,
    category,
    location,
    coordinate,
    time,
    timeOfCrime,
    additionalInfo,
    image,
  } = useLocalSearchParams();
  console.log("REPORT ID IN EDIT REPORTS", id, name);
  const [report, setReport] = useState<Report>();
  useEffect(() => {
    if (id) {
      const fetchReport = async () => {
        try {
          const reportsCollectionRef = collection(dbWeb, "reports");
          await query(reportsCollectionRef, where("uid", "==", id))
            .get()
            .then((querySnapshot: { size: any; docs: any[] }) => {
              console.log("MUAHAHAHA", querySnapshot.size);
              const updatedReport = querySnapshot.docs.map((doc) => doc.data());
              setReport(updatedReport);
            })
            .catch((error: any) => {
              console.error("Error fetching reports: ", error);
            });
        } catch (err) {
          window.Error(`Error fetching report details: ${err}`);
        }
      };

      fetchReport();
    }
  }, [id]);
  // Parsing the date
  const editedDateTime = `${timeOfCrime} ${time}`;
  const parsedEditedDateTime = new Date(editedDateTime);
  console.log(parsedEditedDateTime);
  // const { name, time, category, location, additionalInfo } = report;
  const [newName, setNewName] = useState(name);
  const [newTime, setNewTime] = useState(time);
  const [newDate, setNewDate] = useState(timeOfCrime);
  const [dateTime, setDateTime] = useState(new Date(parsedEditedDateTime));
  const [selectedValue, setSelectedValue] = useState(category);
  const [newLocation, setNewLocation] = useState(location);
  const [newAdditionalInfo, setNewAdditionalInfo] = useState(additionalInfo);
  const [newCategory, setNewCategory] = useState<DropdownCrimeTypes | null>(
    null
  );
  console.log("DATETIMEEEEEEEEEEEEEE", dateTime);
  let stringCoordinate = coordinate;
  console.log(coordinate);
  const handleSelect = (item: DropdownCrimeTypes | undefined) => {
    setSelectedValue(item?.label);
    setIsDropdownVisible(false);
  };
  if (!id) {
    console.error("UID is missing or invalid.");
    Alert.alert("Error", "Unable to identify the report.");
    return;
  }
  const handleSubmit = async () => {
    try {
      console.log("Report ID:", id);
      const reportRef = doc(dbWeb, "reports", id);
      console.log(reportRef);
      const docSnap = await getDoc(reportRef);
      console.log("Document ID:", docSnap);
      console.log("Document:", docSnap.data());
      if (!docSnap.exists()) {
        console.error("Document not found:", id);
        window.confirm("Error! Document not found. Unable to update.");
        return;
      }

      const updatedReport = {
        ...report,
        additionalInfo: newAdditionalInfo,
        timeOfCrime: dateTime,
        time: time,
        category: selectedValue.toLowerCase(),
        location: newLocation,
        coordinate: coordinate,
      };
      await updateDoc(reportRef, updatedReport);
      console.log("Report updated successfully:", updatedReport);
      Alert.alert("Success", "Report updated successfully");
      router.push({ pathname: "/viewReports" });
    } catch (error) {
      console.error("Error updating report:", error);
      Alert.alert("Error", "Error updating report. Please try again.");
    }
  };

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(category);
  const [items, setItems] = useState(crimeType);
  console.log(timeOfCrime);

  //Date
  const [startDate, setStartDate] = useState<Date | null>(parsedEditedDateTime);

  useEffect(() => {
    const dateInput = format(startDate, "yyyy-MM-dd");
    console.log(dateInput);
    console.log("Formatted", parsedEditedDateTime);
    const timeInput = format(startDate, "hh:mm a");
    setNewDate(dateInput);
    setNewTime(timeInput);
    console.log(startDate);
    setDateTime(startDate);
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
        setLocation={setNewLocation}
        additionalInfo={newAdditionalInfo}
        setAdditionalInfo={setNewAdditionalInfo}
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
              value={newLocation}
              onChangeText={setNewLocation}
            />
            <Text>Date and Time Happened:</Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <TextInput
                style={webstyles.inputField}
                value={newDate}
                onChangeText={setNewDate}
                aria-disabled
              />
              <TextInput
                style={webstyles.inputField}
                value={newTime}
                onChangeText={setNewTime}
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
              value={newAdditionalInfo}
              onChangeText={setNewAdditionalInfo}
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
                onPress={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to save your changes?"
                    )
                  ) {
                    handleSubmit();
                  } else {
                    return;
                  }
                }}
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
