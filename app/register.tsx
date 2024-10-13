//React Imports
import {
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";

//Expo Imports
import { router } from "expo-router";

//Stylesheet Imports
import { styles } from "@/styles/styles";
import { utility } from "@/styles/utility";

//Component Imports
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { SpacerView } from "@/components/SpacerView";
import { ThemedButton } from "@/components/ThemedButton";

//Icon Imports
import Ionicons from "@expo/vector-icons/Ionicons";

//checkbox import
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useState } from "react";

//Modal Import
import Modal from "react-native-modal";
import { ThemedView } from "@/components/ThemedView";

export default function Register() {
  const logo = require("../assets/images/logo.png");

  const [toggleModal, setToggleModal] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleCheckboxPress = (isChecked: any) => {
    setIsCheckboxChecked(isChecked);
    setToggleModal(isChecked);
  };

  const handleSignUp = () => {
    if (isCheckboxChecked) {
      router.replace({
        pathname: "/otp",
      });
    } else {
      console.log("Please agree to the terms and conditions");
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
        <SpacerView height={60} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 400}
          style={[styles.subContainer, utility.blueBackground]}
        >
          <ThemedText lightColor="#FFF" darkColor="#FFF" type="title">
            Sign up
          </ThemedText>
          <ThemedInput type="outline" placeholder="First Name" />
          <ThemedInput type="outline" placeholder="Last Name" />
          <ThemedInput type="outline" placeholder="+63" />
          <ThemedInput type="outline" placeholder="Email" />
          <ThemedInput type="outline" placeholder="********" secureTextEntry />
          <SpacerView height={40} />
          <SpacerView height={40}>
            <ThemedButton
              title="Sign up"
              onPress={() => {
                router.replace({
                  pathname: "/otp",
                });
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
                  pathname: "/",
                });
              }}
            >
              <ThemedText lightColor="#FFF" darkColor="#FFF" type="body">
                Already have an account?{" "}
              </ThemedText>
            </Pressable>
          </SpacerView>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  } else if (Platform.OS === "web") {
    return (
      <SpacerView
        height="100%"
        width="100%"
        style={[utility.blueBackground]}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <SpacerView
          style={[utility.blueBackground]}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
          width="50%"
        >
          <Image source={logo}></Image>

          <SpacerView height="5%" />

          <ThemedText lightColor="#FFF" darkColor="#FFF" type="display">
            L I S T O
          </ThemedText>
        </SpacerView>

        <SpacerView
          style={[utility.blueBackground]}
          flexDirection="column"
          justifyContent="center"
          height="75%"
          width="50%"
        >
          <SpacerView
            height="100%"
            width="75%"
            style={[utility.whiteBackground, registerStyle.shadowBox]}
            borderRadius={20}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <ThemedText
              lightColor="#115272"
              darkColor="#115272"
              type="subDisplay"
            >
              Create an account
            </ThemedText>
            <SpacerView height="5%" />
            <SpacerView
              style={{
                alignSelf: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "75%",
              }}
            >
              <ThemedInput
                width="50%"
                backgroundColor="#fff"
                type="blueOutline"
                marginVertical="2.5%"
                placeholderTextColor="#7CB7D8"
                placeholder="First Name"
              />
              <ThemedInput
                width="50%"
                backgroundColor="#fff"
                type="blueOutline"
                marginVertical="2.5%"
                placeholderTextColor="#7CB7D8"
                placeholder="Last Name"
              />
            </SpacerView>
            <ThemedInput
              width="75%"
              backgroundColor="#fff"
              type="blueOutline"
              marginVertical="2.5%"
              placeholderTextColor="#7CB7D8"
              placeholder="+63"
            />
            <ThemedInput
              width="75%"
              backgroundColor="#fff"
              type="blueOutline"
              marginVertical="2.5%"
              placeholderTextColor="#7CB7D8"
              placeholder="Email"
            />
            <ThemedInput
              width="75%"
              backgroundColor="#fff"
              type="blueOutline"
              marginVertical="2.5%"
              placeholderTextColor="#7CB7D8"
              placeholder="********"
              secureTextEntry
            />
            <SpacerView height="2%" />
            <Modal isVisible={toggleModal}>
              <SpacerView
                style={[
                  registerStyle.shadowBox,
                  {
                    height: "75%",
                    width: "50%",
                    alignSelf: "center",
                    borderRadius: 20,
                  },
                ]}
              >
                <ThemedView
                  style={{
                    flex: 1,
                    backgroundColor: "white",
                    width: "50%",
                    height: "100%",
                    borderRadius: 20,
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 30,
                  }}
                >
                  <ThemedText type="title" darkColor="#115272">
                    Terms and Conditions:
                  </ThemedText>
                  <ThemedText
                    style={{
                      color: "black",
                      padding: 20,
                      textAlign: "justify",
                    }}
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </ThemedText>
                  <ThemedText type="title" darkColor="#115272">
                    Data Privacy:
                  </ThemedText>
                  <ThemedText
                    style={{
                      color: "black",
                      padding: 20,
                      textAlign: "justify",
                    }}
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                  </ThemedText>
                  <SpacerView height="15%" />
                  <ThemedButton
                    title="Close"
                    width="25%"
                    style={{ justifyContent: "center" }}
                    onPress={() => setToggleModal(false)}
                  />
                </ThemedView>
              </SpacerView>
            </Modal>
            <BouncyCheckbox
              style={{
                flexDirection: "row",
                width: "75%",
                justifyContent: "center",
              }}
              size={25}
              fillColor="red"
              unFillColor="#FFFFFF"
              text="Click here to agree to the Terms and Conditions and Data Privacy"
              iconStyle={{ borderColor: "red", borderRadius: 10 }}
              innerIconStyle={{ borderWidth: 2, borderRadius: 10 }}
              textStyle={{
                textDecorationLine: "none",
                color: "black",
              }}
              onPress={handleCheckboxPress}
            />
            <SpacerView height="2%" />
            <ThemedButton
              width="25%"
              title="Sign up"
              onPress={handleSignUp}
              disabled={!isCheckboxChecked}
            />
            <SpacerView height="2.5%" />
            <Pressable
              style={{
                width: "auto",
                height: "auto",
              }}
              onPress={() => {
                router.replace({
                  pathname: "/",
                });
              }}
            >
              <ThemedText lightColor="#115272" darkColor="#115272" type="body">
                Already have an account?{" "}
              </ThemedText>
            </Pressable>
          </SpacerView>
        </SpacerView>
      </SpacerView>
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
});
