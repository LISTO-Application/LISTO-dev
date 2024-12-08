//React Imports
import {
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";

//Expo Imports
import { router, Redirect } from "expo-router";

//Firebase Imports
import { firebase } from "@react-native-firebase/auth";

//Stylesheet Imports
import { styles } from "@/styles/styles";
import { utility } from "@/styles/utility";

//Component Imports
import { ThemedInput } from "@/components";
import { ThemedText } from "@/components";
import { SpacerView } from "@/components";
import { ThemedButton } from "@/components";

export default function Forgot() {

  const session = firebase.auth().currentUser
  if(session != null) {
    return <Redirect href="../(tabs)"/>;
  }

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation

  const logo = require("../../assets/images/logo.png");
  const keyboardBehavior: "padding" | "height" =
    Platform.OS === "ios" ? "padding" : "height";
  if (Platform.OS === "android") {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={[styles.mainContainer, utility.blueBackground]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
          <SpacerView height={100} />
          <KeyboardAvoidingView
            behavior='height'
            keyboardVerticalOffset= {0}
            style={[styles.container, utility.blueBackground]}
          >
            
              <ThemedText lightColor='#FFF' darkColor='#FFF' type="title">Forgot your password?</ThemedText>
              <ThemedInput type='outline' placeholder='Email' onChangeText={setEmail}/>
              <SpacerView height={40} />
              <SpacerView height={40}>
                {!loading && <ThemedButton title="Submit" 
                onPress={async () => {
                  setLoading(true);
                  if(emailRegex.test(email)) {
                    await firebase.auth().sendPasswordResetEmail(email)
                    .then(() => {
                      Alert.alert("Email sent", "A password reset link has been sent to the email if it exists.");
                      setLoading(false);
                      router.replace("../(auth)/login");
                    })
                    .catch((error) => {
                      Alert.alert("Password reset failed", error);
                      setLoading(false);
                    });
                  } else if (email == "") {
                    Alert.alert("Invalid Email", "Please enter an email address.");
                  } else {
                    Alert.alert("Invalid Email", "Please enter a valid email address.");
                  }
                }} />}

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
              </SpacerView>
              <SpacerView height={55}/>
  
          </KeyboardAvoidingView>
  
      </ScrollView>
    );
  } 
}

const forgetStyle = StyleSheet.create({
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
