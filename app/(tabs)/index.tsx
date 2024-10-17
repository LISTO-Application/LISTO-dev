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
} from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE, Heatmap } from "react-native-maps";
import {
  Map,
  APIProvider,
  useMapsLibrary,
  useMap,
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
import DateModal from "@/components/DateModal";

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

export default function CrimeMap() {
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
  const [selectedDate, setSelectedDate] = useState("2024-10-12");
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
  const heatmapPoints = [
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.685992094228787,
      longitude: 121.07589171824928,
      weight: 1,
    },
    {
      type: "homicide",
      date: "10/20/2024",
      latitude: 14.686502094228787,
      longitude: 121.07629171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.685502094228787,
      longitude: 121.07539171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.685002094228787,
      longitude: 121.07679171824928,
      weight: 1,
    },
    {
      type: "robbery",
      date: "10/20/2024",
      latitude: 14.6857002094228787,
      longitude: 121.07489171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.686992094228787,
      longitude: 121.07789171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.687992094228787,
      longitude: 121.07889171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.688992094228787,
      longitude: 121.07989171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.689992094228787,
      longitude: 121.08089171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.690992094228787,
      longitude: 121.08189171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/21/2024",
      latitude: 14.691992094228787,
      longitude: 121.08289171824928,
      weight: 1,
    },
    {
      type: "injury",
      date: "10/20/2024",
      latitude: 14.692992094228787,
      longitude: 121.08389171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.693992094228787,
      longitude: 121.08489171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.694992094228787,
      longitude: 121.08589171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.695992094228787,
      longitude: 121.08689171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.696992094228787,
      longitude: 121.08789171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.697992094228787,
      longitude: 121.08889171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.698992094228787,
      longitude: 121.08989171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.699992094228787,
      longitude: 121.09089171824928,
      weight: 1,
    },
    {
      type: "theft",
      date: "10/20/2024",
      latitude: 14.700992094228787,
      longitude: 121.09189171824928,
      weight: 1,
    },
  ];

  const [isHeatMapOn, setIsHeatMapOn] = useState(false);
  const position = { lat: 14.685992094228787, lng: 121.07589171824928 };

  if (Platform.OS === "android") {
    return (
      <GestureHandlerRootView>
        <SpacerView
          height="100%"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <MapView
            style={style.map}
            provider={PROVIDER_GOOGLE}
            minZoomLevel={14}
            maxZoomLevel={17}
            cameraZoomRange={{
              minCenterCoordinateDistance: 14,
              maxCenterCoordinateDistance: 17,
              animated: true,
            }}
            region={{
              latitude: 14.685992094228787,
              longitude: 121.07589171824928,
              latitudeDelta: 0.009351,
              longitudeDelta: 0.005772,
            }}
          >
            {!isHeatMapOn && (
              <Marker
                key={0}
                title="Crime Scene #1"
                coordinate={{
                  latitude: 14.685992094228787,
                  longitude: 121.07589171824928,
                }}
              />
            )}

            {isHeatMapOn && (
              <Heatmap points={heatmapPoints} radius={40}></Heatmap>
            )}
          </MapView>

          <Pressable
            style={{
              position: "absolute",
              top: 30,
              left: 20,
            }}
            onPress={() => {}}
          >
            <Image
              style={{
                width: 50,
                height: 50,
              }}
              source={toggler}
            />
          </Pressable>

          {!isFilterSheetOpen && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 30,
                right: 20,
              }}
              onPress={() => handleFilterSnapPress(1)}
            >
              <Image
                style={{
                  width: 50,
                  height: 50,
                }}
                source={filter}
              />
            </TouchableOpacity>
          )}

          {isFilterSheetOpen && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 30,
                right: 20,
              }}
              onPress={() => handleFilterClosePress()}
            >
              <Image
                style={{
                  width: 50,
                  height: 50,
                }}
                source={filter}
              />
            </TouchableOpacity>
          )}

          {!isHeatMapOn && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 110,
                right: 20,
              }}
              onPress={() => {
                setIsHeatMapOn(true);
              }}
            >
              <Image
                style={{
                  width: 50,
                  height: 50,
                }}
                source={marker}
              />
            </TouchableOpacity>
          )}

          {isHeatMapOn && (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 110,
                right: 20,
              }}
              onPress={() => {
                setIsHeatMapOn(false);
              }}
            >
              <Image
                style={{
                  width: 50,
                  height: 50,
                }}
                source={heatmap}
              />
            </TouchableOpacity>
          )}

          <View
            style={{
              position: "absolute",
              bottom: 30,
              width: "75%",
              height: "auto",
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Pressable
              style={{
                width: "auto",
                height: "auto",
              }}
              onPress={() => {}}
            >
              <Image style={{ width: 36, height: 36 }} source={leftArrow} />
            </Pressable>

            <TouchableOpacity
              style={{}}
              onPress={() => {
                handleCalendarSnapPress(0);
              }}
            >
              <Text
                style={{
                  width: "auto",
                  height: "auto",
                  paddingVertical: "1%",
                  backgroundColor: "#115272",
                  paddingHorizontal: "5%",
                  color: "#FFF",
                  fontWeight: "bold",
                  fontSize: 18,
                  borderRadius: 50,
                }}
              >
                {selectedDate}
              </Text>
            </TouchableOpacity>

            <Pressable
              style={{
                width: "auto",
                height: "auto",
              }}
              onPress={() => {}}
            >
              <Image style={{ width: 36, height: 36 }} source={rightArrow} />
            </Pressable>
          </View>
        </SpacerView>

        <Portal>
          <BottomSheet
            ref={filterSheetRef}
            index={-1}
            snapPoints={filterSnapPoints}
            onChange={handleFilterSheetChange}
            backgroundStyle={{ backgroundColor: "#115272" }}
            handleIndicatorStyle={{ backgroundColor: "#FFF", width: "40%" }}
            enablePanDownToClose={true}
          >
            <View style={{ width: "100%", height: "100%" }}>
              <BottomSheetScrollView
                contentContainerStyle={{
                  alignItems: "center",
                  padding: "2.5%",
                }}
                horizontal={true}
              >
                {/* CRIME CATEGORIES */}
                {categories.map((category, index) => (
                  <Pressable
                    key={category.id}
                    onPress={() => handleCategoryPress(index)}
                  >
                    <View style={style.filterSheetItem}>
                      <View
                        style={[
                          style.filterSheetImageContainer,
                          !categoryStates[index] && { opacity: 0.5 },
                        ]}
                      >
                        <Image
                          style={style.filterSheetImage}
                          source={category.icon}
                        />
                      </View>
                      <ThemedText
                        style={style.filterSheetItemTitle}
                        lightColor="#FFF"
                        darkColor="#FFF"
                        type="subtitle"
                      >
                        {category.name}
                      </ThemedText>
                    </View>
                  </Pressable>
                ))}
              </BottomSheetScrollView>
            </View>
          </BottomSheet>

          <BottomSheet
            ref={calendarSheetRef}
            index={-1}
            snapPoints={calendarSnapPoints}
            onChange={handleCalendarSheetChange}
            backgroundStyle={{ backgroundColor: "#115272" }}
            handleIndicatorStyle={{
              backgroundColor: "#FFF",
              width: "40%",
            }}
            enablePanDownToClose={true}
          >
            <View
              style={{
                width: "100%",
                height: "100%",
                paddingHorizontal: "5%",
                paddingVertical: "2.5%",
              }}
            >
              <Calendar
                theme={{
                  calendarBackground: "#115272",
                  textDayFontWeight: "bold",
                  textDayHeaderFontWeight: "bold",
                  selectedDayBackgroundColor: "#DA4B46",
                  dayTextColor: "#FFF",
                  arrowColor: "#FFF",
                  selectedDayTextColor: "#FFF",
                  textSectionTitleColor: "#FFF",
                  monthTextColor: "#FFF",
                  textMonthFontWeight: "black",
                  todayTextColor: "#FECF1A",
                  arrowWidth: 5,
                }}
                headerStyle={{}}
                hideExtraDays={true}
                markingType="dot"
                style={{
                  width: "100%",
                  height: "100%",
                }}
                markedDates={markedDates}
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                  setMarkedDates({
                    [day.dateString]: {
                      selected: true,
                      selectedColor: "#DA4B46",
                    },
                  });
                }}
              />
            </View>
          </BottomSheet>
        </Portal>
      </GestureHandlerRootView>
    );
  } else if (Platform.OS === "web") {
    const [toggleModal, setToggleModal] = useState(false);

    return (
      <GestureHandlerRootView>
        <SpacerView
          height="100%"
          width="100%"
          justifyContent="center"
          alignItems="center"
          backgroundColor="#115272"
        >
          <APIProvider apiKey={"AIzaSyBa31nHNFvIEsYo2D9NXjKmMYxT0lwE6W0"}>
            <Map
              style={style.map}
              defaultCenter={position}
              disableDoubleClickZoom={true}
              defaultZoom={15}
              mapId="5cc51025f805d25d"
              mapTypeControl={false}
              streetViewControl={false}
              mapTypeId="roadmap"
              restriction={{
                latLngBounds: {
                  north: 14.693963,
                  south: 14.669975,
                  west: 121.069508,
                  east: 121.087376,
                },
              }}
              minZoom={15}
              maxZoom={18}
            >
              <PlacesLibrary />
            </Map>
          </APIProvider>

          <Modal
            animationType="fade"
            transparent={true}
            visible={toggleModal}
            onRequestClose={() => setToggleModal(false)}
          >
            <DateModal setToggleModal={setToggleModal} />
          </Modal>

          {!isFilterSheetOpen && (
            <Pressable
              style={{
                position: "absolute",
                top: 120,
                right: 20,
              }}
              onPress={() => handleFilterSnapPress(1)}
            >
              <Image
                style={{
                  width: 50,
                  height: 50,
                }}
                source={filter}
              />
            </Pressable>
          )}

          {isFilterSheetOpen && (
            <Pressable
              style={{
                position: "absolute",
                top: 120,
                right: 20,
              }}
              onPress={() => handleFilterClosePress()}
            >
              <Image
                style={{
                  width: 50,
                  height: 50,
                }}
                source={filter}
              />
            </Pressable>
          )}

          <DateDisplay setToggleModal={setToggleModal} />

          <FilterHeatMap heatmap={heatmap} />
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
  calendarHeader: {
    color: "#FFF",
  },
});
