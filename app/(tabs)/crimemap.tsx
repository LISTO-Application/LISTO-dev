//React Imports
import {
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  Modal,
  useAnimatedValue,
  Button,
} from "react-native";
import MapView from "react-native-maps";
import { Marker, PROVIDER_GOOGLE, Heatmap } from "react-native-maps";
import {
  Map,
  APIProvider,
  useMapsLibrary,
  useMap,
  MapMouseEvent,
  Pin,
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMemo, useCallback, useRef, useState, useEffect } from "react";
import { Calendar, CalendarUtils } from "react-native-calendars";

//Expo Imports
import { useFocusEffect } from "expo-router";

//Component Imports
import { ThemedText } from "@/components/ThemedText";
import { SpacerView } from "@/components/SpacerView";
import { ThemedButton } from "@/components/ThemedButton";
import DateDisplay from "@/components/DateDisplay";

//Bottom Sheet Import
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

//Portal Imports
import { Portal } from "@gorhom/portal";
import { styles } from "@/styles/styles";

const toggler = require("../../assets/images/toggler.png");
const filter = require("../../assets/images/filter.png");
const heatmap = require("../../assets/images/heatmap.png");
const marker = require("../../assets/images/marker-icon.png");
const leftArrow = require("../../assets/images/left-arrow-icon.png");
const rightArrow = require("../../assets/images/right-arrow-icon.png");

const murder = require("../../assets/images/knife-icon.png");
const homicide = require("../../assets/images/homicide-icon.png");
const theft = require("../../assets/images/thief-icon.png");
const carnapping = require("../../assets/images/car-icon.png");
const injury = require("../../assets/images/injury-icon.png");
const robbery = require("../../assets/images/robbery-icon.png");
const rape = require("../../assets/images/rape-icon.png");

import { addMonths, format, subMonths } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import FilterHeatMap from "@/components/FilterHeatMap";
import DateModal from "@/components/modal/DateModal";
import { MarkerWithInfoWindow } from "@/components/MarkerWithInfoWindow";
import WebHeatmap from "@/components/WebHeatmap";
import heatmapData from "./data/heatmap";
import dayjs, { Dayjs, locale } from "dayjs";
import { CrimeType, MarkerType, crimeImages } from "./data/marker";
import {
  collection,
  doc,
  firebase,
  FirebaseFirestoreTypes,
  GeoPoint,
  getDocs,
  setDoc,
} from "@react-native-firebase/firestore";
import React from "react";
import { DateType, ModeType } from "react-native-ui-datepicker";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import FilterWebModal from "@/components/modal/FilterWebModal";
import Geocoder from "react-native-geocoding";
import * as Location from "expo-location";
import { db } from "../FirebaseConfig";
import { ReactNativeFirebase } from "@react-native-firebase/app";

const PlacesLibrary = () => {
  const map = useMap();
  const placesLib = useMapsLibrary("places");
  const [markers, setMarkers] = useState<google.maps.places.PlaceResult[]>([]);

  useEffect(() => {
    if (!placesLib || !map) return;

    const svc = new placesLib.PlacesService(map);
  }, [placesLib, map]);

  return null;
};

//Interface
export type CrimeFilter = {
  source: any;
  label: string;
};

export default function CrimeMap({ navigation }: { navigation: any }) {
  //FILTER SETTINGS
  const filterSheetRef = useRef<BottomSheet>(null);
  const filterSnapPoints = useMemo(() => ["3%", "23%"], []);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  //FILTER CATEGORIES & STATE
  const categories = [
    { id: 1, name: "Murder", icon: murder as ImageSourcePropType },
    { id: 2, name: "Theft", icon: theft as ImageSourcePropType },
    { id: 3, name: "Carnapping", icon: carnapping as ImageSourcePropType },
    { id: 4, name: "Homicide", icon: homicide as ImageSourcePropType },
    { id: 5, name: "Injury", icon: injury as ImageSourcePropType },
    { id: 6, name: "Robbery", icon: theft as ImageSourcePropType },
    { id: 7, name: "Rape", icon: rape as ImageSourcePropType },
  ];

  const [categoryStates, setCategoryStates] = useState(
    categories.map(() => false)
  );
  // FILTER CALLBACKS

  const handleFilterSheetChange = useCallback((index: any) => {
    setIsFilterSheetOpen(index !== -1);
  }, []);

  const handleFilterSnapPress = useCallback((index: number) => {
    console.log(filterSheetRef.current?.snapToIndex(index));
    console.log(index);
    filterSheetRef.current?.snapToIndex(index);
  }, []);

  const handleFilterClosePress = useCallback(() => {
    filterSheetRef.current?.close();
  }, []);

  const handleCategoryPress = (index: number) => {
    setCategoryStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );
  };

  //CALENDAR SETTINGS
  const calendarSheetRef = useRef<BottomSheet>(null);
  const calendarSnapPoints = useMemo(() => ["40%"], []);
  const [isCalendarSheetOpen, setIsCalendarSheetOpen] = useState(false);
  // const [selectedDate, setSelectedDate] = useState("2024-10-12");
  const [markedDates, setMarkedDates] = useState<{
    [key: string]: { selected: boolean; selectedColor: string };
  }>({});

  const handleCalendarSheetChange = useCallback((index: any) => {
    setIsCalendarSheetOpen(index !== -1);
  }, []);

  const handleCalendarSnapPress = useCallback((index: number) => {
    calendarSheetRef.current?.snapToIndex(index);
  }, []);

  const handleCalendarClosePress = useCallback(() => {
    calendarSheetRef.current?.close();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () =>
        filterSheetRef.current?.close() || calendarSheetRef.current?.close();
    }, [])
  );

  //HEAT MAP SETTINGS
  // Static array of points for testing
  const heatmapPoints = heatmapData;
  const [isHeatmapVisible, setIsHeatmapVisible] = useState(false);

  const toggleHeatmap = useCallback(() => {
    setIsHeatmapVisible((prev) => {
      console.log("Previous State", prev);
      const newState = !prev;
      console.log("New State", newState);
      return newState;
    });
  }, []);

  const filteredHeatmap = heatmapPoints.filter((point: any) => {
    const selectedCategories = categories
      .filter((_: any, i: any) => categoryStates[i])
      .map((category) => category.name.toLowerCase());

    return selectedCategories.includes(point.type);
  });

  const [isHeatMapOn, setIsHeatMapOn] = useState(false);

  const position = { lat: 14.685992094228787, lng: 121.07589171824928 };

  if (Platform.OS === "android") {
    // return (
    //   <GestureHandlerRootView>
    //     <SpacerView
    //       height="100%"
    //       width="100%"
    //       justifyContent="center"
    //       alignItems="center"
    //     >
    //       <MapView
    //         style={style.map}
    //         provider={PROVIDER_GOOGLE}
    //         minZoomLevel={14}
    //         maxZoomLevel={17}
    //         cameraZoomRange={{
    //           minCenterCoordinateDistance: 14,
    //           maxCenterCoordinateDistance: 17,
    //           animated: true,
    //         }}
    //         region={{
    //           latitude: 14.685992094228787,
    //           longitude: 121.07589171824928,
    //           latitudeDelta: 0.009351,
    //           longitudeDelta: 0.005772,
    //         }}
    //       >
    //         {!isHeatMapOn && (
    //           <Marker
    //             key={0}
    //             title="Crime Scene #1"
    //             coordinate={{
    //               latitude: 14.685992094228787,
    //               longitude: 121.07589171824928,
    //             }}
    //           />
    //         )}
    //         {isHeatMapOn && (
    //           <Heatmap points={heatmapPoints} radius={40}></Heatmap>
    //         )}
    //       </MapView>
    //       <Pressable
    //         style={{
    //           position: "absolute",
    //           top: 30,
    //           left: 20,
    //         }}
    //         onPress={() => {}}
    //       >
    //         <Image
    //           style={{
    //             width: 50,
    //             height: 50,
    //           }}
    //           source={toggler}
    //         />
    //       </Pressable>
    //       {!isFilterSheetOpen && (
    //         <TouchableOpacity
    //           style={{
    //             position: "absolute",
    //             top: 30,
    //             right: 20,
    //           }}
    //           onPress={() => handleFilterSnapPress(1)}
    //         >
    //           <Image
    //             style={{
    //               width: 50,
    //               height: 50,
    //             }}
    //             source={filter}
    //           />
    //         </TouchableOpacity>
    //       )}
    //       {isFilterSheetOpen && (
    //         <TouchableOpacity
    //           style={{
    //             position: "absolute",
    //             top: 30,
    //             right: 20,
    //           }}
    //           onPress={() => handleFilterClosePress()}
    //         >
    //           <Image
    //             style={{
    //               width: 50,
    //               height: 50,
    //             }}
    //             source={filter}
    //           />
    //         </TouchableOpacity>
    //       )}
    //       {!isHeatMapOn && (
    //         <TouchableOpacity
    //           style={{
    //             position: "absolute",
    //             top: 110,
    //             right: 20,
    //           }}
    //           onPress={() => {
    //             setIsHeatMapOn(true);
    //           }}
    //         >
    //           <Image
    //             style={{
    //               width: 50,
    //               height: 50,
    //             }}
    //             source={marker}
    //           />
    //         </TouchableOpacity>
    //       )}
    //       {isHeatMapOn && (
    //         <TouchableOpacity
    //           style={{
    //             position: "absolute",
    //             top: 110,
    //             right: 20,
    //           }}
    //           onPress={() => {
    //             setIsHeatMapOn(false);
    //           }}
    //         >
    //           <Image
    //             style={{
    //               width: 50,
    //               height: 50,
    //             }}
    //             source={heatmap}
    //           />
    //         </TouchableOpacity>
    //       )}
    //       <View
    //         style={{
    //           position: "absolute",
    //           bottom: 30,
    //           width: "75%",
    //           height: "auto",
    //           justifyContent: "space-evenly",
    //           alignItems: "center",
    //           flexDirection: "row",
    //         }}
    //       >
    //         <Pressable
    //           style={{
    //             width: "auto",
    //             height: "auto",
    //           }}
    //           onPress={() => {}}
    //         >
    //           <Image style={{ width: 36, height: 36 }} source={leftArrow} />
    //         </Pressable>
    //         <TouchableOpacity
    //           style={{}}
    //           onPress={() => {
    //             handleCalendarSnapPress(0);
    //           }}
    //         >
    //           <Text
    //             style={{
    //               width: "auto",
    //               height: "auto",
    //               paddingVertical: "1%",
    //               backgroundColor: "#115272",
    //               paddingHorizontal: "5%",
    //               color: "#FFF",
    //               fontWeight: "bold",
    //               fontSize: 18,
    //               borderRadius: 50,
    //             }}
    //           >
    //             {selectedDate}
    //           </Text>
    //         </TouchableOpacity>
    //         <Pressable
    //           style={{
    //             width: "auto",
    //             height: "auto",
    //           }}
    //           onPress={() => {}}
    //         >
    //           <Image style={{ width: 36, height: 36 }} source={rightArrow} />
    //         </Pressable>
    //       </View>
    //     </SpacerView>
    //     <Portal>
    //       <BottomSheet
    //         ref={filterSheetRef}
    //         index={-1}
    //         snapPoints={filterSnapPoints}
    //         onChange={handleFilterSheetChange}
    //         backgroundStyle={{ backgroundColor: "#115272" }}
    //         handleIndicatorStyle={{ backgroundColor: "#FFF", width: "40%" }}
    //         enablePanDownToClose={true}
    //       >
    //         <View style={{ width: "100%", height: "100%" }}>
    //           <BottomSheetScrollView
    //             contentContainerStyle={{
    //               alignItems: "center",
    //               padding: "2.5%",
    //             }}
    //             horizontal={true}
    //           >
    //             {/* CRIME CATEGORIES */}
    //             {categories.map((category, index) => (
    //               <Pressable
    //                 key={category.id}
    //                 onPress={() => handleCategoryPress(index)}
    //               >
    //                 <View style={style.filterSheetItem}>
    //                   <View
    //                     style={[
    //                       style.filterSheetImageContainer,
    //                       !categoryStates[index] && { opacity: 0.5 },
    //                     ]}
    //                   >
    //                     <Image
    //                       style={style.filterSheetImage}
    //                       source={category.icon}
    //                     />
    //                   </View>
    //                   <ThemedText
    //                     style={style.filterSheetItemTitle}
    //                     lightColor="#FFF"
    //                     darkColor="#FFF"
    //                     type="subtitle"
    //                   >
    //                     {category.name}
    //                   </ThemedText>
    //                 </View>
    //               </Pressable>
    //             ))}
    //           </BottomSheetScrollView>
    //         </View>
    //       </BottomSheet>
    //       <BottomSheet
    //         ref={calendarSheetRef}
    //         index={-1}
    //         snapPoints={calendarSnapPoints}
    //         onChange={handleCalendarSheetChange}
    //         backgroundStyle={{ backgroundColor: "#115272" }}
    //         handleIndicatorStyle={{
    //           backgroundColor: "#FFF",
    //           width: "40%",
    //         }}
    //         enablePanDownToClose={true}
    //       >
    //         <View
    //           style={{
    //             width: "100%",
    //             height: "100%",
    //             paddingHorizontal: "5%",
    //             paddingVertical: "2.5%",
    //           }}
    //         >
    //           <Calendar
    //             theme={{
    //               calendarBackground: "#115272",
    //               textDayFontWeight: "bold",
    //               textDayHeaderFontWeight: "bold",
    //               selectedDayBackgroundColor: "#DA4B46",
    //               dayTextColor: "#FFF",
    //               arrowColor: "#FFF",
    //               selectedDayTextColor: "#FFF",
    //               textSectionTitleColor: "#FFF",
    //               monthTextColor: "#FFF",
    //               textMonthFontWeight: "black",
    //               todayTextColor: "#FECF1A",
    //               arrowWidth: 5,
    //             }}
    //             headerStyle={{}}
    //             hideExtraDays={true}
    //             markingType="dot"
    //             style={{
    //               width: "100%",
    //               height: "100%",
    //             }}
    //             markedDates={markedDates}
    //             onDayPress={(day) => {
    //               setSelectedDate(day.dateString);
    //               setMarkedDates({
    //                 [day.dateString]: {
    //                   selected: true,
    //                   selectedColor: "#DA4B46",
    //                 },
    //               });
    //             }}
    //           />
    //         </View>
    //       </BottomSheet>
    //     </Portal>
    //   </GestureHandlerRootView>
    // );
  } else if (Platform.OS === "web") {
    //Buttons
    //Modal show
    const [toggleModal, setToggleModal] = useState(false);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [showError, setShowError] = useState(false);
    //Date selection tool
    const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
    const [dateFunction, setDateFunction] = useState(selectedDate);
    const [mode, setMode] = useState<ModeType>("single");
    //All Markers
    const [allMarkers, setAllMarkers] = useState<MarkerType[]>([]);
    const [pins, setMarkers] = useState<MarkerType[]>([]);
    console.log(pins);
    const [isAddingMarker, setIsAddingMarker] = useState(false);
    //Handlers
    const closeError = () => {
      setShowError(false);
    };
    //handle filter button click
    const [selectedCrimeFilters, setSelectedCrimeFilters] = useState<
      CrimeFilter[]
    >([]);

    const handleFilterCrimeButtonClick = (selectedCrime: CrimeFilter) => {
      setSelectedCrimeFilters((prevFilters) => {
        const isActive = prevFilters.some(
          (filter) => filter.label === selectedCrime.label
        );
        return isActive
          ? prevFilters.filter((filter) => filter.label !== selectedCrime.label)
          : [...prevFilters, selectedCrime];
      });
    };
    const confirmFilter = () => {
      // filterByCrime();
      setIsFilterModalVisible(false);
    };

    // console.log("markers", pins);

    //GEOCODING

    const geocodeAddress = async (
      address: string
    ): Promise<GeoPoint | string | null | undefined> => {
      if (!address || address.trim() === "") return null;
      const apiKey = "AIzaSyBa31nHNFvIEsYo2D9NXjKmMYxT0lwE6W0";
      const bounds = {
        northeast: "14.7741,121.0947",
        southwest: "14.6082,121.0244",
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
            northeast: { lat: neLat, lng: neLng },
            southwest: { lat: swLat, lng: swLng },
          });
          console.log(data.results[0].geometry.bounds);

          if (isWithinBounds) {
            return new firebase.firestore.GeoPoint(lat, lng);
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

    //Fetching the Data
    const fetchCrimes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "crimes"));
        const crimeList: MarkerType[] = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const locationString = doc.data().location;
            const geoPoint = await geocodeAddress(locationString);

            if (!geoPoint) {
              console.warn("Skipping invalid location:", locationString);
              return null;
            }
            return {
              id: doc.id,
              title: doc.data().title,
              location: geoPoint,
              date: doc.data().date,
              details: doc.data().additionalInfo,
              crime: doc.data().category,
              image: crimeImages[doc.data().category as CrimeType],
            };
          })
        );

        const validCrimes = crimeList.filter((crime) => crime !== null);
        console.log("Valid Crimes: ", validCrimes);
        console.log("markers", crimeList);
        setMarkers(validCrimes);
        setAllMarkers(validCrimes);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        fetchCrimes();
      });
      return unsubscribe;
    }, [navigation]);

    return (
      <GestureHandlerRootView>
        <SpacerView
          height="100%"
          width="100%"
          justifyContent="center"
          alignItems="center"
          backgroundColor="#115272"
        >
          <APIProvider
            apiKey={"AIzaSyBa31nHNFvIEsYo2D9NXjKmMYxT0lwE6W0"}
            region="PH"
          >
            <Map
              style={style.map}
              defaultCenter={position}
              disableDoubleClickZoom={true}
              defaultZoom={15}
              mapId="5cc51025f805d25d"
              mapTypeControl={true}
              streetViewControl={false}
              mapTypeId="roadmap"
              scrollwheel={true}
              minZoom={14}
              maxZoom={20}
            >
              <MarkerWithInfoWindow
                markers={pins}
                selectedDate={selectedDate}
                allMarkers={allMarkers}
                setMarkers={setMarkers}
                selectedCrimeFilters={selectedCrimeFilters}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></View>
              <FilterHeatMap heatmap={heatmap} toggleHeatmap={toggleHeatmap} />
              {isHeatmapVisible && <WebHeatmap heatmap={filteredHeatmap} />}
              <PlacesLibrary />
            </Map>
          </APIProvider>

          <Modal
            animationType="fade"
            transparent={true}
            visible={isFilterModalVisible}
            onRequestClose={() => setIsFilterModalVisible(false)}
          >
            <FilterWebModal
              confirmFilter={confirmFilter}
              handleFilterCrimeButtonClick={handleFilterCrimeButtonClick}
              selectedCrimeFilters={selectedCrimeFilters}
            />
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={toggleModal}
            onRequestClose={() => setToggleModal(false)}
          >
            <DateModal
              allMarkers={allMarkers}
              dateFunction={dateFunction}
              mode={mode}
              setToggleModal={setToggleModal}
              setSelectedDate={setSelectedDate}
              setMarkers={setMarkers}
              setIsAddingMarker={setIsAddingMarker}
              setDateFunction={setDateFunction}
              setMode={setMode}
            />
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={showError}
            onRequestClose={() => setShowError(false)}
          >
            <View style={style.modalOverlay}>
              <View style={style.modalContent}>
                <Text style={style.modalText}>
                  Please set the mode to "single" before using the monthly
                  filter.
                </Text>
                <Pressable style={style.button} onPress={closeError}>
                  <Text style={style.buttonText}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          <Pressable
            style={{
              position: "absolute",
              top: 120,
              right: 20,
            }}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Image
              style={{
                width: 50,
                height: 50,
              }}
              source={filter}
            />
          </Pressable>
          {/* Megaphone Button */}
          <Pressable
            style={{
              position: "absolute",
              top: 190, // Adjust the top position to be below the filter button
              right: 20,
              width: 50, // Circle size (adjust as needed)
              height: 50, // Circle size (adjust as needed)
              borderRadius: 30, // Make it circular
              borderWidth: 3, // Border width
              borderColor: "#115272", // Border color
              justifyContent: "center", // Center icon within circle
              alignItems: "center",
              backgroundColor: "#fff", // Center icon within circle
            }}
            onPress={() => navigation.navigate("NewReports")} // Navigate to NewReports screen
          >
            <Ionicons
              name="megaphone" // Ionicons megaphone icon
              size={30} // Icon size (adjust to fit within the circle)
              color="#115272" // Set color of the icon
            />
          </Pressable>
          <DateDisplay
            markers={pins}
            allMarkers={allMarkers}
            dateFunction={dateFunction}
            setToggleModal={setToggleModal}
            setMarkers={setMarkers}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setDateFunction={setDateFunction}
            setShowError={setShowError}
          />
        </SpacerView>
      </GestureHandlerRootView>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: "100%",
    height: 792,
  },
  filterSheetItem: {
    width: 130,
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  filterSheetImageContainer: {
    width: "75%",
    aspectRatio: 1,
    backgroundColor: "#DA4B46",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#FFF",
  },
  filterSheetImage: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  filterSheetItemTitle: {
    width: "100%",
    height: "25%",
    marginTop: 10,
    textAlign: "center",
    verticalAlign: "top",
  },
  button: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    height: "50%",
    width: "50%",
    borderRadius: 15,
    backgroundColor: "#115272",
  },
  buttonText: {
    color: "white",
  },
  calendarHeader: {
    color: "#FFF",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "50%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
});
