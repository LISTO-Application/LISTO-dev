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
  Button,
  Pressable,
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
import { app, authWeb, dbWeb } from "@/app/(auth)";
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
import { firebase } from "@react-native-firebase/firestore";
import { Image as Img, type ImageSource } from "expo-image";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  UploadMetadata,
} from "firebase/storage";

type ImageProps = {
  label: string;
  theme?: "primary";
  onPress?: () => void;
};

type IMGViewerProps = {
  imgSource: string;
  selectedImage?: string;
};

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
  //Parse Image
  const parsedImage = JSON.parse(image);
  const editFilename = parsedImage.filename;
  const originalImage = parsedImage.uri;
  const editImageLink = parsedImage.uri;

  //Render Image
  const bucketUrl =
    "https://firebasestorage.googleapis.com/v0/b/listo-dev-18c26.firebasestorage.app/o/";
  const imagePath = editImageLink;
  const encodedPath = encodeURIComponent(imagePath);
  console.log(encodedPath);
  console.log(imagePath);
  const imageUrl = `${bucketUrl}${encodedPath}?alt=media`;
  console.log(imageUrl);

  console.log("EDIT FILENAME", editFilename);
  console.log("URI", editImageLink);
  // const { name, time, category, location, additionalInfo } = report;
  const [newName, setNewName] = useState(name);
  const [newTime, setNewTime] = useState(time);
  const [newDate, setNewDate] = useState(timeOfCrime);
  const [dateTime, setDateTime] = useState(new Date(parsedEditedDateTime));
  const [selectedValue, setSelectedValue] = useState(category);
  const [newLocation, setNewLocation] = useState(location);
  const [newAdditionalInfo, setNewAdditionalInfo] = useState(additionalInfo);
  const [newCategory, setNewCategory] = useState<DropdownCrimeTypes | null>();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    imageUrl
  );
  const [imageFilename, setImageFileName] = useState<string | null | undefined>(
    editFilename
  );

  //Coordinates
  let stringCoordinate = coordinate;
  const [latitude, longitude] = stringCoordinate.split(",").map(Number);

  console.log(latitude, longitude);
  const geoPoint = new firebase.firestore.GeoPoint(latitude, longitude);
  console.log(geoPoint);
  const handleSelect = (item: DropdownCrimeTypes | undefined) => {
    setSelectedValue(item?.label);
    setIsDropdownVisible(false);
  };
  if (!id) {
    console.error("UID is missing or invalid.");
    Alert.alert("Error", "Unable to identify the report.");
    return;
  }

  const geocodeAddress = async (
    address: string
  ): Promise<GeoPoint | string | null | undefined> => {
    if (!address || address.trim() === "") return null;
    const apiKey = "AIzaSyDoWF8JDzlhT2xjhuInBtMmkhWGXg2My0g";
    const bounds = {
      northeast: "14.693963,121.101193", // Adjusted bounds
      southwest: "14.649732,121.067052",
    };
    const region = "PH";

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&bounds=${bounds.northeast}|${bounds.southwest}&region=${region}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK") {
        console.log(data.results[0]);
        const { lat, lng } = data.results[0].geometry.location;
        console.log("Geocoded location:", lat, lng);

        const [neLat, neLng] = bounds.northeast.split(",").map(Number);
        const [swLat, swLng] = bounds.southwest.split(",").map(Number);
        console.log(bounds);
        const isWithinBounds =
          lat <= neLat && lat >= swLat && lng <= neLng && lng >= swLng;
        console.log("Within the bounds:", isWithinBounds);
        console.log("Parsed bounds:", {
          northwest: { lat: neLat, lng: neLng },
          southeast: { lat: swLat, lng: swLng },
        });
        console.log(data.results[0].geometry.bounds);

        if (isWithinBounds) {
          return new GeoPoint(lat, lng);
        }
      } else {
        console.error("Geocoding error:", data.status);
        return null;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  };

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

      //Image
      let resizedImage = null;
      if (selectedImage) {
        try {
          console.log("Resizing image...");
          // Resize the image
          resizedImage = await ImageManipulator.manipulateAsync(
            selectedImage,
            [{ resize: { width: 800 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
          );
        } catch (error) {
          console.error("Error processing and uploading the image:", error);
          alert("Failed to process and upload the image. Please try again.");
          return;
        }
      }

      async function convertUriToFile(
        uri: string,
        filename: string
      ): Promise<File> {
        return new Promise<File>((resolve, reject) => {
          const img = new window.Image();
          img.src = uri;

          img.onload = () => {
            // Create a canvas to draw the image and convert to Blob
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            if (context) {
              canvas.width = img.width;
              canvas.height = img.height;
              context.drawImage(img, 0, 0);

              canvas.toBlob((blob) => {
                if (blob) {
                  const file = new File([blob], filename, {
                    type: "image/jpeg",
                  });
                  resolve(file);
                } else {
                  reject("Failed to convert image to Blob.");
                }
              }, "image/jpeg");
            } else {
              reject("Failed to get canvas context.");
            }
          };

          img.onerror = (error) => reject(error);
        });
      }

      async function uploadImageAndGetURL(
        file: File,
        storagePath: string,
        metadata: UploadMetadata
      ): Promise<string> {
        const storage = getStorage(
          app,
          "gs://listo-dev-18c26.firebasestorage.app"
        );
        const reference = ref(storage, storagePath);
        const snapshot = await uploadBytesResumable(reference, file, metadata);

        console.log("Image uploaded successfully!", snapshot.metadata.fullPath);
        const downloadURL = snapshot.metadata.fullPath;
        return downloadURL;
      }
      let downloadURL = null;
      if (selectedImage) {
        const file = await convertUriToFile(selectedImage, imageFilename); // A File object from a file picker
        const storagePath = `reportImages/${uid}/${imageFilename}`;
        const metadata = {
          contentType: "image/jpeg", // Automatically gets MIME type from the file
        };
        downloadURL = await uploadImageAndGetURL(file, storagePath, metadata);
      } else {
        alert("No image selected, proceeding to create report.");
      }
      const finalImageUri =
        selectedImage === imageUrl ? originalImage : downloadURL;

      // Geocode address to get Firestore GeoPoint
      const locationString = newLocation;
      console.log("Geocoding location:", locationString);
      const firestoreGeoPoint = await geocodeAddress(locationString);

      if (!firestoreGeoPoint && !geoPoint) {
        console.warn("Skipping invalid location:", locationString);
        alert(
          `Does not accept locations beyond Quezon City: ${locationString}`
        );
        return;
      }

      const updatedReport = {
        ...report,
        additionalInfo: newAdditionalInfo,
        timeOfCrime: dateTime,
        time: time,
        category: selectedValue.toLowerCase(),
        location: newLocation,
        coordinate: firestoreGeoPoint,
        image: {
          filename: imageFilename,
          uri: finalImageUri,
        },
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

  // Image Picker
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

  const ImageViewer = ({ imgSource, selectedImage }: IMGViewerProps) => {
    const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

    return <Img source={imageSource} style={webstyles.image} />;
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
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
              }}
            >
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
            </View>
            <View style={webstyles.buttonContainereditReport}>
              <TouchableOpacity
                style={webstyles.cancelButtoneditReport}
                onPress={() => {
                  const finalImageUri =
                    selectedImage === imageUrl ? originalImage : selectedImage;
                  const updatedReport = {
                    ...report,
                    image: {
                      filename: imageFilename,
                      uri: finalImageUri,
                    },
                  };
                  console.log(updatedReport);
                  router.push("/viewReports");
                }}
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
