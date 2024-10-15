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

const logo = require("../assets/images/logo.png");

export default function Login() {
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
            behavior='height'
            keyboardVerticalOffset={0}
            style={[styles.container, utility.blueBackground]}
          >
            
              <ThemedText lightColor='#FFF' darkColor='#FFF' type="title" >Login</ThemedText>
              <ThemedInput type='outline' placeholder='Email' />
              <ThemedInput type='outline' placeholder='********' secureTextEntry />
              <Pressable 
                    style = 
                    {{
                      width: 'auto',
                      height: 'auto'
                    }}
                    onPress={() => {
                      router.replace({
                      pathname: "/forgot",
                    })}}>
              <ThemedText lightColor='#FFF' darkColor='#FFF' type="body" >Forgot Password?</ThemedText>
              </Pressable>
              <SpacerView height={40} />
              <SpacerView height={40}>
                <ThemedButton title="Login" onPress={() => 
                  {router.replace({
                    pathname: "/summary",
                  })}} />
              </SpacerView>
              <SpacerView height={55} marginTop={20}>
              <Pressable 
                    style = 
                    {{
                      width: 'auto',
                      height: 'auto'
                    }}
                    onPress={() => {
                      router.replace({
                      pathname: "/adminLogin",
                    })}}>
                  <ThemedText lightColor='#FFF' darkColor='#FFF' type="body" >Don't have an account? </ThemedText>
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
          height="50%"
          width="50%"
        >
          <Image source={logo} style={{ width: 200, height: 200 }}></Image>

          <SpacerView height="1%" />

          <ThemedText lightColor="#FFF" darkColor="#FFF" type="display">
            L I S T O
          </ThemedText>
        </SpacerView>

        <SpacerView
          style={utility.blueBackground}
          flexDirection="column"
          justifyContent="center"
          height="75%"
          width="50%"
        >
          <SpacerView
            height="75%"
            width="75%"
            style={utility.whiteBackground}
            borderRadius={20}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <ThemedText lightColor="#115272" darkColor="#115272" type="display">
              Login
            </ThemedText>
            <SpacerView height="10%" />
            <ThemedInput
              width="75%"
              backgroundColor="white"
              type="blueOutline"
              marginVertical="2.5%"
              placeholderTextColor="#7CB7D8"
              placeholder="Phone Number or Email"
              style={{ fontSize: 20, fontWeight: 400 }}
            />
            <ThemedInput
              width="75%"
              backgroundColor="white"
              type="blueOutline"
              marginVertical="2.5%"
              placeholderTextColor="#7CB7D8"
              placeholder="Password"
              style={{ fontSize: 20, fontWeight: 400 }}
              secureTextEntry
            />

            <Pressable
              style={[
                loginStyle.forgotPassword,
                {
                  width: "auto",
                  height: "auto",
                },
              ]}
              onPress={() => {
                router.replace({
                  pathname: "/forgot",
                });
              }}
            >
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="body"
                textAlign="left"
              >
                Forgot Password?
              </ThemedText>
            </Pressable>

            <SpacerView height="5%" />
            <ThemedButton
              width="25%"
              title="Login"
              onPress={() => {
                router.replace({
                  pathname: "/(tabs)",
                  params: {
                    id: "John Doe",
                  },
                });
              }}
            />
            <SpacerView height="5%" />
            <Pressable
              style={{
                width: "auto",
                height: "auto",
                margin: 0,
              }}
              onPress={() => {
                router.replace({
                  pathname: "/register",
                });
              }}
            >
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="body"
                style={{ fontWeight: "600" }} // Use string for fontWeight values
              >
                Don't have an account?
                <ThemedText style={{ color: "#FECF1A", fontWeight: "600" }}>

                  {" "}
                  Sign Up
                </ThemedText>
              </ThemedText>
            </Pressable>
          </SpacerView>
        </SpacerView>
      </SpacerView>
    );
  }
}

const loginStyle = StyleSheet.create({
  forgotPassword: {
    alignSelf: "flex-start",
    marginLeft: 90,
  },
});
