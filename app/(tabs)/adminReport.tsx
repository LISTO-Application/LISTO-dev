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
import { FirebaseFirestoreTypes, GeoPoint } from '@react-native-firebase/firestore';

// Firebase Imports
import storage from '@react-native-firebase/storage';

//Hooks
import useResponsive from '@/hooks/useResponsive';

// Date FNS
import { formatDate, fromUnixTime, getDate, getTime, isMatch, isSameDay, parse, set, sub, subYears, toDate } from 'date-fns';

// UUID Imports
import uuid from 'react-native-uuid';

//Component Imports
import { SpacerView, ThemedButton, AnimatedTouchable, AnimatedPressable, LoadingScreen } from '@/components';
import Clipboard from "@/assets/images/clipboard.svg"
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import { AnimatePresence, MotiView, ScrollView, useDynamicAnimation } from 'moti';
import Thanks from "@/assets/images/thanks.svg"
import Archive from "@/assets/images/archive.svg"
import Check from "@/assets/images/check.svg"
import Create from "@/assets/images/create.svg"

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

export default function adminReport() {

  // AUTHENTICATION STATE
  const session = firebase.auth().currentUser;
  session?.getIdTokenResult().then((idTokenResult) => {
    if(!idTokenResult.claims.admin) {
      router.replace("../(auth)/login");
    }
  })
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
  const [validated, setValidated] = useState(false);
  const [archived, setArchived] = useState(false);
  const [crimeMade, setCrimeMade] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // MODAL STATES
  const [addReportVisible, AddReportVisible] = useState(false);
  const [geoLocateVisible, setGeoLocateVisible] = useState(false);
  const [addCrime, setAddCrime] = useState(false);

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
      Alert.alert("Could not get location", "Please enable location services to send a distress message.");
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
          .where("status", "==", 1)
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
    Geocoder.init("AIzaSyBa31nHNFvIEsYo2D9NXjKmMYxT0lwE6W0");
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
          <Text style={styles.headerText}>User Reports</Text>
          <SpacerView height={80} />
        </View>

        {/* REPORT LIST */}
        {reports.length > 0 ?
          <ScrollView contentContainerStyle = {{width: "100%", height: "auto", justifyContent: "center"}}>{
          reports.map((report, index) => {
            return (
              <MotiView from = {{translateX: 500}} animate={{translateX: 0}} key={index}>
                <TouchableOpacity style = {{width: "98%", height: "auto", flexDirection: "row", backgroundColor: "#115272", borderColor: "#115272", borderWidth: 5, borderRadius: 5, marginHorizontal: "auto", marginVertical: "0.5%"}} onPress={() => {
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
                      setDate(report.data().date.toDate());
                      setUploadImage("");
                      setTime(report.data().timeOfCrime.toDate());
                      setAdditionalInfo(report.data().additionalInfo);
                      setDetailID(report.id);
                      setDetails({...report.data()});
                      setLoading(false);
                  }
                }}>
                  <View style = {{width: "25%",  aspectRatio: 1/1, justifyContent: "center", alignItems: "center", backgroundColor: "#DA4B46", borderRadius: 5, marginRight: "2.5%", marginVertical: "auto"}}>
                    <Image style = {{width: "50%", height: "50%", aspectRatio: 1/1, marginVertical:"auto"}} source={categories[report.data().category as keyof typeof categories]}/>
                  </View>
                  <View style = {{width: "75%", flexDirection: "row", justifyContent: "flex-start"}}>
                    <View style = {{width: "65%"}}>
                      <Text style = {{fontSize: body + 4, color: "#FFF", fontWeight: "bold", }}>{report.data().category.charAt(0).toUpperCase() + report.data().category.slice(1)}</Text>
                      <View style = {{flexDirection: "row"}}><Ionicons style = {{marginRight: "2.5%"}} name="time"  size={24} color="#FFF"/><Text style = {{fontSize: 10, color: "#FFF", fontWeight: "bold", textAlignVertical: "center"}}>{formatDate(report.data().timeOfCrime.toDate(),"MMMM dd, yyyy") + " at " + formatDate(report.data().timeReported.toDate(), "hh:mma")}</Text></View>
                      <View style = {{flexDirection: "row"}}><Ionicons style = {{marginRight: "2.5%"}} name="location"  size={24} color="#FFF"/><Text style = {{fontSize: 10, color: "#FFF", fontWeight: "bold", textAlignVertical: "center"}}>{report.data().location}</Text></View>
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
        
        {/* FAB ADD CRIME BUTTON */}
        <AnimatedTouchable
          from={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{opacity: 0,}}
          onPress={() => setAddCrime(true)}
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
        {addCrime && 
        <Modal statusBarTranslucent visible = {addCrime} hardwareAccelerated>
          <View style={[styles.headerContainer, {opacity: loading ? 0.5 : 1}]}>
            <Text style={styles.headerText}>Submit a Report</Text>
            <SpacerView height={80} />
          </View>

        <ScrollView style = {{opacity: loading ? 0.5 : 1}}>
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
              
            </View>
            {/* Action Buttons */}
            <View style={styles.buttonContainerReport}>
            {!loading ? 
              <TouchableOpacity style={styles.cancelButtonReport} onPress={() => {
                setDetails(null);
                resetData();
                setAddCrime(false)
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
                    setLoading(true);
                      firebase.firestore().collection("crime")
                        .add({
                          "category" : selectedValue.value as string,
                          "coordinate": new GeoPoint(geoLocation?.coords.latitude ?? 0, geoLocation?.coords.longitude ?? 0) as GeoPoint,
                          "location" : location as string,
                          "timeOfCrime" : date as Date,
                          "time" : formatDate(time, "hh:mmaa") as string,
                          "additionalInfo" : additionalInfo as string,
                          "timeReported" : getTime(Date.now()) as number,
                        })
                        .catch((error) => {
                          setLoading(false);
                          console.log(error);
                        });
                      setLoading(false);
                      setAddCrime(false);
                      setCrimeMade(true);
                  }}>

                  {!loading ?
                  <Text style={[styles.buttonText, { color: '#FFF' }]}>Submit</Text>
                  :
                  <ActivityIndicator size="small" color="#FFF"/>
                  }
                </TouchableOpacity>
            </View>
        </ScrollView>
        </Modal>}

          {/* REPORT DETAILS MODAL*/}
          {details && 
          <>
            <MotiView style = {{position: "absolute", width: '100%', height: '100%', flexDirection: "column", backgroundColor: '#FFF', justifyContent: "flex-start", alignItems: "center"}} from = {{opacity: 0}} animate={{opacity: 1}}>
              <View style={[styles.headerContainer, {width: "100%"}]}>
                <SpacerView height={80} />
                <Image style = {{width: display, height: display, aspectRatio: 1/1, backgroundColor: "#DA4B46", borderRadius: 10, marginHorizontal: "2.5%"}} source={categories[selectedValue.value as keyof typeof categories]}/>
                <View style = {{flexDirection: "column"}}>
                  <Text style = {{ color: "#FFF", fontWeight: 'bold', fontSize: subDisplay, marginHorizontal: "2.5%"}}>{selectedValue.value.charAt(0).toUpperCase() + selectedValue.value.slice(1)}</Text>
                  <Text style = {{ color: "#D4D4D4", fontWeight: 'bold', fontSize: small, marginHorizontal: "2.5%"}}>Reported on {formatDate(fromUnixTime(details.timestamp / 1000), "MMMM dd, yyyy")}</Text>
                </View>
              </View>

              <ScrollView contentContainerStyle = {{justifyContent: "center", alignItems: "center"}} style = {{width: "100%"}}>
                <View style = {{width: "85%", flexDirection: "row", alignItems: "center", paddingVertical: "1.5%", borderRadius: 10, borderWidth: 5, borderColor: "#115272", marginVertical: "2.5%"}}>
                  <Ionicons style = {{marginHorizontal: "2.5%"}} name="location"  size={title} color="#115272"/>
                  <ScrollView>
                    <Text style = {{ color: "#115272", fontWeight: 'bold', fontSize: subtitle, marginHorizontal: "2.5%"}}> {location} </Text>
                  </ScrollView>
                </View>
                
                <View style = {{width: "85%", flexDirection: "row", alignItems: "center", paddingVertical: "2.5%", borderRadius: 10, borderWidth: 5, borderColor: "#115272", marginVertical: "2.5%"}}>
                  <Ionicons style = {{marginHorizontal: "2.5%"}} name="calendar"  size={title} color="#115272"/>
                  <Text style = {{ color: "#115272", fontWeight: 'bold', fontSize: subtitle, marginHorizontal: "2.5%"}}>{formatDate(date, "MMMM dd, yyyy")}</Text>
                </View>
                
                <View style = {{width: "85%", flexDirection: "row", alignItems: "center", paddingVertical: "2.5%", borderRadius: 10, borderWidth: 5, borderColor: "#115272", marginVertical: "2.5%"}}>
                  <Ionicons style = {{marginHorizontal: "2.5%"}} name="time"  size={title} color="#115272"/>
                  <Text style = {{ color: "#115272", fontWeight: 'bold', fontSize: subtitle, marginHorizontal: "2.5%"}}>{formatDate(time, "hh:mma")}</Text>
                </View>
                
                <View style = {{width: "85%", flexDirection: "row", alignItems: "center", paddingVertical: "2.5%", borderRadius: 10, borderWidth: 5, borderColor: "#115272", marginVertical: "2.5%"}}>
                  <Ionicons style = {{marginHorizontal: "2.5%"}} name="clipboard-outline"  size={title} color="#115272"/>
                  <ScrollView>
                    <Text style = {{ color: "#115272", fontWeight: 'bold', fontSize: subtitle, marginHorizontal: "2.5%"}}> {additionalInfo} </Text>
                  </ScrollView>
                </View>
                
                <View style = {{width: "85%", flexDirection: "row", alignItems: "center", paddingVertical: "2.5%", borderRadius: 10, borderWidth: 5, borderColor: "#115272", marginVertical: "2.5%", justifyContent: "center"}}>
                  {uploadImage != "" ? <Image style = {{width: "50%", height: "50%", aspectRatio: 1/1, marginHorizontal: "2.5%"}} source={{uri: uploadImage}}/> : <Ionicons name="image-outline"  size={display} color="#115272"/>}
                </View>

                <View style = {{width: "100%", flexDirection: "row", justifyContent: "space-evenly"}}>
                  <TouchableOpacity style={{width: "40%", marginTop: "5%", backgroundColor: "#DA4B46", justifyContent: "center", borderRadius: 10, paddingVertical: "2.5%", marginVertical: "2.5%"}} 
                  onPress={() => {
                    setLoading(true);
                    firebase.firestore().collection("reports")
                    .doc(detailID)
                    .update({
                      "status": 0
                    })
                    .then(async () => {
                      firebase.firestore().collection("archives").add({
                        "category" : selectedValue.value as string,
                        "coordinate": new GeoPoint(geoLocation?.coords.latitude ?? 0, geoLocation?.coords.longitude ?? 0) as GeoPoint,
                        "location" : location as string,
                        "timeOfCrime" : date as Date,
                        "time" : formatDate(time, "hh:mmaa") as string,
                        "additionalInfo" : additionalInfo as string,
                        "timeReported" :  details.timeReported as number,
                        "uid" : details.uid as string,
                        "phone" : details.phone as string,
                      })
                    })
                    .then(async () => {
                      if(session != null) {
                        setReports([]);
                        await firebase.firestore().collection("reports")
                          .where("status", "==", 1)
                          .get()
                          .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                              setReports((prevData) => [...prevData, doc]);
                            });
                          });
                      }
                      setLoading(false);
                      setArchived(true);
                      resetData();
                      setDetails(null);
                    })
                    .catch((error) => {
                      resetData();
                      setLoading(false);
                      console.log(error);
                    });
                    }}>
                    {!loading ?
                    <Text style={{color: "#FFF", fontSize: subtitle, fontWeight: "bold", textAlign: "center"}}>
                      Invalidate
                    </Text>
                    :
                    <ActivityIndicator style = {{marginHorizontal: "auto"}} size="small" color="#FFF"/>}
                  </TouchableOpacity>

                  <TouchableOpacity style={{width: "40%", marginTop: "5%", backgroundColor: "#115272", justifyContent: "center", borderRadius: 10, paddingVertical: "2.5%", marginVertical: "2.5%"}} 
                  onPress={() => {
                    setLoading(true);
                    firebase.firestore().collection("reports")
                    .doc(detailID)
                    .update({
                      "status": 2
                  })
                  .then(async () => {
                    firebase.firestore().collection("crimes").add({
                      "category" : selectedValue.value.toLowerCase() as string,
                      "coordinate": new GeoPoint(geoLocation?.coords.latitude ?? 0, geoLocation?.coords.longitude ?? 0) as GeoPoint,
                      "location" : location as string,
                      "timeOfCrime" : date as Date,
                      "time" : formatDate(time, "hh:mmaa") as string,
                      "additionalInfo" : additionalInfo as string,
                      "timeReported" : details.timeReported as number,
                    })
                  })
                  .then(async () => {
                    if(session != null) {
                      setReports([]);
                      await firebase.firestore().collection("reports")
                        .where("status", "==", 1)
                        .get()
                        .then((querySnapshot) => {
                          querySnapshot.forEach((doc) => {
                            setReports((prevData) => [...prevData, doc]);
                          });
                        });
                    }
                    setLoading(false);
                    setValidated(true);
                    resetData();
                    setDetails(null);
                  })
                  .catch((error) => {
                    resetData();
                    setLoading(false);
                    console.log(error);
                  });
                    }}>
                    {!loading ?
                    <Text style={{color: "#FFF", fontSize: subtitle, fontWeight: "bold", textAlign: "center"}}>
                      Validate
                    </Text>
                    :
                    <ActivityIndicator style = {{marginHorizontal: "auto"}} size="small" color="#FFF"/>}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={{width: "50%", marginTop: "5%", backgroundColor: "#115272", justifyContent: "center", borderRadius: 50, paddingVertical: "2.5%", marginVertical: "2.5%"}} 
                onPress={() => {
                  resetData();
                  setDetails(null)
                  }}>
                  <Text style={{color: "#FFF", fontSize: subtitle, fontWeight: "bold", textAlign: "center"}}>
                    Back
                  </Text>
                </TouchableOpacity>

                <SpacerView height={display} />
              </ScrollView>

            </MotiView>
          </>}

          {/* VALIDATED MODAL */}
          {validated && 
          <>
            <MotiView style = {{position: "absolute", width: '100%', height: '100%', flexDirection: "column", backgroundColor: '#115272', justifyContent: 'center', alignItems: 'center'}} from = {{opacity: 0}} animate={{opacity: 1}}>
              <MotiView from = {{scale: 0}} animate={{scale: 1}}><Check width={150} height={150} color="#FFF" style = {{backgroundColor: "#FFF", borderWidth: 5, borderRadius: 100, marginBottom: "5%"}}/></MotiView>
              <Text style = {{color: "#FFF", fontWeight: 'bold', fontSize: title, textAlign: "center"}}>Report Validated!</Text>
              <TouchableOpacity style={{width: "50%", marginTop: "5%", backgroundColor: "#DA4B46", justifyContent: "center", borderRadius: 50, paddingVertical: "2.5%"}} onPress={() => setValidated(false)}>
                <Text style={{color: "#FFF",fontSize: subtitle, fontWeight: "bold", textAlign: "center"}}>
                  OK
                </Text>
              </TouchableOpacity>
            </MotiView>
          </>}

          {/* ARCHIVED MODAL */}
          {archived && 
          <>
            <MotiView style = {{position: "absolute", width: '100%', height: '100%', flexDirection: "column", backgroundColor: '#115272', justifyContent: 'center', alignItems: 'center'}} from = {{opacity: 0}} animate={{opacity: 1}}>
              <MotiView from = {{scale: 0}} animate={{scale: 1}}><Archive width={150} height={150} color="#FFF" style = {{backgroundColor: "#DA4B46", borderWidth: 5, borderRadius: 100, marginBottom: "5%"}}/></MotiView>
              <Text style = {{color: "#FFF", fontWeight: 'bold', fontSize: title, textAlign: "center"}}>Report Invalidated and Archived!</Text>
              <TouchableOpacity style={{width: "50%", marginTop: "5%", backgroundColor: "#DA4B46", justifyContent: "center", borderRadius: 50, paddingVertical: "2.5%"}} onPress={() => setArchived(false)}>
                <Text style={{color: "#FFF",fontSize: subtitle, fontWeight: "bold", textAlign: "center"}}>
                  OK
                </Text>
              </TouchableOpacity>
            </MotiView>
          </>}

          {crimeMade && 
          <>
            <MotiView style = {{position: "absolute", width: '100%', height: '100%', flexDirection: "column", backgroundColor: '#115272', justifyContent: 'center', alignItems: 'center'}} from = {{opacity: 0}} animate={{opacity: 1}}>
              <MotiView from = {{scale: 0}} animate={{scale: 1}}><Create width={150} height={150} color="#FFF" style = {{backgroundColor: "#DA4B46", borderWidth: 5, borderRadius: 100, marginBottom: "5%"}}/></MotiView>
              <Text style = {{color: "#FFF", fontWeight: 'bold', fontSize: title, textAlign: "center"}}>Crime Recorded!</Text>
              <TouchableOpacity style={{width: "50%", marginTop: "5%", backgroundColor: "#DA4B46", justifyContent: "center", borderRadius: 50, paddingVertical: "2.5%"}} onPress={() => setCrimeMade(false)}>
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