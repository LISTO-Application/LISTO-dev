//React Imports
import {
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useEffect, useRef, useState } from "react";

//Expo Imports
import { Redirect, router, useLocalSearchParams } from "expo-router";

//Firebase Imports
import firestore from '@react-native-firebase/firestore';
import { FirebaseAuthTypes, firebase} from '@react-native-firebase/auth';

//Auth Imports
import { useSession } from "@/auth";

//Stylesheet Imports
import { styles } from "@/styles/styles";
import { utility } from "@/styles/utility";

//Component Imports
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { SpacerView } from "@/components/SpacerView";
import { ThemedButton } from "@/components/ThemedButton";
import { LoadingScreen } from "@/components/navigation/LoadingScreen";
import Confirm from "@/assets/images/confirm.svg";

// Hooks
import useResponsive from '@/hooks/useResponsive';
//OTP Imports
import { OtpInput, OtpInputRef } from "react-native-otp-entry";
import { isLoading } from "expo-font";

const logo = require("../../assets/images/logo.png");

interface ExportOtpInputRef extends OtpInputRef {
  clear: () => void;
}

export default function OTP() {

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const { display, subDisplay, title, subtitle, body, small, height, tiny} = useResponsive();
  
  // Chcek if user is logged in
  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setInitializing(false);
    });
    return subscriber;
  }, []);

  if(user != null) {
    router.replace("../(tabs)");
  }
  
  // Set initializing state
  const [initializing, setInitializing] = useState(true);

  // Initialize auth
  const auth = useSession();
  const session = firebase.auth().currentUser;

  // Set states
  const [confirm, setConfirm] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Access query parameters and set user data
  const formData = useLocalSearchParams();
  const email = formData.email.toString();
  const password = formData.password.toString();
  const firstName = formData.firstName.toString();
  const lastName = formData.lastName.toString();
  const phone = formData.phone.toString();

  // Return null while initializing
  if (initializing) {
    return (
      <LoadingScreen />
    )
  };
  // Redirect to main page if user is logged in
  if (session) return <Redirect href="/(tabs)" />;

  if (Platform.OS === "android") {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={[styles.mainContainer, utility.blueBackground]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <SpacerView height={100} />
        <KeyboardAvoidingView
          behavior="height"
          keyboardVerticalOffset={0}
          style={[styles.container, utility.blueBackground]}>

          {!accountCreated && 
          <>
            <Confirm style = {{backgroundColor: "#DA4B46", aspectRatio: 1/1, marginHorizontal: "auto", marginBottom: "20%", borderRadius: 100}} width={display * 3} height={display * 3}/>
            <ThemedText lightColor="#FFF" darkColor="#FFF" type="title">
              Almost there...
            </ThemedText>
          </>}

          {accountCreated && <ThemedText lightColor="#FFF" darkColor="#FFF" type="title">
            Welcome to LISTO!
          </ThemedText>
          }

          {!confirm && (
            <>

              <Text style = {{marginVertical: '5%', fontSize: body, color: "#FFF", fontWeight: "bold"}}>
               If your phone number is correct, press the button below to receive an OTP. Please allow up to 5 minutes for the OTP to arrive.
              </Text>

              {!loading && <ThemedButton
                  title="Send OTP"
                  marginVertical='5%'
                  onPress={async () => {
                    setLoading(true);
                    await firebase.app().functions("asia-east1").httpsCallable("verifyOTP")({
                      pnumber: phone,
                    })
                    .then((result) => {
                      setLoading(false);
                      const data = result.data as { success: boolean, message: string };
                      if (data.success == true) {
                        setConfirm(true);
                      } else {
                        Alert.alert("OTP request failed", "LISTO may be experiencing technical issues or the phone number is invalid, please try again.")
                      }
                    })
                    .catch(error => {
                      console.log(error);
                      Alert.alert("OTP request failed", "LISTO is experiencing technical issues, please try again later.")
                    });
                  }}
                />}

                {loading && 
                  <Pressable
                  style={{
                    backgroundColor: "#DA4B46",
                    height: 36,
                    width: "100%",
                    borderRadius: 50,
                    justifyContent: "center",
                    marginVertical: '5%'
                  }}>
                    <ActivityIndicator size="large" color="#FFF"/>
                  </Pressable>}
            </>
          )}
          {confirm && !accountCreated && (
            <>
            <SpacerView height='5%' />
            <OtpInput 
            numberOfDigits={6} 
            onTextChange={setCode} 
            focusColor="#FECF1A" 
            autoFocus={true}
            textInputProps={{keyboardType: 'numeric'}}
            theme = {{
              containerStyle: {width: "auto", maxWidth: "50%"},
              pinCodeTextStyle: {fontSize: subtitle, fontWeight: "bold", color: '#FFF'},
              pinCodeContainerStyle: {width: "25%", borderWidth: 3, borderColor: '#FFF', borderRadius: 10, margin: 5},
            }}/>
              {!loading && <ThemedButton
                title="Submit"
                marginVertical='10%'
                onPress={async () => {
                  setLoading(true);
                  const result = await auth.register(email, password, firstName, lastName, phone, code)
                  console.log(result);
                  if(result.success == true) {
                    setLoading(false);
                    setAccountCreated(true);
                  }
                  else {
                    if (result.message == "INVALID_OTP") {
                      Alert.alert("Invalid OTP", "The OTP entered is incorrect, please try again.");
                      setLoading(false);
                    }
                    if (result.message == "BLACKLISTED") {
                      Alert.alert("Blacklisted", "Account was deleted recently, please try again soon or contact support.");
                      setLoading(false);
                      router.replace({pathname: "/(auth)/login"});
                    }
                    if (result.message === "TOO_MANY_REQUESTS") {
                      Alert.alert("Limit exceeded", "Too many attempts, please try again later.");
                      setLoading(false);
                      router.replace({pathname: "/(auth)/login"});
                    } 
                    if (result.message === "auth/INVALID_CREDENTIAL") {
                      Alert.alert("Invalid credentials", "Invalid credentials, please try again.");
                      setLoading(false);
                      router.back();
                    } 
                    if (result.message === "NETWORK_REQUEST_FAILED") {
                      Alert.alert("Poor connection", "Internet connection is unstable, please try again later.");
                      setLoading(false);}

                    if (result.message === "INVALID_EMAIL") {
                      Alert.alert("Invalid email", "The email entered is invalid, please try again.");
                      setLoading(false);
                      router.back();
                    } 
                    if (result.message === "INVALID_PASSWORD") {
                      Alert.alert("Invalid password", "The password entered is invalid, please try again.");
                      setLoading(false);
                      router.back();
                    } 
                    if (result.message === "WEAK_PASSWORD") {
                      Alert.alert("Weak password", "The password entered is too weak, please try again. Passwords need 1 uppercase, 1 lowercase, 1 number, and 1 special character.");
                      setLoading(false);
                      router.back();
                    } 
                    if (result.message === "EMAIL_EXISTS") {
                      Alert.alert("Email already in use", "The email entered is already in use, please try again with a different email address.");
                      setLoading(false);
                      router.back();
                    } if (result.message === "PHONE_EXISTS") {
                      Alert.alert("Phone number already in use", "The phone number entered is already in use, please try again with a different phone number.");
                      setLoading(false);
                      router.back();
                    } if (result.message === "UKKNOWN_ERROR") {
                      Alert.alert("Sign in error", "There was an error signing in as admin, please try again later.");
                      setLoading(false);
                    } else {
                      console.log(result.message);
                      Alert.alert("Uh oh", "There was an error, please try again later.");
                      setLoading(false);
                    }
                  }
                }}
              />}

                {loading && 
                  <Pressable
                  style={{
                    backgroundColor: "#DA4B46",
                    height: 36,
                    width: "100%",
                    borderRadius: 50,
                    justifyContent: "center",
                    marginVertical: '5%'
                  }}>
                    <ActivityIndicator size="large" color="#FFF"/>
                  </Pressable>}
            </>
          )}
          {accountCreated && (
            <>
          <SpacerView height={40} />
          <ThemedText lightColor="#FFF" darkColor="#FFF" type="subtitle">
            Your account has been created successfully, you have been logged in automatically!
          </ThemedText>
            <SpacerView height={40} />
            <SpacerView height={40}>
              <ThemedButton
                title="Continue to LISTO"
                onPress={() => {router.replace("/(auth)/login")}
                }
              />
            </SpacerView>
            </>
          )}
          <SpacerView height={55} />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  } else if (Platform.OS === "web") {

    const otpInputRef = useRef<ExportOtpInputRef>(null);
    const [error, setError] = useState("");
  
    const handleOtpFilled = (otp: string) => {
      console.log("Entered OTP:", otp);
      if (otp === "999999") {
        console.log("OTP Accepted");
        router.replace({
          pathname: "/changepass",
          params: {},
        });
      } else {
        setError("Wrong OTP, please try again");
        if (otpInputRef.current) {
          otpInputRef.current.clear();
        }
      }
    };

    return (
      <SpacerView
        height="100%"
        width="100%"
        style={[utility.blueBackground, { margin: 20 }]}
        flexDirection="column"
        alignItems="center"
      >
        <SpacerView height="10%" />
        <SpacerView
          style={[utility.blueBackground]}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="25%"
          width="25%"
        >
          <Image source={logo} style={{ width: 200, height: 200 }}></Image>

          <ThemedText lightColor="#FFF" darkColor="#FFF" type="subDisplay">
            L I S T O
          </ThemedText>
        </SpacerView>
        <SpacerView height="5%" />
        <SpacerView
          style={[
            utility.blueBackground,
            otpStyle.shadowBox,
            { borderRadius: 20 },
          ]}
          flexDirection="column"
          justifyContent="center"
          height="30%"
          width="30%"
        >
          <SpacerView
            height="100%"
            width="100%"
            style={[utility.whiteBackground]}
            borderRadius={20}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <ThemedText
              lightColor="#115272"
              darkColor="#115272"
              type="default"
              style={{ textAlign: "center", marginHorizontal: 70 }}
            >
              An One-Time Password (OTP) was sent to your email, insert your otp
              before it expires
            </ThemedText>
            <ThemedText
              lightColor="#115272"
              darkColor="#115272"
              type="subDisplay"
            >
              Enter OTP
            </ThemedText>
            <View
              style={{
                alignSelf: "center",
                margin: 10,
              }}
            >
              <OtpInput
                numberOfDigits={6}
                blurOnFilled={true}
                type={"numeric"}
                theme={{
                  containerStyle: otpStyle.container,
                  pinCodeContainerStyle: otpStyle.pinCodeContainer,
                  focusedPinCodeContainerStyle: otpStyle.pinCodeFocusContainer,
                  focusStickStyle: otpStyle.stickFocus,
                }}
                focusStickBlinkingDuration={500}
                onFilled={handleOtpFilled}
                onBlur={() => {
                  console.log("input blurred");
                }}
                ref={otpInputRef}
              />
            </View>
            {error ? (
              <ThemedText
                type="subtitle"
                style={{ color: "red", marginTop: 5 }}
              >
                {error}
              </ThemedText>
            ) : null}
            <SpacerView height="5%" />
            <ThemedButton
              width="25%"
              title="Clear"
              onPress={() => {
                if (otpInputRef.current) {
                  otpInputRef.current.clear();
                } else {
                  console.warn("OTP input reference is null");
                }
              }}
            />
            <SpacerView height="2.5%" />
          </SpacerView>
        </SpacerView>
        <SpacerView height="10%" />
      </SpacerView>
    );
  }
}

const otpStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  pinCodeContainer: {
    borderColor: "#7CB7D8",
    margin: 5,
  },
  pinCodeFocusContainer: {
    borderColor: "#115272",
  },
  stickFocus: {
    backgroundColor: "#115272",
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
});

    function setError(arg0: string) {
      throw new Error("Function not implemented.");
    }

