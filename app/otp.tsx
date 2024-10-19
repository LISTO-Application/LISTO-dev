//React Imports
import {
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  StyleSheet,
  View,
  Text,
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

//OTP Imports

import { OtpInput, OtpInputRef } from "react-native-otp-entry";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useRef, useState } from "react";

interface ExportOtpInputRef extends OtpInputRef {
  clear: () => void;
}

export default function OTPForgot() {
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
  const logo = require("../assets/images/logo.png");

  //Only for testing, making sure it works
  // useEffect(() => {
  //   if (otpInputRef.current) {
  //     otpInputRef.current.setValue('999999');
  //   }
  // }, []);

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
          behavior="height"
          keyboardVerticalOffset={0}
          style={[styles.container, utility.blueBackground]}
        >
          <ThemedText lightColor="#FFF" darkColor="#FFF" type="title">
            Enter OTP
          </ThemedText>
          <ThemedInput type="outline" placeholder="_ _ _ _ _ _" />
          <SpacerView height={40} />
          <SpacerView height={40}>
            <ThemedButton
              title="Submit"
              onPress={() =>
                router.replace({
                  pathname: "/",
                })
              }
            />
          </SpacerView>
          <SpacerView height={55} />
        </KeyboardAvoidingView>
      </ScrollView>
    );
  } else if (Platform.OS === "web") {
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
