//React Imports
import {
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Image,
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

export default function Forgot() {
  const logo = require("../assets/images/logo.png");
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
              <ThemedInput type='outline' placeholder='Email' />
              <SpacerView height={40} />
              <SpacerView height={40}>
                <ThemedButton title="Submit" 
                onPress={() => 
                  router.replace({
                    pathname: "/",
                  })} />
              </SpacerView>
              <SpacerView height={55}/>
  
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

          <SpacerView height="1%" />

          <ThemedText lightColor="#FFF" darkColor="#FFF" type="display">
            L I S T O
          </ThemedText>
        </SpacerView>

        <SpacerView
          style={[utility.blueBackground]}
          flexDirection="column"
          justifyContent="center"
          height="50%"
          width="50%"
        >
          <SpacerView
            height="100%"
            width="75%"
            style={[utility.whiteBackground, forgetStyle.shadowBox]}
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
              Forgot Password?
            </ThemedText>
            <SpacerView height="5%" />
            <ThemedInput
              width="75%"
              backgroundColor="white"
              type="blueOutline"
              marginVertical="2.5%"
              placeholderTextColor="#7CB7D8"
              placeholder="Email"
              style={{ fontSize: 20, fontWeight: 400 }}
            />
            <SpacerView height="5%" />
            <ThemedButton
              width="25%"
              title="Reset Password"
              onPress={() => {
                router.replace({
                  pathname: "/otp",
                });
              }}
            />
            <SpacerView height="2.5%" />
          </SpacerView>
        </SpacerView>
      </SpacerView>
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
