//React Imports
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, Image, ImageSourcePropType, Alert, ActivityIndicator, Pressable } from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//Expo Imports
import { Redirect, router} from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

//Auth Imports
//import { useSession } from '@/auth/auth'; (LEGACY)
import { firebase } from '@react-native-firebase/auth';
import { GeoPoint } from '@react-native-firebase/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Firebase Imports
import storage from '@react-native-firebase/storage';

//Hooks
import useResponsive from '@/hooks/useResponsive';

// Date FNS
import { formatDate, fromUnixTime, getDate, getMilliseconds, getTime, isMatch, isSameDay, parse, set, sub, subYears, toDate } from 'date-fns';

// UUID Imports
import uuid from 'react-native-uuid';

//Component Imports
import { SpacerView, ThemedButton, AnimatedTouchable, AnimatedPressable, LoadingScreen } from '@/components';
import Clipboard from "@/assets/images/clipboard.svg"
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import { AnimatePresence, MotiView, ScrollView, useDynamicAnimation } from 'moti';
import Thanks from "@/assets/images/thanks.svg"

//Style Imports
import { styles } from '@/styles/styles'; // Adjust the path if necessary

//Icon Imports
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';

// Image Imports
const add = require("../../assets/images/add-button.png");
const murder = require("../../assets/images/knife-icon.png");
const homicide = require("../../assets/images/homicide-icon.png");
const theft = require("../../assets/images/thief-icon.png");
const carnapping = require("../../assets/images/car-icon.png");
const injury = require("../../assets/images/injury-icon.png");
const robbery = require("../../assets/images/robbery-icon.png");
const rape = require("../../assets/images/rape-icon.png");

export default function Report() {

  // AUTHENTICATION STATE
  const session = firebase.auth().currentUser;
  if(session == null) {
    router.replace("../(auth)/login");
  }
  
  // RESPONSIVE VALUES
  const { display, subDisplay, title, subtitle, body, small, height, tiny} = useResponsive();

  // CRIME FILTER IMAGES
  const categories = {
    murder: murder as ImageSourcePropType,
    theft: theft as ImageSourcePropType,
    carnapping: carnapping as ImageSourcePropType, 
    homicide: homicide as ImageSourcePropType,
    injury: injury as ImageSourcePropType,
    robbery: robbery as ImageSourcePropType, 
    rape: rape as ImageSourcePropType,
  };

  // CRIME CATEGORIES
  const crimeTypes = [
    { label: 'Theft', value: 'theft' },
    { label: 'Injury', value: 'injury' },
    { label: 'Murder', value: 'murder' },
    { label: 'Homicide', value: 'homicide' },
    { label: 'Robbery', value: 'robbery' },
    { label: 'Carnapping', value: 'carnapping' },
    { label: 'Rape', value: 'rape' },
  ];

  // MAP REFERENCE
  const mapRef = useRef<MapView>(null);

  // MAP BOUNDARIES
  const mapBoundaries = {
    northEast: { latitude: 14.693963, longitude: 121.101193 },
    southWest: { latitude: 14.649732, longitude: 121.067052 }
  };
  
  // Loading States
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // MODAL STATES
  const [addReportVisible, AddReportVisible] = useState(false);
  const [geoLocateVisible, setGeoLocateVisible] = useState(false);
  const [addReport, setAddReport] = useState(false);

  // FORM INPUTS
  const [selectedValue, setSelectedValue] = useState({ label: 'Select Crime Type', value: '' });
  const [location, setLocation] = useState('Tap to locate the incident');
  const [geoLocation, setGeoLocation] = useState<Location.LocationObject | undefined>({
    coords: {
    latitude: 14.677680, longitude: 121.082830,
    altitude: null,
    accuracy: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  }, timestamp: 0});
  const [date, setDate] = useState(new Date(Date.now()));
  const [time, setTime] = useState(new Date(Date.now()));
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [uploadImage, setUploadImage] = useState("");
  const [detailID, setDetailID] = useState("");

  // REPORT STATES
  const [reports, setReports] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);
  const [details, setDetails] = useState<FirebaseFirestoreTypes.DocumentData | null>(null);

  // RESET INPUT DATA
  function resetData() {
    setSelectedValue({ label: 'Select Crime Type', value: '' });
    setLocation('Tap to locate the incident');
    setGeoLocation({
      coords: {
      latitude: 14.677680, longitude: 121.082830,
      altitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null
    }, timestamp: 0});
    setDate(new Date(Date.now()));
    setUploadImage("");
    setTime(new Date(Date.now()));
    setAdditionalInfo("");
    setDetailID("");
  };

  // IMAGE PICKER
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });
    console.log(result);
    if (!result.canceled) {
      setUploadImage(result.assets[0].uri);
    }
  };

  // GEOLOCATE
  async function getCurrentLocation() {
    console.log("Getting location permissions");
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Could not get location", "Please enable location services to speed up the reporting process.");
      return false;
    } else {
      console.log("Getting location");
      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
      console.log("Setting location");
      console.log(location);
      return location;
    }
  }

  // FETCH REPORTS
  useEffect(() => {
    setReports([]);
    const fetchData = async () => {
      if(session != null) {
        await firebase.firestore().collection("reports")
          .where("uid", "==", session.uid)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              setReports((prevData) => [...prevData, doc]);
            });
          });
      }
    };
    setTimeout(() => {
      fetchData();
    }, 1000);
    return
  }, []);

  // FETCH REPORT IMAGE
  async function fetchReportImage(uri: string) {
    const url = await storage().ref(uri).getDownloadURL();
    return url;
  }

  // HANDLES CRIME CATEGORY SELECTION
  const handleSelect = (item: {label: string, value : string}) => {
    setSelectedValue(item);
    AddReportVisible(false);
  };

  // INITIALIZE MAP
  useEffect(() => {
    Geocoder.init("AIzaSyDoWF8JDzlhT2xjhuInBtMmkhWGXg2My0g");
    if (mapRef.current) {
      mapRef.current.setMapBoundaries(
        mapBoundaries.northEast,
        mapBoundaries.southWest
      );
    }
  }, []);

  return (
    <GestureHandlerRootView>
      <View style={[styles.mainContainer, {opacity: loading ? 0.5 : 1}]}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>My Reports</Text>
          <SpacerView height={80} />
        </View>

        {/* REPORT LIST */}
        {reports.length > 0 ?
          <ScrollView contentContainerStyle = {{width: "100%", height: "auto", justifyContent: "center",}}>{
          reports.map((report, index) => {
            return (
              <MotiView from = {{translateX: 500}} animate={{translateX: 0}} key={index}>
                <TouchableOpacity style = {{width: "98%", height: "auto", flexDirection: "row", backgroundColor: "#115272", borderColor: "#115272", borderWidth: 5, borderRadius: 5, marginHorizontal: "auto", marginVertical: "0.5%"}} 
                onPress={() => {
                  if(report.data().status == 1) {
                    setLoading(true);
                    if(report.data().image.uri != "") {
                      fetchReportImage(reports[index].data().image.uri)
                      .then((url) => {
                        setGeoLocation({coords: {latitude: report.data().coordinate.latitude, longitude: report.data().coordinate.longitude, altitude: null, accuracy: null, altitudeAccuracy: null, heading: null, speed: null}, timestamp: 0});
                        setSelectedValue({label: report.data().category, value: report.data().category});
                        setLocation(report.data().location);
                        setDate(report.data().timeOfCrime.toDate());
                        setUploadImage(url);
                        setTime(report.data().timeOfCrime.toDate());
                        setAdditionalInfo(report.data().additionalInfo);
                        setDetailID(report.id);
                        setDetails({...report.data(), image: {uri: url, filename: ""}});
                        setLoading(false);
                    });
                    } else {
                      setGeoLocation({coords: {latitude: report.data().coordinate.latitude, longitude: report.data().coordinate.longitude, altitude: null, accuracy: null, altitudeAccuracy: null, heading: null, speed: null}, timestamp: 0});
                      setSelectedValue({label: report.data().category, value: report.data().category});
                      setLocation(report.data().location);
                      setDate(report.data().timeOfCrime.toDate());
                      setUploadImage("");
                      setTime(report.data().timeOfCrime.toDate());
                      setAdditionalInfo(report.data().additionalInfo);
                      setDetailID(report.id);
                      setDetails({...report.data()});
                      setLoading(false);
                    }
                  } else {
                    Alert.alert("Report Moderated", "You cannot view a report that has been moderated.");
                  }
                }}>
                  <View style = {{width: "25%",  aspectRatio: 1/1, justifyContent: "center", alignItems: "center", backgroundColor: "#DA4B46", borderRadius: 5, marginRight: "2.5%", marginVertical: "auto"}}>
                    <Image style = {{width: "50%", height: "50%", aspectRatio: 1/1, marginVertical:"auto"}} source={categories[report.data().category as keyof typeof categories]}/>
                  </View>
                  <View style = {{width: "75%", flexDirection: "row", justifyContent: "flex-start"}}>
                    <View style = {{width: "55%"}}>
                      <Text style = {{fontSize: 20, color: "#FFF", fontWeight: "bold", }}>{report.data().category.charAt(0).toUpperCase() + report.data().category.slice(1)}</Text>
                      <View style = {{flexDirection: "row"}}><Ionicons style = {{marginRight: "2.5%"}} name="time"  size={24} color="#FFF"/><Text style = {{fontSize: 10, color: "#FFF", fontWeight: "bold", textAlignVertical: "center"}}>{formatDate(report.data().timeOfCrime.toDate(),"MMMM dd, yyyy") + " at " + formatDate(report.data().timeReported.toDate(), "hh:mma")}</Text></View>
                      <View style = {{flexDirection: "row"}}><Ionicons style = {{marginRight: "2.5%"}} name="location"  size={24} color="#FFF"/><Text style = {{fontSize: 10, color: "#FFF", fontWeight: "bold", textAlignVertical: "center"}}>{report.data().location}</Text></View>
                    </View>
                    <View style = {{width: "20%", justifyContent: "center", alignItems: "center", flexDirection: "column", marginLeft: "15%"}}>
                      {report.data().status == 0 && (
                          <>
                            <MaterialIcons name="save" size={36} color="#FFF" />
                            <Text style={{ fontSize: small, color: "#FFF", fontWeight: "bold" }}>Archived</Text>
                          </>
                        )}
                      {report.data().status == 1 && (
                        <>
                          <MaterialIcons name="pending" size={36} color="#FFF" />
                          <Text style={{ fontSize: small, color: "#FFF", fontWeight: "bold" }}>Pending</Text>
                        </>
                      )}
                      {report.data().status == 2 && (
                        <>
                          <Ionicons name="checkmark-circle" size={36} color="#FFF" />
                          <Text style={{ fontSize: small, color: "#FFF", fontWeight: "bold" }}>Validated</Text>
                        </>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </MotiView>
            );
          }) }
          </ScrollView>
          :
          <View style = {{width: "100%", height: "75%", flexDirection: "column", justifyContent: "center", marginHorizontal: "auto", marginVertical: "0.5%"}}>
            <View style = {{width: "100%", flexDirection: "column", marginHorizontal: "auto", justifyContent: "center", alignItems: "center"}}>
              <Clipboard width={180} height={180}/>
              <Text style = {{fontSize: 20, fontWeight: "bold", color: "#115272", textAlign: "center", marginVertical: "5%"}}>No Reports Yet...</Text>
            </View>
        </View>
        }
        
        {/* FAB ADD REPORT BUTTON */}
        <AnimatedTouchable
          from={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{opacity: 0,}}
          onPress={() => setAddReport(true)}
          transition={{ duration: 1 }}
            style = {[{
              position: 'absolute',
              bottom: 25,
              right: 25,
              marginVertical: 'auto'
            }]}
            >
              <Image style={{
              width: 50,
              height: 50,
              }}
              source={add}/>
        </AnimatedTouchable>

        {/* ADD REPORT MODAL */}
        {addReport && 
        <Modal statusBarTranslucent visible = {addReport} hardwareAccelerated>
          <View style={[styles.headerContainer, {opacity: loading ? 0.5 : 1}]}>
            <Text style={styles.headerText}>Submit a Report</Text>
            <SpacerView height={80} />
          </View>

        <ScrollView style = {{opacity: loading ? 0.5 : 1}} >
            <View style={styles.formContainer}>
              {/* Crime Type */}
              <TouchableOpacity style={styles.dropdown} onPress={() => AddReportVisible(true)}>
                <Text style={styles.selectedText}>{selectedValue.label}</Text>
                <Ionicons name="chevron-down" size={24} color="#115272" />
              </TouchableOpacity>

              <TouchableOpacity style={{padding: 15,borderWidth: 1, borderColor: '#115272', borderRadius: 5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20,}} 
                    onPress={ async () => {
                      await getCurrentLocation().then((location) => {
                        if (location != false) {
                          if(location.coords.latitude <= mapBoundaries.northEast.latitude &&
                            location.coords.longitude <= mapBoundaries.northEast.longitude &&
                            location.coords.latitude >= mapBoundaries.southWest.latitude &&
                            location.coords.longitude >= mapBoundaries.southWest.longitude) {
                              setGeoLocation(location);
                              setGeoLocateVisible(true)
                            } else {
                              Alert.alert("Out of bounds", "You are outside the boundaries of the barangays. Please avoid reporting if the incident is not within the area.", [{text: "OK", onPress: () => {
                                setGeoLocateVisible(true);
                              }}]);
                            }
                        } else {
                          Alert.alert("Could not get location", "Please enable location services to send a distress message.");
                        }
                      });
                    }}>
                <Ionicons name="locate" size={24} color="#115272" />
                <Text style={[styles.selectedText, {marginHorizontal: "2.5%"}, location == "Tap to locate the incident" ? {color: "#B4B4B4"} : {color: "#115272"}]}>{location}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{padding: 15,borderWidth: 1, borderColor: '#115272', borderRadius: 5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20,}} 
                onPress={()=>{
                      DateTimePickerAndroid.open({
                        minimumDate: new Date(subYears(Date.now(), 4)),
                        maximumDate: new Date(Date.now()),
                        value: date,
                        onChange: (event, selectedDate) => {
                          if (selectedDate !== undefined) {
                            setDate(selectedDate);
                          }
                        },
                        mode: 'date',
                        is24Hour: true,
                      });
                    }}>
                <Ionicons name="calendar-outline" size={24} color="#115272" />
                <Text style={[styles.selectedText, {marginHorizontal: "2.5%"}]}>{date.toDateString()}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{padding: 15,borderWidth: 1, borderColor: '#115272', borderRadius: 5, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 20,}} 
                onPress={()=>{
                      DateTimePickerAndroid.open({
                        minimumDate: new Date(subYears(Date.now(), 4)),
                        maximumDate: new Date(Date.now()),
                        value: time,
                        onChange: (event, selectedDate) => {
                          if (selectedDate !== undefined) {
                            setTime(selectedDate);
                          }
                        },
                        mode: 'time',
                        is24Hour: true,
                      });
                    }}>
                <Ionicons name="time-outline" size={24} color="#115272" />
                <Text style={[styles.selectedText, {marginHorizontal: "2.5%"}]}>{formatDate(time, "hh:mm aa")}</Text>
              </TouchableOpacity>

              {/* Additional Information Input */}
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Additional Information"
                placeholderTextColor={'#115272'}
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
                multiline={true}/>

              {/* Image Upload */}
              <TouchableOpacity style={styles.imageUpload} onPress={
                () => {
                  pickImage();
                }
              }>
                {!uploadImage ?
                <>
                  <Ionicons name="image-outline" size={24} color="#115272" />
                  <Text style={{width: "100%", color: "#115272", marginHorizontal: "2.5%"}}>Add file</Text>
                </> :
                  <Image style={{width: "100%", height: "100%", aspectRatio: 1/1}} source={{uri: uploadImage}}/>
                }
              </TouchableOpacity>
              
            </View>
            {/* Action Buttons */}
            <View style={styles.buttonContainerReport}>
              {!loading ? 
              <TouchableOpacity style={styles.cancelButtonReport} onPress={() => {
                setDetails(null);
                setGeoLocation({
                  coords: {
                  latitude: 14.677680, longitude: 121.082830,
                  altitude: null,
                  accuracy: null,
                  altitudeAccuracy: null,
                  heading: null,
                  speed: null
                }, timestamp: 0});
                resetData();
                setAddReport(false)
                setLoading(false);}
                }>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity style={styles.cancelButtonReport}><ActivityIndicator color="#115272" size="large"/></TouchableOpacity>
              }
              <TouchableOpacity
                  style={styles.submitButton}
                  onPress={async () => {
                    const docID = uuid.v4();
                    const reference = storage().ref("/reportImages/" + session?.uid +"/"+ docID);
                    if(location == "Tap to locate the incident") {
                      Alert.alert("Location not set", "Please set the location of the incident.");
                    } else if(selectedValue.value == "") {
                      Alert.alert("No crime selected", "Please select the type of crime.");
                    } else if(uploadImage != "") {
                        setLoading(true);
                        setTimeout(async () => {
                          await reference.putFile(uploadImage).then((snapshot) => {
                            if(snapshot.state == "success") {
                              firebase.firestore().collection("reports")
                                .add({
                                  "category" : selectedValue.value as string,
                                  "coordinate": new GeoPoint(geoLocation?.coords.latitude ?? 0, geoLocation?.coords.longitude ?? 0) as GeoPoint,
                                  "location" : location as string,
                                  "timeOfCrime" : date as Date,
                                  "time" : formatDate(time, "hh:mmaa") as string,
                                  "additionalInfo" : additionalInfo as string,
                                  "image" :  {filename : "", uri: snapshot.metadata.fullPath} as {filename: string, uri: string},
                                  "timeReported" : fromUnixTime(Date.now() / 1000) as Date,
                                  "unixTOC": getTime(date) as number,
                                  "status" : 1 as number,
                                  "uid" : session?.uid as string,
                                  "phone" : session?.phoneNumber as string,
                                  "name" : session?.displayName as string,
                              })
                              .then(async () => {
                                setReports([]);
                                if(session != null) {
                                  await firebase.firestore().collection("reports")
                                    .where("uid", "==", session.uid)
                                    .get()
                                    .then((querySnapshot) => {
                                      let reports = [] as FirebaseFirestoreTypes.DocumentData[];
                                      querySnapshot.forEach((doc) => {
                                        reports.push(doc);
                                      });
                                      setReports(reports);
                                    });
                                }
                                resetData();
                                setLoading(false);
                                setSubmitted(true);
                                setTimeout(() => {
                                  setAddReport(false);
                                }, 2000);
                              })
                              .catch((error) => {
                                setLoading(false);
                                console.log("UH OH", error);
                              });
                            } else {
                              setLoading(false);
                              Alert.alert("Upload Failed", "Please try again.");
                              console.log("Image upload failed");
                            }
                          })
                            .catch((error) => {
                              setLoading(false);
                              Alert.alert("Report failed", "Please try again later!.");
                              console.log(error);
                            });
                        }, 1000);
                      } else {
                        setLoading(true);
                        setTimeout(() => {
                          firebase.firestore().collection("reports")
                          .add({
                            "category" : selectedValue.value as string,
                            "coordinate": new GeoPoint(geoLocation?.coords.latitude ?? 0, geoLocation?.coords.longitude ?? 0) as GeoPoint,
                            "location" : location as string,
                            "timeOfCrime" : date as Date,
                            "time" : formatDate(time, "hh:mmaa") as string,
                            "additionalInfo" : additionalInfo as string,
                            "image" :  {filename : "", uri: ""} as {filename: string, uri: string},
                            "timeReported" : fromUnixTime(Date.now() / 1000) as Date,
                            "unixTOC": getTime(date) as number,
                            "status" : 1 as number,
                            "uid" : session?.uid as string,
                            "phone" : session?.phoneNumber as string,
                            "name" : session?.displayName as string,
                        })
                        .then(async () => {
                          setReports([]);
                          if(session != null) {
                            await firebase.firestore().collection("reports")
                              .where("uid", "==", session.uid)
                              .get()
                              .then((querySnapshot) => {
                                let reports = [] as FirebaseFirestoreTypes.DocumentData[];
                                querySnapshot.forEach((doc) => {
                                  reports.push(doc);
                                });
                                setReports(reports);
                              });
                          }
                          resetData();
                          setLoading(false);
                          setSubmitted(true);
                          setTimeout(() => {
                            setAddReport(false);
                          }, 2000);
                        })
                        .catch((error) => {
                          setLoading(false);
                          console.log(error);
                        });
                        }, 1000)
                      }
                  }}
                >
                  {!loading ?
                  <Text style={[styles.buttonText, { color: '#FFF' }]}>Submit</Text>
                  :
                  <ActivityIndicator size="small" color="#FFF"/>
                  }
                </TouchableOpacity>
            </View>
        </ScrollView>
        </Modal>}

        {/* CRIME CATEGORY MODAL */}
        {addReportVisible && <Modal
          visible={addReportVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => AddReportVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={crimeTypes}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.item} 
                  onPress={() => {
                    handleSelect(item)
                    }}>
                    <Text style={styles.itemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>}

        {/* GEOLOCATION MODAL */}
        {geoLocateVisible && 
        <Modal
          visible={geoLocateVisible}
          transparent={true}
          animationType="slide"
          statusBarTranslucent={true}
          hardwareAccelerated>
            <View style = {{width: "100%", height: "100%", backgroundColor: "#FFF", alignItems:"center", alignSelf: "center", marginVertical: "auto", borderRadius: 5}}>

                <MapView
                style={{width: "100%", height: "100%"}}
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                minZoomLevel={15}
                maxZoomLevel={17}
                cameraZoomRange={{
                  minCenterCoordinateDistance: 14,
                  maxCenterCoordinateDistance: 17,
                  animated: true,
                }}
                onRegionChangeComplete={(region) => {
                  setLocationLoading(true);
                  setTimeout(() => {
                    setGeoLocation({coords: {latitude: region.latitude, longitude: region.longitude, altitude: null, accuracy: null, altitudeAccuracy: null, heading: null, speed: null}, timestamp: 0});
                    // mapRef.current?.addressForCoordinate({latitude: region.latitude, longitude: region.longitude}).then((address) => {
                    //   if (address) {
                    //     setLocation(
                    //       (address.thoroughfare ? address.thoroughfare + (address.subThoroughfare == null ? ", " : " ")  : "") + 
                    //       (address.subThoroughfare != null && address.subThoroughfare ? address.subThoroughfare + ", " : "") + 
                    //       (address.locality ? address.locality + ", " : "") + 
                    //       (address.administrativeArea ? address.administrativeArea + " " : ""));
                    //   }
                    // console.log(location);
                    // setLocationLoading(false);
                    // });
                    Geocoder.from(region.latitude, region.longitude)
                    .then(json => {
                        setLocation(json.results[0].formatted_address);
                        setLocationLoading(false);
                    })
                    .catch(error => console.warn(error));
                  }, 2000);
                }}
                loadingEnabled={true}
                loadingBackgroundColor="#115272"
                loadingIndicatorColor="#FFF"
                googleMapId= "5cc51025f805d25d"
                onMapLoaded={(e) => {
                    if (geoLocation) {
                      mapRef.current?.animateToRegion({
                        latitude: geoLocation.coords.latitude,
                        longitude: geoLocation.coords.longitude,
                        latitudeDelta: 0,
                        longitudeDelta: 0
                      });
                    }
                  }}>

                  {/* {geoLocation && 
                    <Marker
                    coordinate={{latitude: geoLocation.coords.latitude, longitude: geoLocation.coords.longitude}}
                    isPreselected={true}
                    draggable
                    onDragEnd={(coord) => {
                      // setGeoLocation({coords: {latitude: coord.nativeEvent.coordinate.latitude, longitude: coord.nativeEvent.coordinate.longitude, altitude: null, accuracy: null, altitudeAccuracy: null, heading: null, speed: null}, timestamp: 0});
                      mapRef.current?.addressForCoordinate(coord.nativeEvent.coordinate).then((address) => {
                        if (address) {
                          setLocation(
                            (address.thoroughfare ? address.thoroughfare + (address.subThoroughfare == null ? ", " : " ")  : "") + 
                            (address.subThoroughfare != null && address.subThoroughfare ? address.subThoroughfare + ", " : "") + 
                            (address.locality ? address.locality + ", " : "") + 
                            (address.administrativeArea ? address.administrativeArea + ", " : ""));
                        }
                        console.log(address);
                      });
                    }}
                    />
                  } */}

                  <>
                  </>


                </MapView>

              <View style = {{position:"absolute", bottom: 0, left: 0, top: 0, right: 0, justifyContent: "center", alignItems:"center", padding: "1.5%"}}>
                <Ionicons name= "location-sharp" size = {subDisplay} color="#115272" />
              </View>

              <Text style = {{position: "absolute", width: "75%", bottom: "17.5%", borderRadius: 50, fontSize: small, fontWeight: "bold", color: "#115272", textAlign: "center"}}>Pan the map to pin the location.</Text>
              <View style = {{position: "absolute", bottom: "12.5%", width: "75%", backgroundColor: "#FFF", borderWidth: 3, borderColor: "#115272", borderRadius: 50, paddingHorizontal: "2.5%", paddingVertical: "1%", overflow: "scroll"}}>
                {!locationLoading ? 
                <>
                  <ScrollView style = {{borderRadius: 50}} horizontal showsHorizontalScrollIndicator={false}>
                    <Text style = {{borderRadius: 50, fontWeight: "bold", fontSize: small, color: "#115272", textAlign: "left", }}>{location}</Text>
                  </ScrollView>
                </> 
                : 
                <ActivityIndicator style = {{marginHorizontal: "auto"}} size="small" color="#115272"/>
                }
              </View>
              <TouchableOpacity onPress={() => {
                if(locationLoading == false) {
                setGeoLocateVisible(false)
                } else {
                  Alert.alert("Loading location", "Please wait for the location to load before confirming.");
                }
                }} style = {{position: "absolute", bottom: "5%", width: "50%", backgroundColor: "#115272", paddingHorizontal: "2.5%", paddingVertical: "1.5%", borderRadius: 50}}>{!locationLoading ? <Text style = {{textAlign: "center", color: "#FFF"}}>Confirm</Text> : <ActivityIndicator style = {{marginHorizontal: "auto"}} size="small" color="#FFF"/>}</TouchableOpacity>
            </View>
        </Modal>}

          {/* REPORT DETAILS MODAL*/}
          {details && 
          <>
            <MotiView style = {{position: "absolute", width: '100%', height: '100%', flexDirection: "column", backgroundColor: '#FFF', justifyContent: "flex-start", alignItems: "center"}} from = {{scale: 0}} animate={{scale: 1}}>
              <View style={[styles.headerContainer, {width: "100%"}]}>
                <SpacerView height={80} />
                <Image style = {{width: display, height: display, aspectRatio: 1/1, backgroundColor: "#DA4B46", borderRadius: 10, marginHorizontal: "2.5%"}} source={categories[selectedValue.value as keyof typeof categories]}/>
                <TouchableOpacity style = {{flexDirection: "column"}} onPress={() => AddReportVisible(true)}>
                  <Text style = {{ color: "#FFF", fontWeight: 'bold', fontSize: subDisplay, marginHorizontal: "2.5%"}}>{selectedValue.value.charAt(0).toUpperCase() + selectedValue.value.slice(1)}</Text>
                  <Text style = {{ color: "#D4D4D4", fontWeight: 'bold', fontSize: small, marginHorizontal: "2.5%"}}>Reported on {formatDate(details.timeReported.toDate(), "MMMM dd, yyyy")}</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle = {{justifyContent: "center", alignItems: "center"}} style = {{width: "100%"}}>
                <TouchableOpacity style = {{width: "85%", flexDirection: "row", alignItems: "center", paddingVertical: "1.5%", borderRadius: 10, borderWidth: 5, borderColor: "#115272", marginVertical: "2.5%"}} onPress={() => {setGeoLocateVisible(true)}}>
                  <Ionicons style = {{marginHorizontal: "2.5%"}} name="location"  size={title} color="#115272"/>
                  <ScrollView>
                    <Text style = {{ color: "#115272", fontWeight: 'bold', fontSize: subtitle, marginHorizontal: "2.5%"}}> {location} </Text>
                  </ScrollView>
                </TouchableOpacity>
                
                <TouchableOpacity style = {{width: "85%", flexDirection: "row", alignItems: "center", paddingVertical: "2.5%", borderRadius: 10, borderWidth: 5, borderColor: "#115272", marginVertical: "2.5%"}} onPress={() => {
                  DateTimePickerAndroid.open({
                    minimumDate: new Date(subYears(Date.now(), 4)),
                    maximumDate: new Date(Date.now()),
                    value: date,
                    onChange: (event, selectedDate) => {
                      if (selectedDate !== undefined) {
                        setDate(selectedDate);
                      }
                    },
                    mode: 'date',
                    is24Hour: true,
                  });
                }}>
                  <Ionicons style = {{marginHorizontal: "2.5%"}} name="calendar"  size={title} color="#115272"/>
                  <Text style = {{ color: "#115272", fontWeight: 'bold', fontSize: subtitle, marginHorizontal: "2.5%"}}>{formatDate(date, "MMMM dd, yyyy")}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style = {{width: "85%", flexDirection: "row", alignItems: "center", paddingVertical: "2.5%", borderRadius: 10, borderWidth: 5, borderColor: "#115272", marginVertical: "2.5%"}} 
                onPress={() => {
                  DateTimePickerAndroid.open({
                    minimumDate: new Date(subYears(Date.now(), 4)),
                    maximumDate: new Date(Date.now()),
                    value: time,
                    onChange: (event, selectedDate) => {
                      if (selectedDate !== undefined) {
                        setTime(selectedDate);
                      }
                    },
                    mode: 'time',
                    is24Hour: true,
                  });
                }}>
                  <Ionicons style = {{marginHorizontal: "2.5%"}} name="time"  size={title} color="#115272"/>
                  <Text style = {{ color: "#115272", fontWeight: 'bold', fontSize: subtitle, marginHorizontal: "2.5%"}}>{formatDate(time, "hh:mma")}</Text>
                </TouchableOpacity>
                
                <View style = {{width: "85%", flexDirection: "row", alignItems: "center", paddingVertical: "2.5%", borderRadius: 10, borderWidth: 5, borderColor: "#115272", marginVertical: "2.5%"}}>
                  <Ionicons style = {{marginHorizontal: "2.5%"}} name="clipboard-outline"  size={title} color="#115272"/>
                  <ScrollView>
                    <TextInput style = {{ color: "#115272", fontWeight: 'bold', fontSize: subtitle, marginHorizontal: "2.5%"}} value={additionalInfo ? additionalInfo : "N/A"} placeholderTextColor="#115272" multiline onChangeText={setAdditionalInfo}/>
                  </ScrollView>
                </View>
                
                <TouchableOpacity style = {{width: "85%", flexDirection: "row", alignItems: "center", paddingVertical: "2.5%", borderRadius: 10, borderWidth: 5, borderColor: "#115272", marginVertical: "2.5%", justifyContent: "center"}} onPress={() => {pickImage()}}>
                  {uploadImage != "" ? <Image style = {{width: "50%", height: "50%", aspectRatio: 1/1, marginHorizontal: "2.5%"}} source={{uri: uploadImage}}/> : <Ionicons style = {{marginHorizontal: "2.5%"}} name="image"  size={title} color="#115272"/>}
                </TouchableOpacity>

                {details.category != selectedValue.value || details.location != location || getDate(details.timeOfCrime.toDate()) != getDate(date) || details.time != formatDate(time, "hh:mmaa") || details.additionalInfo != additionalInfo || uploadImage != details.image.uri ?
                <TouchableOpacity style={{width: "50%", marginTop: "5%", backgroundColor: "#DA4B46", justifyContent: "center", borderRadius: 50, paddingVertical: "2.5%", marginVertical: "2.5%"}} 
                onPress={ async () => {
                  setLoading(true);
                  if(uploadImage != "" && uploadImage != details.image.uri) {
                    const reference = storage().ref(details.image.uri);
                    await reference.putFile(uploadImage)
                    .then((snapshot) => {
                      if(snapshot.state == "success") {
                        firebase.firestore().collection("reports")
                          .doc(detailID)
                          .update({
                            "category" : selectedValue.value as string,
                            "coordinate": new GeoPoint(geoLocation?.coords.latitude ?? 0, geoLocation?.coords.longitude ?? 0) as GeoPoint,
                            "location" : location as string,
                            "timeOfCrime" : date as Date,
                            "unixTOC":  getTime(date) as number,
                            "time" : formatDate(time, "hh:mmaa") as string,
                            "additionalInfo" : additionalInfo as string,
                            "image" :  {filename : "", uri: snapshot.metadata.fullPath} as {filename: string, uri: string},
                        })
                        .then(async () => {
                          if(session != null) {
                            setReports([]);
                            await firebase.firestore().collection("reports")
                              .where("uid", "==", session.uid)
                              .get()
                              .then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                  setReports((prevData) => [...prevData, doc]);
                                });
                              });
                          }
                          setLoading(false);
                          setSubmitted(true);
                          setTimeout(() => {
                            setDetails(null);
                          }, 2000);
                          resetData();
                        })
                        .catch((error) => {
                          setLoading(false);
                          console.log("BRUUUUUUUUUUH", error);
                        });
                      } else {
                        setLoading(false);
                        Alert.alert("Upload Failed", "Please try again later.");
                        console.log("Image upload failed");
                      }
                    })
                      .catch((error) => {
                        setLoading(false);
                        Alert.alert("Upload Failed", "Please try again later.");
                        console.log(error);
                      });
                  } else {
                    setLoading(true);
                    firebase.firestore().collection("reports")
                    .doc(detailID)
                    .update({
                      "category" : selectedValue.value as string,
                      "coordinate": new GeoPoint(geoLocation?.coords.latitude ?? 0, geoLocation?.coords.longitude ?? 0) as GeoPoint,
                      "location" : location as string,
                      "timeOfCrime" : date as Date,
                      "unixTOC": getTime(date) as number,
                      "time" : formatDate(time, "hh:mmaa") as string,
                      "additionalInfo" : additionalInfo as string,
                  })
                  .then(async () => {
                    setReports([]);
                    if(session != null) {
                      await firebase.firestore().collection("reports")
                        .where("uid", "==", session.uid)
                        .get()
                        .then((querySnapshot) => {
                          let reports = [] as FirebaseFirestoreTypes.DocumentData[];
                          querySnapshot.forEach((doc) => {
                            reports.push(doc);
                          });
                          setReports(reports);
                        });
                    }
                    setLoading(false);
                    setSubmitted(true);
                    resetData();
                    setTimeout(() => {
                      setDetails(null);
                    }, 2000);
                  })
                  .catch((error) => {
                    setLoading(false);
                    Alert.alert("Upload Failed", "Please try again later.");
                    console.log(error);
                  });
                  }
                }}>
                 
                  {!loading ? 
                  <Text style={{color: "#FFF", fontSize: subtitle, fontWeight: "bold", textAlign: "center"}}>
                    Save Changes
                  </Text>
                  :
                  <ActivityIndicator size="small" color="#FFF"/>}
                </TouchableOpacity> : 
                null}
                <TouchableOpacity style={{width: "50%", marginTop: "5%", backgroundColor: "#115272", justifyContent: "center", borderRadius: 50, paddingVertical: "2.5%", marginVertical: "2.5%"}} 
                onPress={() => {
                  setDetails(null);
                  resetData();
                  setDetails(null)
                  }}>
                  <Text style={{color: "#FFF", fontSize: subtitle, fontWeight: "bold", textAlign: "center"}}>
                    Back
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{width: "25%", marginTop: "5%", justifyContent: "center", borderRadius: 50, paddingVertical: "2.5%", marginVertical: "2.5%", backgroundColor: "#DA4B46", padding: "2.5%",}} 
                onPress={() => {
                  Alert.alert("Delete Report", "Are you sure you want to delete this report?", [{text: "Cancel"}, {text: "Yes", onPress: () => {
                    firebase.firestore().collection("reports")
                    .doc(detailID)
                    .delete()
                      .then(async () => {
                        setReports([]);
                        if(session != null) {
                          await firebase.firestore().collection("reports")
                            .where("uid", "==", session.uid)
                            .get()
                            .then((querySnapshot) => {
                              let reports = [] as FirebaseFirestoreTypes.DocumentData[];
                              querySnapshot.forEach((doc) => {
                                reports.push(doc);
                              });
                              setReports(reports);
                            });
                        }
                        resetData();
                        setDetails(null)
                        Alert.alert("Report Deleted", "The report has been successfully deleted.", );
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }}]);
                  }}>
                  <Ionicons style = {{borderRadius: 50, padding: "2.5%", alignSelf: "center"}} name="trash" color="#FFF" size= {title}/>
                </TouchableOpacity>

                <SpacerView height={display} />
              </ScrollView>

            </MotiView>
          </>}

          {/* SUBMISSION MODAL */}
          {submitted && 
          <>
            <MotiView style = {{position: "absolute", width: '100%', height: '100%', flexDirection: "column", backgroundColor: '#115272', justifyContent: 'center', alignItems: 'center'}} from = {{opacity: 0}} animate={{opacity: 1}}>
              <MotiView from = {{scale: 0}} animate={{scale: 1}}><Thanks width={150} height={150} color="#FFF" style = {{backgroundColor: "#DA4B46", borderWidth: 5, borderRadius: 100, marginBottom: "5%"}}/></MotiView>
              <Text style = {{color: "#FFF", fontWeight: 'bold', fontSize: title, textAlign: "center"}}>Thank you for your service!</Text>
              <TouchableOpacity style={{width: "50%", marginTop: "5%", backgroundColor: "#DA4B46", justifyContent: "center", borderRadius: 50, paddingVertical: "2.5%"}} onPress={() => setSubmitted(false)}>
                <Text style={{color: "#FFF",fontSize: subtitle, fontWeight: "bold", textAlign: "center"}}>
                  OK
                </Text>
              </TouchableOpacity>
            </MotiView>
          </>}

      </View>
    </GestureHandlerRootView>
  );
}