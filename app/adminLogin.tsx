import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Button,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { styles } from "@/styles/styles";
import { utility } from "@/styles/utility";
import { router } from "expo-router";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";

import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { SpacerView } from "@/components/SpacerView";
import { ThemedButton } from "@/components/ThemedButton";

export default function adminLogin() {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={[styles.mainContainer, utility.blueBackground]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <SpacerView height={80} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        style={[styles.container, utility.blueBackground]}
      >
        <ThemedText lightColor="#FFF" darkColor="#FFF" type="title">
          Admin Login
        </ThemedText>
        <ThemedInput type="outline" placeholder="Email" />

        <ThemedInput type="outline" placeholder="********" secureTextEntry />
        <TouchableOpacity onPress={() => router.push("/forgot")}>
          <ThemedText lightColor="#FFF" darkColor="#FFF" type="body">
            Forgot Password?
          </ThemedText>
        </TouchableOpacity>
        <SpacerView height={40} />
        <SpacerView height={40}>
          <ThemedButton
            title="Login"
            onPress={() => {
              router.replace({
                pathname: "/changeAdminInformation",
                params: {},
              });
            }}
          />
        </SpacerView>
        <SpacerView height={55} marginTop={20}>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <ThemedText lightColor="#FFF" darkColor="#FFF" type="body">
              Don't have an account?{" "}
            </ThemedText>
          </TouchableOpacity>
        </SpacerView>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
