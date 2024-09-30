import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Button,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import { styles } from "@/styles/styles";
import { utility } from "@/styles/utility";
import { router } from "expo-router";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";

import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { SpacerView } from "@/components/SpacerView";
import { ThemedButton } from "@/components/Buttons/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Overlay } from "react-native-elements";
import { ThemedContainer } from "@/components/ThemedContainer";
import { ThemedButton2 } from "@/components/Buttons/ThemedButton2";
import { ModalButton3 } from "@/components/Buttons/ModalButton3";
import { ModalButton2 } from "@/components/Buttons/ModalButton2";
import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

interface DeleteAccOverlayProps {
  visible: boolean;
  toggleOverlay: () => void;
}

interface LogOutOverlayProps {
  visible: boolean;
  toggleOverlay: () => void;
}

function DeleteAccOverlay({ visible, toggleOverlay }: DeleteAccOverlayProps) {
  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={toggleOverlay}
      overlayStyle={{ borderRadius: 50, padding: 0 }}
    >
      <ThemedContainer style={{ backgroundColor: "white" }}>
        <ThemedText style={{ color: "#115272", textAlign: "center" }}>
          Are you sure you want to delete your account?
        </ThemedText>
        <SpacerView height={50} />
        <SpacerView height={40}>
          <ModalButton3 title="Cancel" onPress={toggleOverlay} />
          <ModalButton2
            title="Confirm"
            onPress={() => {
              router.replace({
                pathname: "/deleteaccount",
              });
            }}
          />
        </SpacerView>
      </ThemedContainer>
    </Overlay>
  );
}

function LogOutOverlay({ visible, toggleOverlay }: LogOutOverlayProps) {
  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={toggleOverlay}
      overlayStyle={{ borderRadius: 50, padding: 0 }}
    >
      <ThemedContainer style={{ backgroundColor: "white" }}>
        <ThemedText style={{ color: "#115272", textAlign: "center" }}>
          Are you sure you want to log out?
        </ThemedText>
        <SpacerView height={50} />
        <SpacerView height={40}>
          <ModalButton3 title="Cancel" onPress={toggleOverlay} />
          <ModalButton2
            title="Confirm"
            onPress={() => {
              router.replace({
                pathname: "/",
              });
            }}
          />
        </SpacerView>
      </ThemedContainer>
    </Overlay>
  );
}

export default function UserAccount() {
  const { id } = useLocalSearchParams();

  const [deleteVisible, setDeleteVisible] = useState(false);
  const [logOutVisible, setLogOutVisible] = useState(false);

  const toggleDeleteOverlay = () => {
    setDeleteVisible(!deleteVisible);
  };

  const toggleLogOutOverlay = () => {
    setLogOutVisible(!logOutVisible);
  };

  return (
    <ThemedView style={styles.mainContainer}>
      <SpacerView height={60} />
      <ThemedView style={styles.subContainer}>
        <ThemedText
          lightColor="#FFF"
          darkColor="#FFF"
          type="title"
          style={styles.text}
        >
          User {id}{" "}
        </ThemedText>
        <ThemedInput type="outline" placeholder="Email" />
        <ThemedText lightColor="#FFF" darkColor="#FFF" type="body">
          Welcome! {id}{" "}
        </ThemedText>
        <SpacerView height={20} />
        <SpacerView height={40}>
          <ThemedButton title="Log Out" onPress={toggleLogOutOverlay} />
        </SpacerView>
        <SpacerView height={20} />
        <SpacerView height={40}>
          <ThemedButton title="Delete Account" onPress={toggleDeleteOverlay} />
        </SpacerView>

        <SpacerView height={55} />
        <SpacerView height={40}>
          <ThemedButton
            title="Enter Report Details"
            onPress={() => {
              router.replace({
                pathname: "/reports/reportdetails",
              });
            }}
          />
        </SpacerView>
      </ThemedView>

      <DeleteAccOverlay
        visible={deleteVisible}
        toggleOverlay={toggleDeleteOverlay}
      />
      <LogOutOverlay
        visible={logOutVisible}
        toggleOverlay={toggleLogOutOverlay}
      />
    </ThemedView>
  );
}
