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

//Expo Imports
import { router, useFocusEffect } from "expo-router";
import * as Location from 'expo-location';

// Firebase Imports
import { firebase } from "@react-native-firebase/firestore";

//Auth Imports
import { useSession } from "@/auth";

//Stylesheet Imports
import { styles } from "@/styles/styles";
import { utility } from "@/styles/utility";

//Component Imports
import { ThemedInput, ThemedText, SpacerView, ThemedButton, AnimatedPressable, AnimatedTouchable } from "@/components";
import Warning from "@/assets/images/warning.svg"

// Hooks
import useResponsive from "@/hooks/useResponsive";

// Moti Imports
import { AnimatePresence, MotiView, useAnimationState, useDynamicAnimation } from "moti";

//Bottom Sheet Imports
import { Portal } from "@gorhom/portal";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

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

  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  // VIEW STATES
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [visible, setVisible] = useState(true);

  // BARANGAY & EMERGENCY STATES
  const [barangayState, setBarangayStates] = useState(
    options.map(() => false)
  );

  const [emergencyTypeState, setEmergencyTypeStates] = useState(
    options.map(() => false)
  );

  // SET WARNING MESSAGE ON INITIAL LOAD
  useEffect(() => {
    setTimeout(() => {setWarning(true);}, 2000)
  }, []);

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

  async function getCurrentLocation() {
    setLoading(true);
    console.log("Getting location permissions");
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      Alert.alert("Could not get location", "Please enable location services to send a distress message.");
      return false;
    } else {
      console.log("Getting location");
      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
      console.log("Setting location");
      setLocation(location);
      console.log(location);
      return location;
    }
  }

  const handleBarangayPress = (index: number) => {
    setBarangayStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : false))
    );
  };

  const handleEmergencyPress = (index: number) => {
    setEmergencyTypeStates((prevStates) =>
      prevStates.map((state, i) => (i === index ? !state : state))
    );
  };

  const [addInfo, setAddInfo] = useState('');

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
      <AnimatePresence>
        {warning && 
          <MotiView style = {{width: "100%", height: "100%", flexDirection: "column", backgroundColor:"#DA4B46", justifyContent: 'center', alignItems:'center',}} from = {{opacity: 0}} animate={{opacity: 1}} exit = {{opacity: 0}}>
              <Warning width="25%" height="25%" style = {{backgroundColor: 'rgba(0,0,0,0)', borderRadius: 200, marginBottom: "5%", aspectRatio: 1/1}}></Warning>
              <Text style = {[{width: '75%', color: "#FFF", borderRadius: 10, textAlign: "center", marginBottom: "5%", fontWeight: "900"}, {fontSize: subtitle}]}>Only send distress messages in an emergency, false alarms will not be tolerated.</Text>
            <TouchableOpacity
              style = {{width: "50%", height: "auto", backgroundColor: "#FFF", borderRadius: 50, justifyContent: "center", paddingVertical: "2.5%"}}
              onPress={() => setWarning(false)}>
                <Text style = {{color: '#DA4B42', fontWeight: 'bold', fontSize: 16, textAlign: 'center'}}>OK</Text>
            </TouchableOpacity>
          </MotiView>}
        </AnimatePresence>


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
              Send a distress message
            </Text>
            <ThemedText
              style={{ marginBottom: "2.5%" }}
              lightColor="#FFF"
              darkColor="#FFF"
              type="subtitle"
            >
              Send to
            </ThemedText>

            <SpacerView height="5%" marginBottom="5%">
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                overScrollMode="always"
                style = {{height: 36}}
              >
                <AnimatedPressable
                  style = {style.scrollViewItem}
                  state={animation[0]}
                  onPress={() => {
                    handleBarangayPress(0)
                    animation[0].animateTo((current)=>({...current, backgroundColor: !barangayState[0] ? '#FFF': '#DA4B46', scale: !barangayState[0] ? 1.1: 1.0}))
                    if(barangayState[1] == true) {
                      animation[1].animateTo((current)=>({...current, backgroundColor: !barangayState[1] ? '#FFF': '#DA4B46', scale: !barangayState[1] ? 1.1: 1.0}))
                    }
                    }}>
                  <Text style = {[style.scrollViewText, barangayState[0] && style.focusedScrollViewText]}>Holy Spirit</Text>
                </AnimatedPressable>
                <AnimatedPressable
                  style = {style.scrollViewItem}
                  state={animation[1]}  
                  onPress={() => {
                    handleBarangayPress(1)
                    animation[1].animateTo((current)=>({...current, backgroundColor: !barangayState[1] ? '#FFF': '#DA4B46', scale: !barangayState[1] ? 1.1: 1.0}))
                    if(barangayState[0] == true) {
                      animation[0].animateTo((current)=>({...current, backgroundColor: !barangayState[0] ? '#FFF': '#DA4B46', scale: !barangayState[0] ? 1.1: 1.0}))
                    }
                    }}>
                  <Text style = {[style.scrollViewText, barangayState[1] && style.focusedScrollViewText]}>Matandang Balara</Text>
                </AnimatedPressable>
              </ScrollView>
            </SpacerView>

            <SpacerView height="5%"/>

            <ThemedText
              style={{ marginVertical: "2.5%" }}
              lightColor="#FFF"
              darkColor="#FFF"
              type="subtitle"
            >
              Emergency Type
            </ThemedText>
            <SpacerView height="5%" marginBottom="15%">
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                scrollToOverflowEnabled={true}
                style = {{height: 36}}
              >
                <AnimatedPressable
                  state={animation[2]}  
                  style = {[style.scrollViewItem]}
                  onPress={() => {
                    handleEmergencyPress(0)
                    animation[2].animateTo((current)=>({...current, backgroundColor: !emergencyTypeState[0] ? '#FFF': '#DA4B46', scale: !emergencyTypeState[0] ? 1.1: 1.0}))
                    }}>
                  <Text style = {[style.scrollViewText, emergencyTypeState[0] && style.focusedScrollViewText]}>Violent Crime</Text>
                </AnimatedPressable>

                <AnimatedPressable
                  state={animation[3]}  
                  style = {[style.scrollViewItem]}
                  onPress={() => {
                    handleEmergencyPress(1)
                    animation[3].animateTo((current)=>({...current, backgroundColor: !emergencyTypeState[1] ? '#FFF': '#DA4B46', scale: !emergencyTypeState[1] ? 1.1: 1.0}))
                    }}>
                  <Text style = {[style.scrollViewText, emergencyTypeState[1] && style.focusedScrollViewText]}>Active Fire</Text>
                </AnimatedPressable>

                <AnimatedPressable
                  state={animation[4]}  
                  style = {[style.scrollViewItem]}
                  onPress={() => {
                    handleEmergencyPress(2)
                    animation[4].animateTo((current)=>({...current, backgroundColor: !emergencyTypeState[2] ? '#FFF': '#DA4B46', scale: !emergencyTypeState[2] ? 1.1: 1.0}))
                    }}>
                  <Text style = {[style.scrollViewText, emergencyTypeState[2] && style.focusedScrollViewText]}>Serious Injury</Text>
                </AnimatedPressable>
              </ScrollView>
            </SpacerView>
            
            <ThemedText lightColor="#FFF" darkColor="#FFF" type="subtitle">
              Additional Information
            </ThemedText>
            <ThemedInput
              marginTop={10}
              borderRadius={15}
              placeholder="Additional Information"
              textAlign="left"
              textAlignVertical="top"
              placeholderTextColor="#EDA5A3"
              onChangeText={(text) => {setAddInfo(text)}}
              multiline={true}
              numberOfLines={4}
            />
            <SpacerView height={20} />
            <SpacerView
              flexDirection="column"
              justifyContent="space-evenly"
              alignItems="center"
              height="auto"
              flex={1}
            >
              {!loading && <ThemedButton
                title="Submit"
                width="50%"
                height="auto"
                type="blue"
                paddingVertical="2.5%"
                onPress={async () => {
                  if (barangayState.indexOf(true) < 0) {
                    setLoading(false);
                    Alert.alert("No barangay selected", "Please select a barangay to report to.")
                    return;
                  }
                  if (emergencyTypeState.indexOf(true) < 0) {
                    setLoading(false);
                    Alert.alert("No emergency selected", "Please select an emergency to report.")
                    return;
                  }
                  await getCurrentLocation()
                  .then(async (result) => {
                    if(result != false && session) {
                      console.log(location);
                      console.log(session);
                      console.log("Composing distress message...");
                      const reportTo = barangays[barangayState.indexOf(true)].code;
                      const emergency = {crime: emergencyTypeState[0], 
                                         fire: emergencyTypeState[1], 
                                         injury: emergencyTypeState[2]};
                      const info = addInfo;
                      const loc = new firebase.firestore.GeoPoint(result.coords.latitude, result.coords.longitude);
                      console.log("Sending distress message...");
                      await auth.distress(reportTo, emergency, info, loc, session.uid)
                      .then((response) => {
                        const result = response as { success: boolean, message: string };
                        console.log("AWOOGA", result);
                        if(result.success) {
                          setLoading(false);
                          setSent(true);
                          setTimeout(() => {
                            setSent(false);
                            router.replace({
                              pathname: "/(tabs)",
                            });
                          }, 3000);
                        } else {
                          setLoading(false);
                          if(result.message == "firestore/permission-denied") {
                            Alert.alert("Distress message recently sent", "Recently sent distress message, please wait before sending another. \n\nContact authorities via the phone app if you need further assistance.");
                          } else {
                            Alert.alert("Failed to send", "Distress message failed to send, please try contacting authorities directly through voice call.");
                          }

                        }
                      });
                    } else {
                      setLoading(false);
                      Alert.alert("Could not get location", "Please enable location services to send a distress message.");
                    }
                  });
                }}
              />}

              {loading && 
                <Pressable
                style={{
                  backgroundColor: "#115272",
                  height: 36,
                  width: "50%",
                  borderRadius: 50,
                  justifyContent: "center",
                  paddingVertical: "5%",
                }}>
                  <ActivityIndicator size="small" color="#FFF"/>
                </Pressable>
              }
            </SpacerView>
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
