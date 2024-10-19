import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SpacerView } from "./SpacerView";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { ThemedButton } from "./ThemedButton";

const TermsConditions = ({ setToggleModal }: { setToggleModal: any }) => {
  return (
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
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
  );
};

export default TermsConditions;

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
