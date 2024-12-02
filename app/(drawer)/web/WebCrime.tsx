import { Modal, Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { CrimeFilter } from "@/app/(tabs)/crimemap";
import heatmap from "@/app/(tabs)/data/heatmap";
import { MarkerType, crimeImages, CrimeType } from "@/app/(tabs)/data/marker";
import { db } from "@/app/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { getDocs, collection } from "@react-native-firebase/firestore";
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
import dayjs from "dayjs";
import { DateType, ModeType } from "react-native-ui-datepicker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DateDisplay from "../../../components/DateDisplay";
import FilterHeatMap from "../../../components/FilterHeatMap";
import { MarkerWithInfoWindow } from "../../../components/MarkerWithInfoWindow";
import DateModal from "../../../components/modal/DateModal";
import FilterWebModal from "../../../components/modal/FilterWebModal";
import { SpacerView } from "../../../components/SpacerView";
import WebHeatmap from "../../../components/WebHeatmap";
import { FeatureCollection, Point } from "geojson";
import {
  EarthquakesGeojson,
  loadEarthquakeGeojson,
} from "@/constants/earthquakes";

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

export default function WebCrime({
  navigation,
  isHeatmapVisible,
  filteredHeatmap,
  toggleHeatmap,
  filter,
  position,
}: {
  navigation: any;
  isHeatmapVisible: any;
  filteredHeatmap: any;
  toggleHeatmap: any;
  filter: any;
  position: any;
}) {
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
  //Heatmap
  const [radius, setRadius] = useState(25);
  const [opacity, setOpacity] = useState(0.8);
  const [earthquakesGeojson, setEarthquakesGeojson] =
    useState<EarthquakesGeojson>({ type: "FeatureCollection", features: [] });
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

  //Fetching the Data
  const fetchCrimes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "crimes"));
      const crimeList: MarkerType[] = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const coordinate = doc.data().coordinate;
          const location = doc.data().location;

          if (!coordinate) {
            console.warn("Skipping invalid location:", location);
            return null;
          }
          return {
            id: doc.id,
            title: doc.data().title,
            location: doc.data().location,
            coordinate: coordinate,
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

  useEffect(() => {
    loadEarthquakeGeojson().then((data) => setEarthquakesGeojson(data));
  }, []);

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
            defaultZoom={3}
            gestureHandling={"greedy"}
            mapId={isHeatmapVisible ? "7a9e2ebecd32a903" : "5cc51025f805d25d"}
            mapTypeControl={true}
            streetViewControl={false}
            mapTypeId="roadmap"
            scrollwheel={true}
            maxZoom={18}
            minZoom={14}
          >
            {isHeatmapVisible && (
              <WebHeatmap
                geojson={earthquakesGeojson}
                radius={radius}
                opacity={opacity}
              />
            )}
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
                Please set the mode to "single" before using the monthly filter.
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
        <FilterHeatMap heatmap={heatmap} toggleHeatmap={toggleHeatmap} />
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
