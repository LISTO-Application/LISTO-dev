//React Imports
import {
    Platform,
    Image,
    StyleSheet,
    Pressable,
    View,
    Text,
    TouchableOpacity,
    ImageSourcePropType,
    Modal,
    ActivityIndicator,
    Alert,
  } from "react-native";
  import MapView, { Callout, LatLng, Polygon } from "react-native-maps";
  import { Marker } from "react-native-maps";
  import { PROVIDER_GOOGLE, Heatmap } from "react-native-maps";
  import {
    Map,
    APIProvider,
    useMapsLibrary,
    useMap,
  } from "@vis.gl/react-google-maps";
  import { GestureHandlerRootView } from "react-native-gesture-handler";
  import { useMemo, useCallback, useRef, useState, useEffect, SetStateAction } from "react";
  import { Calendar } from "react-native-calendars";
  
  //Expo Imports
  import { router, useFocusEffect, Redirect } from "expo-router";

  //Auth Imports
  //import { useSession } from "@/auth"; (LEGACY)
  import { firebase } from "@react-native-firebase/auth";
  //JWT Imports (LEGACY)
  // import "core-js/stable/atob";
  // import { jwtDecode } from "jwt-decode";
  
  //Component Imports
  import { ThemedText, SpacerView, DateDisplay, FilterHeatMap, DateModal, LoadingScreen, ThemedButton } from "@/components";
  import { AnimatePresence, MotiView, useDynamicAnimation } from "moti";
  import { Skeleton } from "moti/skeleton";
  import { Ionicons } from "@expo/vector-icons";
  
  //Bottom Sheet Import
  import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
  
  //Portal Imports
  import { Portal } from "@gorhom/portal";
  import CustomPolygon from "@/components/CustomPolygon";
  import { FirebaseFirestoreTypes, Timestamp } from "@react-native-firebase/firestore";

  // FN Imports
   import { addMonths, endOfDay, endOfMonth, formatDate, getMonth, getTime, isAfter, isBefore, isMatch, isThisYear, max, min, set, setDate, startOfDay, startOfMonth, subMonths, subYears } from "date-fns";
  
  //Image Imports
  
  const all = require("../../assets/images/all-button.png");
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
  const murderMarker = require("../../assets/images/murder-marker.png");
  const homicideMarker = require("../../assets/images/homicide-marker.png");
  const theftMarker = require("../../assets/images/thief-marker.png");
  const carnappingMarker = require("../../assets/images/car-marker.png");
  const injuryMarker = require("../../assets/images/injury-marker.png");
  const robberyMarker = require("../../assets/images/robbery-marker.png");
  const rapeMarker = require("../../assets/images/rape-marker.png");
  
  export default function CrimeMap() {

    const session = firebase.auth().currentUser;
    if(session == null) {
      router.replace("../(auth)/login");
    }

    // GOOGLE MAPS
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

    const mapRef = useRef<MapView>(null);

    useEffect(() => {
      if (mapRef.current) {
        // Set the map boundaries after the map has loaded
        mapRef.current.setMapBoundaries(
          mapBoundaries.northEast,
          mapBoundaries.southWest
        );
      }
    }, []);

    const mapBoundaries = {
      northEast: { latitude: 14.693963, longitude: 121.101193 },
      southWest: { latitude: 14.649732, longitude: 121.067052 }
    };

    //FILTERS
    const categories = [
      { id: 1, name: "Murder", icon: murder as ImageSourcePropType },
      { id: 2, name: "Theft", icon: theft as ImageSourcePropType },
      { id: 3, name: "Carnapping", icon: carnapping as ImageSourcePropType },
      { id: 4, name: "Homicide", icon: homicide as ImageSourcePropType },
      { id: 5, name: "Injury", icon: injury as ImageSourcePropType },
      { id: 6, name: "Robbery", icon: robbery as ImageSourcePropType },
      { id: 7, name: "Rape", icon: rape as ImageSourcePropType },
    ];
    const filterSheetRef = useRef<BottomSheet>(null);
    const filterSnapPoints = useMemo(() => ["25%"], []);
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const [categoryStates, setCategoryStates] = useState(
      categories.map(() => true)
    );
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
    useFocusEffect(
      useCallback(() => {
        return () =>
          filterSheetRef.current?.close() || calendarSheetRef.current?.close();
      }, [])
    );

    //CALENDAR
    const initialDate = {timestamp: Timestamp.now().toMillis(), date: Timestamp.now().toDate()}
    const minDate = formatDate(subYears(initialDate.date, 4), "yyyy-MM-dd");
    const maxDate = formatDate(initialDate.date, "yyyy-MM-dd");
    const calendarSheetRef = useRef<BottomSheet>(null);
    const calendarSnapPoints = useMemo(() => ["65%"], []);
    const [dateMode, setDateMode] = useState("month");
    const [current, setCurrent] = useState(initialDate.date);
    const [isCalendarSheetOpen, setIsCalendarSheetOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(formatDate(initialDate.date, "yyyy-MM-dd").toString());
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
  
    //CRIME DATA
    const crimeMarkers = {
      theft: theftMarker,
      rape: rapeMarker,
      murder: murderMarker,
      homicide: homicideMarker,
      carnapping: carnappingMarker,
      injury: injuryMarker,
      robbery: robberyMarker,
    };

    useEffect(() => {
      const fetchData = async () => {
        if(session != null) {
          await firebase.firestore().collection("crimes")
            .where("timeStamp", ">", getTime(startOfMonth(initialDate.date)))
            .where("timeStamp", "<", getTime(endOfMonth(initialDate.date)))
            .get()
            .then((querySnapshot) => {
              const fetchedCrimeData: SetStateAction<FirebaseFirestoreTypes.DocumentData[]> = [];
              const fetchedCoordinates: ((prevState: LatLng[]) => LatLng[]) | { latitude: any; longitude: any; }[] = [];
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedCrimeData.push(data);
                fetchedCoordinates.push({ latitude: data.coordinate.latitude, longitude: data.coordinate.longitude });
              });
              setCrimeData(fetchedCrimeData);
            });
        }
      };
      setTimeout(() => {
        fetchData();
      }, 3000);
      return
    }, []);

    useEffect(() => {
      if(session != null) {
          setHeatmapData([])
          console.log("Fetching all data...");
          setTimeout(async () => {
            await firebase.firestore().collection("crimes")
            .get()
            .then((querySnapshot) => {
              let heatmapData = [] as LatLng[];
              querySnapshot.forEach((doc) => {
                console.log("Adding data..." + doc.data().category);
                heatmapData.push({latitude: doc.data().coordinate.latitude, longitude: doc.data().coordinate.longitude});
              });
              setTimeout(() => {
                console.log("SETTING HEATMAP DATA");
                setHeatmapData(heatmapData);
                console.log("HEATMAP DATA SET");
              }, 2000);
            })
            .catch((error) => {
              console.log("Error getting documents: ", error);
              if (error.code == "firestore/permission-denied") {
                Alert.alert("Permission Denied", "You do not have permission to access this data.");
              } else {
                Alert.alert("Could not get crime data", "There was an issue with getting the crime data, please try again.")
              } 
            })
          }, 5000);
        } 
    }, []);

    const detailsRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["50%"], []);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [loadingDetails, setIsDetailsLoading] = useState(false)

    const handleSheetChange = useCallback((index: any) => {
      setIsDetailsOpen(index !== -1);
    }, []);

    const handleSnapPress = useCallback((index: number) => {
      detailsRef.current?.snapToIndex(index);
    }, []);

    const [crimeData, setCrimeData] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);
    const [coordinates, setHeatmapData] = useState<LatLng[]>([]);
    const [detailsData, setDetailsData] = useState<FirebaseFirestoreTypes.DocumentData>();
  
    const [isHeatMapOn, setIsHeatMapOn] = useState(false);
    const [loading, setIsLoading] = useState(false);

    const filteredCrimeData = useMemo(() => crimeData.filter(crime => {
        const categoryIndex = categories.findIndex(category => category.name.toLowerCase() === crime.category.toLowerCase());
        return categoryStates[categoryIndex];
      }), [categoryStates, crimeData])

    const load = useDynamicAnimation(() => {
      return {
        opacity: 1,
      }
    });
  
    if (Platform.OS === "android") {

      return (
        
        <GestureHandlerRootView >
          <MotiView
            style = {{height:"100%", width: "100%", justifyContent: "center", alignItems: "center"}}
            state={load}
          >
            {!loading && <MapView
              style={style.map}
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              minZoomLevel={14}
              maxZoomLevel={17}
              cameraZoomRange={{
                minCenterCoordinateDistance: 14,
                maxCenterCoordinateDistance: 17,
                animated: true,
              }}
              region={{
                latitude: 14.694352,
                longitude: 121.068885,
                latitudeDelta: 0.045143,
                longitudeDelta: 0.032284,
              }}
              loadingEnabled={true}
              loadingBackgroundColor="#115272"
              loadingIndicatorColor="#FFF"
              loadingFallback={<LoadingScreen/>}
              googleMapId= {isHeatMapOn ? "e34d889a373119e6" : "5cc51025f805d25d"}
              
            >
              {isHeatMapOn && coordinates && (
                <Heatmap points={coordinates} radius={40}></Heatmap>
              )}

              {
                !isHeatMapOn && filteredCrimeData.map((crime, index) => {
                  return (
                    <AnimatePresence key={index}>
                      <MotiView
                      from={{opacity:0}}
                      animate={{ opacity: 1 }}
                      exit={{opacity:0}}
                      >
                        <Marker
                          coordinate={{
                            latitude: crime.coordinate.latitude,
                            longitude: crime.coordinate.longitude,
                          }}
                          onPress={async () => {
                            setDetailsData(undefined);
                            setIsDetailsLoading(true);
                            setTimeout(async () => {
                              handleSnapPress(0);
                              await setDetailsData(crime);
                              setIsDetailsLoading(false);
                            }, 1000);
                          }}
                          icon={crimeMarkers[crime.category as keyof typeof crimeMarkers]}
                          tracksViewChanges={false}
                          tracksInfoWindowChanges={false}
                        />
                      </MotiView>
                    </AnimatePresence>
                  );
                })
              }
  
            </MapView>}
  
            {!isFilterSheetOpen && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 30,
                  right: 20,
                }}
                onPress={() => handleFilterSnapPress(0)}
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
                onPress={() => {handleFilterClosePress()}}
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
                  if(coordinates.length > 0) {
                    setIsHeatMapOn(true);
                  } else { 
                    Alert.alert("Heatmap Unavailable", "Heatmap data is still loading.")
                  }
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
                width: "100%",
                height: "auto",
                justifyContent: "space-evenly",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
  
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
                  {dateMode != "day" ? formatDate(selectedDate, "MMMM, yyyy") : formatDate(selectedDate, "MMMM dd, yyyy")}
                </Text>
              </TouchableOpacity>

            </View>
          </MotiView>
  
          <Portal>
            <BottomSheet ref={filterSheetRef} index={-1} snapPoints={filterSnapPoints} onChange={handleFilterSheetChange} backgroundStyle={{ backgroundColor: "#115272" }} handleIndicatorStyle={{ backgroundColor: "#FFF", width: "40%" }} enablePanDownToClose={true}>
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
  
            {/* CALENDAR SHEET */}
            <BottomSheet
              ref={calendarSheetRef}
              index={-1}
              snapPoints={calendarSnapPoints}
              onChange={handleCalendarSheetChange}
              backgroundStyle={{ backgroundColor: "#115272" }}
              handleIndicatorStyle={{
                backgroundColor: "#FFF",
                width: "40%",
                justifyContent: "center",
                alignItems: "center",
              }}
              enablePanDownToClose={true}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  paddingHorizontal: "5%",
                  paddingVertical: "2.5%",
                  justifyContent: "center",
                }}
              >



                <Calendar
                  style={{width: "100%", height: "75%", marginBottom: "5%"}}
                  current={formatDate(current, "yyyy-MM-dd")}
                  key={formatDate(current, "yyyy-MM-dd")}
                  theme={{
                    calendarBackground: "#115272", textDayFontWeight: "bold", textDayHeaderFontWeight: "bold",
                    selectedDayBackgroundColor: "#DA4B46", dayTextColor: "#FFF", arrowColor: "#FFF",
                    selectedDayTextColor: "#FFF", textSectionTitleColor: "#FFF", monthTextColor: "#FFF",
                    textMonthFontWeight: "black", todayTextColor: "#FECF1A", arrowWidth: 5,
                  }}
                  initialDate={formatDate(current, "yyyy-MM-dd")}
                  minDate={minDate}
                  maxDate={maxDate}
                  hideExtraDays={true}
                  markingType="dot"
                  markedDates={markedDates}
                  onMonthChange={(month) => {
                      if(isThisYear(month.dateString) && !isAfter(month.dateString, maxDate) && !isBefore(month.dateString, minDate)) {
                        setDateMode("month");
                        setSelectedDate(month.dateString);
                      }
                  }}
                  onDayPress={(day) => {
                    setSelectedDate(formatDate(day.dateString, 'yyyy-MM-dddd'));
                    setDateMode("day");
                    console.log(getTime(selectedDate));
                    setMarkedDates({
                      [day.dateString]: {
                        selected: true,
                        selectedColor: "#DA4B46",
                      },
                    });
                  }}
                />

                {!loading && 
                <Pressable
                  style={{
                    backgroundColor: "#DA4B46",
                    height: 36,
                    width: "100%",
                    borderRadius: 50,
                    justifyContent: "center",
                    marginVertical: '2.5%',
                    alignSelf: "center",
                  }}
                onPress={async () => {
                  if(session != null) {
                    setIsLoading(true);
                    load.animateTo((current) => ({...current, opacity: 0.5}))
                    console.log("Searching...");
                    if(dateMode == "month") {
                      console.log("Clearing data...");
                      setCrimeData([]);
                      console.log("Fetching month data: " + formatDate(selectedDate, "yyyy-MM-dd"));
                      await firebase.firestore().collection("crimes")
                      .where("timeStamp", ">", getTime(startOfMonth(selectedDate)))
                      .where("timeStamp", "<", getTime(endOfMonth(selectedDate)))
                      .get()
                      .then((querySnapshot) => {
                        let data = [] as FirebaseFirestoreTypes.DocumentData[];
                        let heatmapData = [] as LatLng[];
                        querySnapshot.forEach((doc) => {
                          console.log("Adding data..." + doc.data().category);
                          data.push(doc.data());
                        });
                        setCrimeData(data);
                        setIsLoading(false);
                        load.animateTo((current) => ({...current, opacity: 1}))
                      })
                      .catch((error) => {
                        setIsLoading(false);
                        load.animateTo((current) => ({...current, opacity: 1}))
                        console.log("Error getting documents: ", error);
                        if (error.code == "firestore/permission-denied") {
                          Alert.alert("Permission Denied", "You do not have permission to access this data.");
                        } else {
                          Alert.alert("Could not get crime data", "There was an issue with getting the crime data, please try again.")
                        }
                        
                      })
                    } else if(dateMode == "day") {
                        setCrimeData([]);
                        firebase.firestore().collection("crimes")
                          .where("timeStamp", ">", getTime(startOfDay(selectedDate)))
                          .where("timeStamp", "<", getTime(endOfDay(selectedDate)))
                          .get()
                          .then((querySnapshot) => {
                            let data = [] as FirebaseFirestoreTypes.DocumentData[];
                            let heatmapData = [] as LatLng[];
                            querySnapshot.forEach((doc) => {
                              console.log("Adding data..." + doc.data().category);
                              data.push(doc.data());
                            });
                            setCrimeData(data);
    
                            setIsLoading(false);
                            load.animateTo((current) => ({...current, opacity: 1}))
                          })
                          .catch((error) => {
                            setIsLoading(false);
                            load.animateTo((current) => ({...current, opacity: 1}))
                            console.log("Error getting documents: ", error);
                            if (error.code == "firestore/permission-denied") {
                              Alert.alert("Permission Denied", "You do not have permission to access this data.");
                            } else {
                              Alert.alert("Could not get crime data", "There was an issue with getting the crime data, please try again.")
                            }
                        })
                    }
                }}}>
                  <Text
                    style = {{width: '100%', height: "100%", color: "#FFF", fontWeight: "bold", fontSize: 16, textAlign: "center", textAlignVertical: "center"}}>
                      Search
                  </Text>
                </Pressable>}

                {loading && 
                <Pressable
                  style={{
                    backgroundColor: "#DA4B46",
                    height: 36,
                    width: "100%",
                    borderRadius: 50,
                    justifyContent: "center",
                    marginVertical: '5%',
                    alignSelf: "center",
                    paddingVertical: loading ? '2.5%' : 0
                  }}>
                    <ActivityIndicator size="large" color="#FFF"/>
                </Pressable>}
              </View>
            </BottomSheet>

            {/* DETAILS SHEET */}
            <BottomSheet ref={detailsRef} index={-1} snapPoints={snapPoints} onChange={handleSheetChange} backgroundStyle={{backgroundColor: '#115272'}} handleIndicatorStyle={{backgroundColor: '#FFF', width: '40%'}} enablePanDownToClose={true}>
                    <View style = {{ width: "90%", height: "100%", justifyContent: 'flex-start', marginHorizontal: "auto", paddingVertical: "2.5%", flexDirection: "column",}}>
                      {!loadingDetails ? <Text style = {{color: "#D4D4D4", fontWeight: "bold", fontSize: 16, marginVertical: "1.5%"}}>{detailsData?.location}</Text> : <Skeleton colorMode="light" width="75%" height={28} show={loadingDetails} radius={20}/>}
                      {loadingDetails && <View style = {{height: "5%"}}/>}
                      {!loadingDetails ? <Text style = {{color: "#FFF", fontWeight: "bold", fontSize: 32, marginVertical: "2.5%"}}>{detailsData?.category.charAt(0).toUpperCase() + detailsData?.category.slice(1)}</Text> : <Skeleton colorMode="light" width="75%" height={36} show={loadingDetails} radius={20}/>}
                      {loadingDetails && <View style = {{height: "5%"}}/>}
                      {!loadingDetails ? <View style = {{backgroundColor: "#FFF", marginVertical: "2.5%", paddingHorizontal: "1.5%", paddingVertical: "1.5%", flexDirection: 'row', borderRadius: 50,}}>
                        <Ionicons name="time" size={24} color="#115272" />
                        <Text style = {{color: "#115272", fontWeight: "bold", fontSize: 14, textAlignVertical: "center", marginHorizontal: "2.5%"}}>{detailsData?.time}</Text>
                      </View> : 
                      <Skeleton colorMode="light" width="100%" height={36} show={loadingDetails} radius={20}/>}
                      {loadingDetails && <View style = {{height: "5%"}}/>}
                      {!loadingDetails ? <View style = {{backgroundColor: "#FFF", marginVertical: "2.5%", paddingHorizontal: "1.5%", paddingVertical: "1.5%", flexDirection: 'row', borderRadius: 50,}}>
                        <Ionicons name="calendar" size={24} color="#115272" />
                        <Text style = {{color: "#115272", fontWeight: "bold", fontSize: 14, textAlignVertical: "center", marginHorizontal: "2.5%"}}>{detailsData?.date}</Text>
                      </View> : 
                      <Skeleton colorMode="light" width="100%" height={36} show={loadingDetails} radius={20}/>}
                      {loadingDetails && <View style = {{height: "5%"}}/>}
                      {!loadingDetails ? <Text style = {{color: "#FFF", fontWeight: "bold", fontSize: 14, borderTopWidth: 5, borderColor: "#FFF", marginVertical: "5%" ,paddingVertical: "5%"}}>{detailsData?.additionalInfo}</Text> : <Skeleton colorMode="light" width="100%" height={100} show={loadingDetails} radius={20}/>}
                    </View>
            </BottomSheet>

          </Portal>
        </GestureHandlerRootView>
      );
    } else if (Platform.OS === "web") {
      const [toggleModal, setToggleModal] = useState(false);
      const position = { lat: 14.685992094228787, lng: 121.07589171824928 };
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
                // onPress={() => handleFilterSnapPress(1)
                onPress={() => {router.replace({
                  pathname: "/(drawer)/viewReports"
                })}  
              }
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
  