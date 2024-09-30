import { View, Text } from "react-native";
import React from "react";
import { SpacerView } from "@/components/SpacerView";
import { styles } from "@/styles/styles";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedContainer } from "@/components/ThemedContainer";
import { withTheme } from "react-native-elements";
import { ThemedButton2 } from "@/components/Buttons/ThemedButton2";
import { ModalButton2 } from "@/components/Buttons/ModalButton2";
import { router } from "expo-router";

const deleteaccount = () => {
  return (
    <ThemedView style={styles.mainContainer}>
      <SpacerView height={200} />
      <ThemedContainer
        style={{ backgroundColor: "white", width: "100%", height: "50%" }}
      >
        <ThemedText
          type="subtitle"
          style={{ textAlign: "center" }}
          darkColor="fff"
        >
          We look forward to seeing you again soon!
        </ThemedText>
        <ThemedText
          type="default"
          style={{ textAlign: "center" }}
          darkColor="fff"
        >
          Your account has been deleted successfully. Take note that you cannot
          create a new account with the phone number associated with this
          account for 14 days.
        </ThemedText>
        <SpacerView height={30} />
        <ModalButton2
          title="Redirect to Login (15)"
          style={{ padding: 30 }}
          onPress={() => {
            router.replace({
              pathname: "/",
            });
          }}
        />
      </ThemedContainer>
    </ThemedView>
  );
};

export default deleteaccount;
