import { View, Text } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { SpacerView } from "@/components/SpacerView";
import { ThemedText } from "@/components/ThemedText";
import { styles } from "@/styles/styles";
import { ThemedContainer } from "@/components/ThemedContainer";
import { ModalButton2 } from "@/components/Buttons/ModalButton2";
import { ModalButton3 } from "@/components/Buttons/ModalButton3";
import { ThemedInput } from "@/components/ThemedInput";
import SearchableDropdown from "react-native-searchable-dropdown";

var items = [
  {
    id: 1,
    name: "Javascript",
  },
  {
    id: 2,
    name: "Java",
  },
  {
    id: 3,
    name: "Ruby on R",
  },
  {
    id: 4,
    name: "React Native",
  },
  {
    id: 5,
    name: "PHP",
  },
  {
    id: 6,
    name: "Python",
  },
];

const reportdetails = () => {
  return (
    <ThemedView style={styles.mainContainer}>
      <SpacerView height={50} />
      <ThemedText
        type="title"
        style={{ textAlign: "center", fontSize: 25, color: "#fff" }}
      >
        Enter Report Details
      </ThemedText>
      <SpacerView height={5} />
      <ThemedText
        type="subtitle"
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: "400",
          color: "#fff",
        }}
      >
        Please fill in the required fields
      </ThemedText>
      <SpacerView height={20} />
      <ThemedContainer type="solid" style={{ width: "100%", height: "75%" }}>
        <ThemedText type="subtitle" style={{ color: "#115272" }}>
          Select Crime Type
        </ThemedText>
        <ThemedInput type="" style />
        <ThemedText type="subtitle" style={{ color: "#115272" }}>
          Location
        </ThemedText>
        <ThemedText type="subtitle" style={{ color: "#115272" }}>
          Additional Information
        </ThemedText>
        <ThemedText type="subtitle" style={{ color: "#115272" }}>
          Image
        </ThemedText>
        <SpacerView>
          <ModalButton2 title="Cancel" style={{ width: "10%" }} />
          <ModalButton3 title="Submit Report" />
        </SpacerView>
      </ThemedContainer>
    </ThemedView>
  );
};

export default reportdetails;
