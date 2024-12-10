//React Imports
import {
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  View,
  Text,
} from "react-native";

//Expo Imports
import { router, Redirect } from "expo-router";

//Firebase Imports
import { FirebaseAuthTypes, firebase } from "@react-native-firebase/auth";
import crashlytics from '@react-native-firebase/crashlytics';

//Auth Imports
import { useSession } from "@/auth/adminIndex";

//JWT Imports
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";

//Stylesheet Imports
import { styles } from "@/styles/styles";
import { utility } from "@/styles/utility";

//Component Imports
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { SpacerView } from "@/components/SpacerView";
import { ThemedButton } from "@/components/ThemedButton";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { set } from "date-fns";

const logo = require("../../assets/images/logo.png");

export default function Login() {

//Track whether authentication is initializing
const [initializing, setInitializing] = useState(true);
const [isLoading, setIsLoading] = useState(false);
const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [emailError, setEmailError] = useState(false);
const [passwordError, setPasswordError] = useState(false);
const auth = useSession();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$^*.[\]{}()?"!@#%&/\\,><':;|_~])[A-Za-z\d$^*.[\]{}()?"!@#%&/\\,><':;|_~]{6,}$/; // Minimum eight characters, at least one letter and one number

useEffect(() => {
  const subscriber = firebase.auth().onAuthStateChanged((user) => {
    setUser(user);
    setInitializing(false);
  });
  return subscriber;
}, []);

if (initializing) return null;

if(user != null) {
  return <Redirect href="/(tabs)" />;
}

const handleLogin = async () => {
  if (email && password) {
    try {
      await auth.signIn(email, password);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  } else {
    Alert.alert('Input credentials', 'Please enter your email and password.');
  }
};

  if (Platform.OS === "android") {

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={[styles.mainContainer, utility.blueBackground]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SpacerView height={80} />
        <KeyboardAvoidingView
          behavior="height"
          keyboardVerticalOffset={0}
          style={[styles.container, utility.blueBackground]}
        >
          <ThemedText lightColor="#FFF" darkColor="#FFF" type="title">
            Login
          </ThemedText>
          <View style = {loginStyle.inputField}>
            <TextInput style = {loginStyle.textInput} placeholder="Email" placeholderTextColor = "#BBB" onChangeText={setEmail} onChange={() => setEmailError(false)}/>
            {emailError && <Text style ={loginStyle.errorText}> Please enter a valid email </Text>}
          </View>
          <View style = {loginStyle.inputField}>
          <TextInput style = {loginStyle.textInput} placeholder="********"   placeholderTextColor = "#BBB" onChangeText={setPassword} onChange={() => setPasswordError(false)} secureTextEntry />
          {passwordError && <Text style ={loginStyle.errorText}> Please enter a valid password </Text>}
          </View>
          <Pressable
            style={{
              width: "auto",
              height: "auto",
            }}
            onPress={() => {
              router.push({
                pathname: "/forgot",
                params: {},
              });
            }}
          >
            <ThemedText lightColor="#FFF" darkColor="#FFF" type="body">
              Forgot Password?
            </ThemedText>
          </Pressable>
          <SpacerView height={40} />
          <SpacerView height={40}>
            {!isLoading && <ThemedButton
              title="Login"
              onPress={async () => 
                {
                  setIsLoading(true);
                  if(emailRegex.test(email) && passwordRegex.test(password)) {
                  handleLogin()
                  }
                  if (emailRegex.test(email) == false) {
                    setEmailError(true);
                  }
                  if (passwordRegex.test(password) == false) {
                    setPasswordError(true);
                  }
                  setIsLoading(false);
                }}
            />}

            {isLoading &&
            <Pressable
              style={{
                backgroundColor: "#DA4B46",
                height: 36,
                width: "100%",
                borderRadius: 50,
                justifyContent: "center",
              }}>
                <ActivityIndicator size="large" color="#FFF"/>
              </Pressable>}
          </SpacerView>
          <SpacerView height={55} marginTop={20}>
            <Pressable
              style={{
                width: "auto",
                height: "auto",
              }}
              onPress={() => {
                router.push({
                  pathname: "/adminRegister",
                  params: {},
                });
              }}
            >
              <ThemedText lightColor="#FFF" darkColor="#FFF" type="body">
                Don't have an account?{" "}
              </ThemedText>
            </Pressable>
          </SpacerView>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const loginStyle = StyleSheet.create({
  textInput: {
    height: 48,
    backgroundColor: "transparent",
    borderRadius: 50,
    borderColor: "#FFF",
    borderWidth: 3,
    paddingLeft: 20,
    color: "#FFF",
    fontWeight: "bold",
    padding: 10,
  },
  errorText: {
    color: "#DA4B46",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 2,
    marginVertical: 2
  },
  inputField: {
    flexDirection: 'column',
    marginVertical: '5%',
    height: 'auto',
  },
  forgotPassword: {
    alignSelf: "flex-start",
    marginLeft: 90,
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
