//React Imports
import {
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    Alert,
    View,
    Animated,
  } from "react-native";
  
  //Expo Imports
  import { Redirect, router } from "expo-router";
  
  //Firebase Imports
  import { firebase } from "@react-native-firebase/auth";
  
  //Stylesheet Imports
  import { styles } from "@/styles/styles";
  import { utility } from "@/styles/utility";
  
  //Component Imports
  import { ThemedInput } from "@/components/ThemedInput";
  import { ThemedText } from "@/components/ThemedText";
  import { SpacerView } from "@/components/SpacerView";
  import { ThemedButton } from "@/components/ThemedButton";
  
  //Checkbox import
  import BouncyCheckbox from "react-native-bouncy-checkbox";
  import { useEffect, useState } from "react";
  
  //Component Imports
  import Modal from "react-native-modal";
  import TermsAndConditions from "@/components/TermsConditions";
  import { useDebounce } from "@/hooks/useDebounce";
  
  export default function adminRegister() {
  
    const session = firebase.auth().currentUser
    if(session != null) {
      return <Redirect href="../(tabs)"/>;
    }
  
    const logo = require("../../assets/images/logo.png");
  
    // Terms and Conditions Modal
    const [toggleModal, setToggleModal] = useState(false);
  
    // States for form fields
    const fields = [0, 1, 2, 3];
  
    // State for form inputs
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const [fieldState, setFieldStates] = useState(
      fields.map(() => false)
    );
  
    const [focus, setFocusField] = useState(
      fields.map(() => false)
    );
  
    // Regex for form validation
    const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$^*.[\]{}()?"!@#%&/\\,><':;|_~])[A-Za-z\d$^*.[\]{}()?"!@#%&/\\,><':;|_~]{6,}$/; // Minimum eight characters, at least one letter and one number
    const phoneRegex = /^\+639\d{9}$/; // 11-digit phone number
  
    const handleInvalidField = (index: number) => {
      setFieldStates((prevStates) =>
        prevStates.map((state, i) => (i === index ? true : state))
      );
    };
  
    const handleChangedField = (index: number) => {
      setFieldStates((prevStates) =>
        prevStates.map((state, i) => (i === index ? false : state))
      );
    };
  
    const handleFocus = (index: number) => {
      setFocusField((prevStates) =>
        prevStates.map((state, i) => (i === index ? !state : state))
      );
    };
  
  
    if (Platform.OS === "android") {
  
    const handleSignUp = () => {
        router.push({
          pathname: "/adminOtp",
          params: 
          {
            userName: userName,
            phone: phone,
            email: email,
            password: password
          }
        })
    };
  
    const handlePhoneChange = (text : string) => {
      if (!text.startsWith('+639')) {
        text = '+639';
      }
      setPhone(text);
    };
  
      return (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={[styles.mainContainer, utility.blueBackground]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SpacerView height={60} />
          <KeyboardAvoidingView
            behavior={"height"}
            style={[styles.container, utility.blueBackground]}
          >
            <ThemedText lightColor="#FFF" darkColor="#FFF" type="title">
              Create Admin
            </ThemedText>
  
            <View style={registerStyle.inputField}>
              <TextInput
              style = {[registerStyle.outline, focus[0] && registerStyle.focused]} 
              placeholder="Username" 
              placeholderTextColor= "#BBB"
              onChangeText={setUserName}
              onChange = {() => handleChangedField(0)}
              onFocus={() => handleFocus(0)}
              onBlur={() => handleFocus(0)}
              value={userName}
              />
              {fieldState[0] && <Text style = {registerStyle.errorText}> Please enter a valid username </Text>}
            </View>
  
            <View style={registerStyle.inputField}>
              <TextInput
              style = {[registerStyle.outline, focus[1] && registerStyle.focused]} 
              placeholder="+63" 
              placeholderTextColor= "#BBB"
              onChangeText={handlePhoneChange}
              onChange = {() => handleChangedField(1)}
              onFocus={() => {handlePhoneChange(phone); handleFocus(1);}}
              onBlur={() => handleFocus(1)}
              value={phone}
              inputMode="numeric"
              />
              {fieldState[1] && <Text style = {registerStyle.errorText}> Please enter a valid phone number </Text>}
            </View>
  
            <View style={registerStyle.inputField}>
              <TextInput
              style = {[registerStyle.outline, focus[2] && registerStyle.focused]} 
              placeholder="Email" 
              placeholderTextColor= "#BBB"
              onChangeText={setEmail}
              onChange = {() => handleChangedField(2)}
              onFocus={() => handleFocus(2)}
              onBlur={() => handleFocus(2)}
              value={email}
              />
            {fieldState[2] && <Text style = {registerStyle.errorText}> Please enter a valid email address </Text>}
            </View>
  
            <View style={registerStyle.inputField}>
              <TextInput
              style = {[registerStyle.outline, focus[4] && registerStyle.focused]} 
              placeholder="********" 
              placeholderTextColor= "#BBB"
              onChangeText={setPassword}
              onChange = {() => handleChangedField(4)}
              onFocus={() => handleFocus(4)}
              onBlur={() => handleFocus(4)}
              value={password}
              secureTextEntry
              />
              {fieldState[3] && <Text style = {registerStyle.errorText}> Please enter a valid password </Text>}
            </View>
  
            <SpacerView height={20} />
            <SpacerView height={20} />
            <SpacerView height={40}>
              <ThemedButton
                title="Submit"
                onPress={() => {
                  if(nameRegex.test(userName) && emailRegex.test(email) && passwordRegex.test(password) && phoneRegex.test(phone)) {
                    handleSignUp()
                  } 
                  if (!nameRegex.test(userName)) {
                    handleInvalidField(0);
                  }
                  if (!phoneRegex.test(phone)) {
                    handleInvalidField(1);
                  }
                  if (!emailRegex.test(email)) {
                    handleInvalidField(2);
                  }
                  if (!passwordRegex.test(password)) {
                    handleInvalidField(3);
                  }
                }}
              />
            </SpacerView>
            <SpacerView height={55} marginTop={20}>
              <Pressable
                style={{
                  width: "auto",
                  height: "auto",
                }}
                onPress={() => {
                  router.replace({
                    pathname: "/(auth)/login",
                  });
                }}
              >
                <ThemedText lightColor="#FFF" darkColor="#FFF" type="body">
                  Return to login{" "}
                </ThemedText>
              </Pressable>
            </SpacerView>
          </KeyboardAvoidingView>
        </ScrollView>
      );
    }
  }
  
  const registerStyle = StyleSheet.create({
    shadowBox: {
      shadowColor: "#333333",
      shadowOffset: {
        width: 10,
        height: 10,
      },
      shadowOpacity: 0.6,
      shadowRadius: 4,
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
    },
    outline: {
      height: 48,
      borderRadius: 50,
      backgroundColor: "transparent",
      padding: 10,
      borderColor: "#FFF",
      borderWidth: 3,
      paddingLeft: 20,
      color: "#FFF",
      fontWeight: "bold",
    },
    focused: {
      backgroundColor: "#FFF",
      color: '#115272',
    }
  });
  