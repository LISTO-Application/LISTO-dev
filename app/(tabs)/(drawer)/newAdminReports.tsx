import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
  Animated,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import DropDownPicker from "react-native-dropdown-picker";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { SpacerView } from "@/components/SpacerView";
import { styles } from "@/styles/styles"; // For mobile styles
import { webstyles } from "@/styles/webstyles"; // For web styles
import { useRoute } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../FirebaseConfig"; // Adjust the import path to your Firebase config
import {
  collection,
  addDoc,
  firebase,
  GeoPoint,
  setDoc,
  doc,
} from "@react-native-firebase/firestore";
import { getIconName } from "@/assets/utils/getIconName";
import { SideBar } from "@/components/SideBar";
import { crimeImages, CrimeType } from "@/constants/data/marker";
import dayjs, { Dayjs } from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import { ForceTouchGestureHandler } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { FontAwesome } from "@expo/vector-icons";
import { Image, type ImageSource } from "expo-image";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import { getUnixTime, parse, subDays, subYears } from "date-fns";
import TitleCard from "@/components/TitleCard";
import { Asset } from "expo-asset";
import { authWeb } from "@/app/(auth)";
const database = db;

export interface DropdownCrimeTypes {
  label: string;
  value: string;
}

export let crimeType: DropdownCrimeTypes[] = [
  {
    label: "Murder",
    value: "murder",
  },
  {
    label: "Homicide",
    value: "homicide",
  },
  {
    label: "Theft",
    value: "theft",
  },
  {
    label: "Carnapping",
    value: "carnapping",
  },
  {
    label: "Injury",
    value: "injury",
  },
  {
    label: "Robbery",
    value: "robbery",
  },
  {
    label: "Rape",
    value: "rape",
  },
];

type ImageProps = {
  label: string;
  theme?: "primary";
  onPress?: () => void;
};

type IMGViewerProps = {
  imgSource: ImageSource;
  selectedImage?: string;
};

export default function NewAdminReports({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [date, setDate] = useState("");
  const [reportTime, setReportTime] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("ADMIN"); //TO set the reporter's name
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [imageFilename, setImageFileName] = useState<string | null | undefined>(
    undefined
  );

  const [selectedValue, setSelectedValue] = useState("");

  const handleSelect = (item: { label?: any; value?: any } | undefined) => {
    setSelectedValue(item?.value); // Update the selected value
    setIsDropdownVisible(false); // Close the dropdown
  };

  //GEOCODING

  const geocodeAddress = async (
    address: string
  ): Promise<GeoPoint | string | null | undefined> => {
    if (!address || address.trim() === "") return null;
    const apiKey = "AIzaSyBa31nHNFvIEsYo2D9NXjKmMYxT0lwE6W0";
    const bounds = {
      northeast: "14.693963,121.101193", // Adjusted bounds
      southwest: "14.649732,121.067052",
    };
    const region = "PH";

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&bounds=${bounds.northeast},${bounds.southwest}&region=${region}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        console.log("Geocoded location:", lat, lng);

        const [neLat, neLng] = bounds.northeast.split(",").map(Number);
        const [swLat, swLng] = bounds.southwest.split(",").map(Number);
        console.log(bounds);
        const isWithinBounds =
          lat >= swLat && lat <= neLat && lng >= swLng && lng <= neLng;
        console.log("Within the bounds:", isWithinBounds);

        if (isWithinBounds) {
          return new firebase.firestore.GeoPoint(lat, lng);
        } else {
          console.warn("Location is out of bounds.");
          return null;
        }
      } else {
        console.error("Geocoding error or no results:", data.status);
        return null;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    let resizedImage = null;
    if (selectedImage) {
      try {
        resizedImage = await ImageManipulator.manipulateAsync(
          selectedImage,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
      } catch (error) {
        console.error("Error resizing image:", error);
        alert("Failed to process the image. Please try again.");
        return;
      }
    }

    const locationString = location;
    const geoPoint = await geocodeAddress(locationString);

    if (!geoPoint) {
      console.warn("Skipping invalid location:", locationString);
      alert(`Does not accept locations beyond Quezon City: ${locationString}`);
      return;
    }

    //UID fetch
    const auth = authWeb.currentUser?.uid;
    const uid = auth;
    const authPhone = authWeb.currentUser?.phoneNumber;
    const authName = authWeb.currentUser?.displayName;

    const defaultImage = require("@/assets/images/default-image.jpg");
    const defaultURI = Asset.fromModule(defaultImage).uri;

    //Timestamp
    const timestamp = new Date();
    const unixTimestamp = timestamp.getTime();
    console.log(defaultURI);

    const newCrime = {
      uid: uid,
      category: selectedValue ? selectedValue.toLowerCase() : "Unknown",
      location: location || "Unknown Location",
      coordinate: geoPoint || new GeoPoint(0, 0),
      additionalInfo: additionalInfo || "Undescribed Report",
      date: new Date(date) || ["Unknown Date: ", new Date().toDateString()],
      time: time || ["Unknown Time: ", new Date().toTimeString()],
      image: resizedImage
        ? { filename: imageFilename, uri: resizedImage.uri }
        : { filename: "Untitled Image", uri: defaultURI },
      status: true,
      time: time || "Unknown time",
      timeOfCrime: reportTime,
      timeReported: timestamp,
      unixTOC: unixTimestamp,
    };

    try {
      console.log(newCrime);
      const crimeRef = collection(database, "crimes"); // Save to 'crimes' collection
      await addDoc(crimeRef, newCrime);
      router.push("/ViewAdminEmergencyList"); // Make sure to navigate to the right screen
    } catch (error) {
      console.error("Error saving crime:", error);
      alert("Failed to save crime. Please try again.");
    }
  };

  //Dropdown Values
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState(crimeType);
  //Date
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  useEffect(() => {
    const dateInput = dayjs(startDate).format("YYYY-MM-DD");
    const timeInput = dayjs(startDate).format("hh:mm A");
    console.log(dateInput);
    setDate(dateInput);
    setTime(timeInput);
    setReportTime(startDate);
  }, [startDate]);
  const minDate =
    value === "rape" ? subYears(new Date(), 5) : subDays(new Date(), 365);
  //Image
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setImageFileName(result.assets[0].fileName);
    } else {
      alert("You did not select any image.");
    }
  };
  const PlaceholderImage = require("@/assets/images/background-image.jpg");

  const Button = ({ label, theme, onPress }: ImageProps) => {
    if (theme === "primary") {
      return (
        <View
          style={[
            webstyles.buttonContainer,
            { borderWidth: 4, borderColor: "#ffd33d", borderRadius: 18 },
          ]}
        >
          <Pressable
            style={[webstyles.button, { backgroundColor: "#fff" }]}
            onPress={onPress}
          >
            <FontAwesome
              name={"picture-o"}
              size={18}
              color="#25292e"
              style={webstyles.buttonIcon}
            />
            <Text style={[webstyles.buttonLabel, { color: "#25292e" }]}>
              {label}
            </Text>
          </Pressable>
        </View>
      );
    }
    <View style={webstyles.buttonContainer}>
      <Pressable
        style={webstyles.button}
        onPress={() => alert("You pressed a button.")}
      >
        <Text style={webstyles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>;
  };

  // const ImageViewer = ({ imgSource, selectedImage }: IMGViewerProps) => {
  //   const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  //   return <Image source={imageSource} style={webstyles.image} />;
  // };

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

  if (Platform.OS === "web") {
    return (
      <View style={webstyles.container}>
        <SideBar sideBarPosition={sideBarPosition} navigation={navigation} />
        <TouchableOpacity
          onPress={toggleSideBar}
          style={[
            webstyles.toggleButton,
            { left: isSidebarVisible ? sidebarWidth : 10 },
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
            {
              transform: [{ translateX: contentPosition }],
            },
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
              value={name}
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
              placeholder="House/Building No. Street Name , Subdivision/Village, Barangay, Nearest Landmark (e.g: 14 Faustino, Holy Spirit Drive, etc)"
              placeholderTextColor={"#8c8c8c"}
            />
            <Text>Date and Time Happened:</Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
              }}
            >
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
              placeholder={
                "Additional Information (e.g: suspects involved, witnesses, names, sequence of events, description of area, etc.)"
              }
              placeholderTextColor={"#8c8c8c"}
            />
            {/* <Text>Image Upload:</Text>
            <Text>{imageFilename}</Text>
            <View style={webstyles.footerContainer}>
              <Button
                theme="primary"
                label="Choose a photo"
                onPress={pickImageAsync}
              />
              <Button label="Use this photo" />
            </View>
            <View style={webstyles.imageInputContainer}>
              <View style={webstyles.imageContainer}>
                <ImageViewer
                  imgSource={PlaceholderImage}
                  selectedImage={selectedImage}
                />
              </View>
            </View> */}
            <View style={webstyles.buttonContainereditReport}>
              <TouchableOpacity
                style={webstyles.cancelButtoneditReport}
                onPress={() => router.push("/ViewAdminEmergencyList")}
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
