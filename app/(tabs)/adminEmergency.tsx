//React Imports
import {
  Image, Platform, KeyboardAvoidingView,
  ScrollView, StyleSheet, TouchableOpacity,
  View, Linking, ImageSourcePropType,
  Pressable, Text, Alert,
  ActivityIndicator, Modal, Keyboard, useWindowDimensions,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMemo, useCallback, useRef, useState, useEffect } from "react";
import Geocoder from 'react-native-geocoding';

//Expo Imports
import { router, useFocusEffect } from "expo-router";
import * as Location from 'expo-location';

// Firebase Imports
import { firebase, FirebaseFirestoreTypes, GeoPoint, startAfter } from "@react-native-firebase/firestore";

//Auth Imports
import { useSession } from "@/auth/adminIndex";

//Stylesheet Imports
import { styles } from "@/styles/styles";
import { utility } from "@/styles/utility";

//Component Imports
import { ThemedInput, ThemedText, SpacerView, ThemedButton, AnimatedPressable, AnimatedTouchable } from "@/components";
import Void from "@/assets/images/void.svg"

// Hooks
import useResponsive from "@/hooks/useResponsive";

// Moti Imports
import { AnimatePresence, MotiView, useAnimationState, useDynamicAnimation } from "moti";

//Bottom Sheet Imports
import { Portal } from "@gorhom/portal";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { set } from "date-fns";

export default function Emergency() {

  const session = firebase.auth().currentUser;
  if(session == null) {
    router.replace("../(auth)/login");
  }
  
  const auth = useSession();

  // IMAGE IMPORTS
  const qcLogo = require("../../assets/images/qc-logo.png");
  const holyspiritLogo = require("../../assets/images/holyspirit-logo.png");
  const balaraLogo = require("../../assets/images/balara-logo.png");
  const hotline = require("../../assets/images/call-icon.png");

  // RESPONSIVE VALUES
  const { display, subDisplay, title, subtitle, body, small } = useResponsive();

  // EMERGENCY CONTACTS
  const contacts = [
    { id: 1, name: 'QC Hotline', icon: qcLogo as ImageSourcePropType, phone: '122'},
    { id: 2, name: 'Holy Spirit', icon: holyspiritLogo as ImageSourcePropType, phone: '09311294694'},
    { id: 3, name: 'Old Balara', icon: balaraLogo as ImageSourcePropType, phone: '284429251'},
  ];

  // BARANGAY TYPES
  const barangays = [
    { code: 'HS', name: 'Holy Spirit'},
    { code: 'MB', name: 'Matandang Balara'},
  ]

  // EMERGENCY TYPES
  const emergencies = [
    { code: 'Crime', name: 'Violent Crime'},
    { code: 'Fire', name: 'Active Fire'},
    { code: 'Injury', name: 'Serious Injury'},
  ];

  // EMERGENCY OPTIONS
  const options = [0, 1, 2];

  interface distressMessage {
    addInfo: string,
    emergencyType: {
      crime: boolean,
      fire: boolean,
      injury: boolean,
    },
    barangay: string,
    location: GeoPoint | undefined,
    acknowledged: string,
    id: string
  }

    // MAP REFERENCE
    const mapRef = useRef<MapView>(null);

    // MAP BOUNDARIES
    const mapBoundaries = {
      northEast: { latitude: 14.693963, longitude: 121.101193 },
      southWest: { latitude: 14.649732, longitude: 121.067052 }
    };

  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [distress, setDistress] = useState([] as distressMessage[]);
  const [address, setAddress] = useState("");
  const [distressDetails, setDistressDetails] = useState<distressMessage>({} as distressMessage);
  const [lastDistress, setLastDistress] = useState<FirebaseFirestoreTypes.QueryDocumentSnapshot>();

  // VIEW STATES
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [visible, setVisible] = useState(true);
  const [detailsVisible, setDetailsVisible] = useState(false);

  // HIDE ELEMENTS ON KEYBOARD SHOW
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        setVisible(false);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        setVisible(true);
    });

    return () => {
        showSubscription.remove();
        hideSubscription.remove();
    };
}, []);

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%"], []);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // callbacks
  const handleSheetChange = useCallback((index: any) => {
    setIsBottomSheetOpen(index !== -1);
  }, []);

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => sheetRef.current?.close();
    }, [])
  );

  // FETCH DISTRESS MESSAGES
  useEffect(() => {
    setDistress([]);
    const fetchData = async () => {
      if(session != null) {
        await firebase.firestore().collection("distress")
          .limit(5)
          .get()
          .then((querySnapshot) => {
            setLastDistress(querySnapshot.docs[querySnapshot.docs.length-1]);
            let distress: distressMessage[] = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              const distressMessage: distressMessage = {
                addInfo: data.addInfo,
                emergencyType: {
                  crime: data.emergencyType.crime,
                  fire: data.emergencyType.fire,
                  injury: data.emergencyType.injury,
                },
                barangay: data.barangay,
                location: data.location,
                acknowledged: data.acknowledged,
                id: doc.id
              };
              distress.push(distressMessage);
            });
            setDistress(distress);
          });
      }
    };
    setTimeout(() => {
      fetchData();
    }, 1000);
    return
  }, []);

  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed((prev) => !prev);
  };

  // ANIMATIONS

  const animation =[useDynamicAnimation(() => {
    return {
      scale: 1,
      backgroundColor: '#DA4B46',
    }
  }), useDynamicAnimation(() => {
    return {
      scale: 1,
      backgroundColor: '#DA4B46',
    }
  }),
  useDynamicAnimation(() => {
    return {
      scale: 1,
      backgroundColor: '#DA4B46',
    }
  }),
  useDynamicAnimation(() => {
    return {
      scale: 1,
      backgroundColor: '#DA4B46',
    }
  }),
  useDynamicAnimation(() => {
    return {
      scale: 1,
      backgroundColor: '#DA4B46',
    }
  })] 

  if (Platform.OS === "android") {
    if(sent) {
      return (
        <Modal statusBarTranslucent transparent visible = {sent}>
          <MotiView style = {{width: '100%', height: '100%', flexDirection: "column", backgroundColor: '#DA4B46', justifyContent: 'center', alignItems: 'center'}} from = {{opacity: 0}} animate={{opacity: 1}}>
            <MotiView from = {{scale: 0}} animate={{scale: 1}}><Ionicons name="checkmark-circle" size={60} color="#FFF" style = {{marginBottom: "5%"}}/></MotiView>
            <Text style = {{color: "#FFF", fontWeight: 'bold', fontSize: title}}> Message sent!</Text>
          </MotiView>
        </Modal>
      )
    }
    return (
      <>
         <GestureHandlerRootView>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={[styles.mainContainer, utility.redBackground]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SpacerView height="2.5%" />
          <KeyboardAvoidingView
            behavior="height"
            keyboardVerticalOffset={0}
            style={[styles.container, utility.redBackground]}
          >
            <Text style={{ marginVertical: "10%", fontSize: subDisplay, fontWeight: "bold", color: "#FFF"}}>
              Distress Messages
            </Text>

            
        {/* REPORT LIST */}
        {emergencies.length > 0 ?
          <ScrollView contentContainerStyle = {{width: "100%", height: "auto", justifyContent: "center"}}>{
          distress.map((distress, index) => {
            if(distress.location != null) {
              Geocoder.from(distress.location?.latitude, distress.location?.longitude)
              .then(json => {
                  setAddress(json.results[0].formatted_address);
              })
            }
            return (
              <MotiView from = {{translateX: 500}} animate={{translateX: 0}} key={index}>
                <TouchableOpacity style = {{width: "98%", height: "auto", flexDirection: "row", backgroundColor: "#FFF", borderColor: "#FFF", borderWidth: 5, borderRadius: 5, marginHorizontal: "auto", marginVertical: "0.5%", opacity: distress.acknowledged ? 0.75 : 1}} onPress={() => {
                  setDistressDetails(distress);
                  setTimeout(() => {
                    Geocoder.init("AIzaSyDoWF8JDzlhT2xjhuInBtMmkhWGXg2My0g");
                    console.log("Geocoder initialized");
                    if (mapRef.current) {
                      mapRef.current.setMapBoundaries(
                        mapBoundaries.northEast,
                        mapBoundaries.southWest
                      ); 
                      setTimeout(() => {
                        mapRef.current?.fitToCoordinates([{latitude: distress.location?.latitude ?? 0, longitude: distress.location?.longitude ?? 0}]);
                      }, 3000);
                    }
                  }, 1000);
                  setDetailsVisible(true);
                }}>
                  {distress.emergencyType.fire == true &&<View style = {{width: "20%",  aspectRatio: 1/1, justifyContent: "center", alignItems: "center", backgroundColor: "#DA4B46", borderRadius: 5, marginRight: "2.5%", marginVertical: "auto"}}>
                    <Ionicons name="flame-outline" size={title} color="#FFF"/> 
                  </View>}
                  {distress.emergencyType.crime == true &&<View style = {{width: "20%",  aspectRatio: 1/1, justifyContent: "center", alignItems: "center", backgroundColor: "#DA4B46", borderRadius: 5, marginRight: "2.5%", marginVertical: "auto"}}>
                    <FontAwesome6 name="gun" size={title} color="#FFF"/>
                  </View>}
                  {distress.emergencyType.injury == true &&<View style = {{width: "20%",  aspectRatio: 1/1, justifyContent: "center", alignItems: "center", backgroundColor: "#DA4B46", borderRadius: 5, marginRight: "2.5%", marginVertical: "auto"}}>
                    <MaterialIcons name="personal-injury" size={title} color="#FFF"/>
                  </View>}
                  <View style = {{width: "auto", maxWidth: "80%", flexDirection: "column", justifyContent: "flex-start"}}>
                      <Text style = {{fontSize: body, fontWeight: "bold", color: "#DA4B46"}}>{distress.barangay == "HS" ? "Holy Spirit" : "Matandang Balara"}</Text>
                      <Text style = {{fontSize: small, fontWeight: "500", color: "#DA4B46"}}>{address}</Text>
                  </View>
                </TouchableOpacity>
              </MotiView>
            );
          }) 
          }
          
          {distress && <TouchableOpacity style = {{backgroundColor: "#FFF", borderRadius: 10, width: "50%", marginHorizontal: "auto", marginTop: "5%"}}
          onPress={async ()=> {
            setLoading(true);
            await firebase.firestore().collection("distress")
            .startAfter(lastDistress)
            .limit(5)
            .get()
            .then((querySnapshot) => {
              setLastDistress(querySnapshot.docs[querySnapshot.docs.length-1]);
              let distress: distressMessage[] = [];
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                const distressMessage: distressMessage = {
                  addInfo: data.addInfo,
                  emergencyType: {
                    crime: data.emergencyType.crime,
                    fire: data.emergencyType.fire,
                    injury: data.emergencyType.injury,
                  },
                  barangay: data.barangay,
                  location: data.location,
                  acknowledged: data.acknowledged,
                  id: doc.id
                };
                distress.push(distressMessage);
              });
              setDistress(prevDistress => [...prevDistress, ...distress]);
              setLoading(false);
            });
          }}>
            {!loading ? <Text style = {{fontSize: body, fontWeight: "bold", color: "#DA4B46", textAlign: "center", marginVertical: "5%"}}>Load more</Text> : <ActivityIndicator size="large" color="#DA4B46"/>}
          </TouchableOpacity>}
          </ScrollView>
          :
          <View style = {{width: "100%", height: "75%", flexDirection: "column", justifyContent: "center", marginHorizontal: "auto", marginVertical: "0.5%"}}>
            <View style = {{width: "100%", flexDirection: "column", marginHorizontal: "auto", justifyContent: "center", alignItems: "center"}}>
              <Void width={180} height={180}/>
              <Text style = {{fontSize: 20, fontWeight: "bold", color: "#FFF", textAlign: "center", marginVertical: "5%"}}>No Distress Messages</Text>
            </View>
        </View>
        }

          </KeyboardAvoidingView>
          <SpacerView height={50}/>

          <AnimatePresence> 
            <AnimatedTouchable
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{opacity: 0,}}
            transition={{ duration: 10 }}
              style = {[{
                position: 'absolute',
                bottom: 25,
                right: 25,
                marginVertical: 'auto'
              }]} 
              onPress={() => handleSnapPress(0)}
              >
                <Image style = {{
                width: subDisplay,
                height: subDisplay,
                }}
                source={hotline}/>
            </AnimatedTouchable>
          </AnimatePresence>

                  {/* REPORT DETAILS MODAL*/}
        {detailsVisible && 
          <>
            <MotiView style = {{position: "absolute", width: '100%', height: '100%', flexDirection: "column", backgroundColor: '#DA4B46', justifyContent: "flex-start", alignItems: "center"}} from = {{opacity: 0}} animate={{opacity: 1}}>
              <View style={{backgroundColor: '#DA4B46', paddingVertical: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'flex-end', width: "100%"}}>
              <SpacerView height={display} />
                {distressDetails.emergencyType.fire == true && <View style = {{width: "20%",  aspectRatio: 1/1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF", borderRadius: 5, marginRight: "2.5%", marginVertical: "auto"}}>
                    <Ionicons name="flame-outline" size={title} color="#DA4B46"/> 
                  </View>}
                {distressDetails.emergencyType.crime == true && <View style = {{width: "20%",  aspectRatio: 1/1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF", borderRadius: 5, marginRight: "2.5%", marginVertical: "auto"}}>
                    <FontAwesome6 name="gun" size={title} color="#DA4B46"/>
                  </View>}
                {distressDetails.emergencyType.injury == true && <View style = {{width: "20%",  aspectRatio: 1/1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF", borderRadius: 5, marginRight: "2.5%", marginVertical: "auto"}}>
                    <MaterialIcons name="personal-injury" size={title} color="#DA4B46"/>
                  </View>}
                <View style = {{flexDirection: "column"}}>
                  <Text style = {{ color: "#FFF", fontWeight: 'bold', fontSize: subDisplay, marginHorizontal: "2.5%"}}>
                    {distressDetails.barangay == "HS" ? "Holy Spirit" : "Matandang Balara"}
                  </Text>
                    <Text style = {{ color: "#FFF", fontWeight: 'bold', fontSize: body, marginHorizontal: "2.5%"}}>
                      {distressDetails.emergencyType.crime && "(Violent Crime)"} 
                      {distressDetails.emergencyType.fire && "(Active Fire)"}
                      {distressDetails.emergencyType.injury && "(Serious Injury)"}
                    </Text>
                </View>
              </View>

              <MapView
                    style={{width: "100%", height: "50%"}}
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    minZoomLevel={15}
                    maxZoomLevel={17}
                    cameraZoomRange={{minCenterCoordinateDistance: 14, maxCenterCoordinateDistance: 17, animated: true}}
                    loadingEnabled={true}
                    loadingBackgroundColor="#DA4B46"
                    loadingIndicatorColor="#FFF"
                    googleMapId= "5cc51025f805d25d"
                    onMapLoaded={(e) => {
                        if (location) {
                          mapRef.current?.animateToRegion({
                            latitude: distressDetails.location?.latitude ?? 0,
                            longitude: distressDetails.location?.longitude ?? 0,
                            latitudeDelta: 0,
                            longitudeDelta: 0
                          });
                        }
                      }}>

                    {distressDetails.location?.latitude && distressDetails.location?.longitude && (
                      <Marker 
                      coordinate={{ 
                        latitude: distressDetails.location?.latitude, 
                        longitude: distressDetails.location?.longitude }}
                        tracksViewChanges={false}
                        tracksInfoWindowChanges={false} />
                    )}
                </MapView>

              <View style = {{justifyContent: "flex-start", alignItems: "center", width: "100%"}}>
                <View style = {{width: "95%", backgroundColor: "#FFF", flexDirection: "row", justifyContent: "center", alignItems: "center", paddingVertical: "5%", marginVertical: "2.5%", borderRadius: 10}}>
                  <Text style = {{ color: "#DA4B46", fontWeight: 'bold', fontSize: body, marginHorizontal: "2.5%"}}>{distressDetails.addInfo}</Text>
                </View>
                <View style = {{width: "100%", flexDirection: "row", justifyContent: "space-evenly", backgroundColor: "#DA4B46"}}>
                <TouchableOpacity style={{width: "40%", marginTop: "5%", backgroundColor: "#115272", justifyContent: "center", borderRadius: 10, paddingVertical: "2.5%", marginVertical: "2.5%"}} 
                  onPress={async () => {
                    setLoading(true);
                    await firebase.firestore().collection("distress").doc(distressDetails.id)
                      .update({acknowledged: true})
                      setDetailsVisible(false);
                      setDistressDetails({} as distressMessage);
                      setLoading(false);
                  }}>
                    {!loading ?
                    <Text style={{color: "#FFF", fontSize: subtitle, fontWeight: "bold", textAlign: "center"}}>
                      Acknowledge
                    </Text>
                    :
                    <ActivityIndicator style = {{marginHorizontal: "auto"}} size="small" color="#FFF"/>}
                  </TouchableOpacity>
                  <TouchableOpacity style={{width: "40%", marginTop: "5%", backgroundColor: "#FFF", justifyContent: "center", borderRadius: 10, paddingVertical: "2.5%", marginVertical: "2.5%"}} 
                  onPress={() => {
                    setDistressDetails({} as distressMessage);
                    setDetailsVisible(false);
                  }}>
                    {!loading ?
                    <Text style={{color: "#DA4b46", fontSize: subtitle, fontWeight: "bold", textAlign: "center"}}>
                      Back
                    </Text>
                    :
                    <ActivityIndicator style = {{marginHorizontal: "auto"}} size="small" color="#FFF"/>}
                  </TouchableOpacity>
                </View>
              <SpacerView height={display} />
            </View>
          </MotiView>
        </>}

        </ScrollView>
        {visible && <Portal>
          <BottomSheet ref={sheetRef} index={-1} snapPoints={snapPoints} onChange={handleSheetChange} style = {{borderRadius: 20,}} backgroundStyle={{backgroundColor: '#115272'}} handleIndicatorStyle={{backgroundColor: '#FFF', width: '40%'}} enablePanDownToClose={true}>
            <View style = {{ width: "100%", height: "100%", justifyContent: 'center'}}>
              <BottomSheetView style = {{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: "center", height: "50%"}}>
              {/* EMERGENCY CONTACTS */}
              {contacts.map((category, index) => (
                <View key={category.id} style={style.bottomSheetItem}>
                    <TouchableOpacity style={[style.bottomSheetImageContainer]} onPress={() => {Linking.openURL(`tel:${category.phone}`)}}>
                            <Image style={style.bottomSheetImage} source={category.icon} />
                    </TouchableOpacity>
                    <ThemedText allowFontScaling = {true} style={[style.bottomSheetItemTitle, {fontSize: body}]} lightColor='#FFF' darkColor='#FFF'>
                        {category.name}
                    </ThemedText>
                </View>
              ))}
              </BottomSheetView>
            </View>
          </BottomSheet>
        </Portal>}
      </GestureHandlerRootView>
      </>
    );
  }
}

const style = StyleSheet.create({
  //GENERAL STYLES
  container: {
    flex: 1,
    paddingTop: 200,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    backgroundColor: "white",
  },
  shadowBox: {
    shadowColor: "#333333",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },

 //DISTRESS MESSAGE STYLES
 scrollViewItem: {
  width: 'auto',
  height: '100%',
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 25,
  marginHorizontal: 10,
  borderWidth: 3,
  borderRadius: 10,
  borderColor: "#FFF",
},
scrollViewText: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#FFF",
},
focusedScrollViewItem: {
  backgroundColor: "#FFF",
},
focusedScrollViewText: {
  color: "#DA4B46",
},
//BOTTOM SHEET STYLES
bottomSheet: {
  position: 'absolute',
  bottom: 0,
}, 
bottomSheetItem: {
  width: 'auto',
  height: 'auto',
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
},
bottomSheetImageContainer: {
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 5,
  backgroundColor: "#FFF",
  borderRadius: 50,
  borderColor: "#FFF",
  shadowColor: "#000",
  shadowOffset: {width: 10, height: 10},
  shadowOpacity: 0.8,
  aspectRatio: 1/1,
},
bottomSheetImage: {
  width: '100%',
  height: '100%',
  aspectRatio: 1/1,
  justifyContent: "center",
},
bottomSheetItemTitle: {
  width: "100%",
  height: 'auto',
  marginTop: '1%',
  textAlign: "center",
  fontWeight: "bold",
  fontVariant: ["oldstyle-nums"],
}
});
