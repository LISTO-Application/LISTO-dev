//React Imports
import {
  Image,
  Platform,
  ScrollView,
  ImageBackground,
  Pressable,
  Modal,
} from "react-native";
import { useRoute } from "@react-navigation/native";

//Expo Imports
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";

//Stylesheet Imports
import { styles } from "@/styles/styles";
import { utility } from "@/styles/utility";

//Component Imports
import { ThemedText } from "@/components/ThemedText";
import { SpacerView } from "@/components/SpacerView";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedView } from "@/components/ThemedView";
import { ThemedIcon } from "@/components/ThemedIcon";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedImageBackground } from "@/components/ThemedImageBackground";
import { useState } from "react";
import DeleteModal from "@/components/modal/DeleteModal";
import LogoutModal from "@/components/modal/LogoutModal";

export default function UserAccount() {
  const texture = require("../../assets/images/texture.png");
  const image = require("../../assets/images/user-icon.png");

  if (Platform.OS === "android") {
    return (
      <ThemedView style={[styles.mainContainer]}>
        <ScrollView>
          <ImageBackground source={texture} style={styles.header}>
            <SpacerView height={30} />
            <Image source={image}></Image>
            <SpacerView height={20} />
            <ThemedText lightColor="#FFF" darkColor="#FFF" type="title">
              {" "}
              John Doe{" "}
            </ThemedText>
            <SpacerView height={20} />
          </ImageBackground>
          <SpacerView height={20} />
          <ThemedView style={[styles.container]}>
            <SpacerView
              style={utility.row}
              borderBottomWidth={5}
              borderBottomColor="#115272"
              height={40}
              marginBottom={10}
            >
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="subtitle"
              >
                Personal Information
              </ThemedText>
              <ThemedIcon name="pencil"></ThemedIcon>
            </SpacerView>

            <SpacerView
              height={65}
              borderBottomWidth={3}
              borderBottomColor="#C3D3DB"
              flexDirection="column"
              marginBottom={5}
            >
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="subtitle"
                paddingVertical={2}
              >
                {" "}
                Name{" "}
              </ThemedText>
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="body"
                paddingVertical={2}
              >
                {" "}
                John Doe{" "}
              </ThemedText>
            </SpacerView>

            <SpacerView
              height={65}
              borderBottomWidth={3}
              borderBottomColor="#C3D3DB"
              flexDirection="column"
              marginBottom={5}
            >
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="subtitle"
                paddingVertical={2}
              >
                {" "}
                Email{" "}
              </ThemedText>
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="body"
                paddingVertical={2}
              >
                {" "}
                johndoe@gmail.com{" "}
              </ThemedText>
            </SpacerView>
            <SpacerView
              height={65}
              borderBottomWidth={3}
              borderBottomColor="#C3D3DB"
              flexDirection="column"
              marginBottom={5}
            >
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="subtitle"
                paddingVertical={2}
              >
                {" "}
                Phone Number{" "}
              </ThemedText>
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="body"
                paddingVertical={2}
              >
                {" "}
                +639123456789{" "}
              </ThemedText>
            </SpacerView>
            <SpacerView height={50} />
            <SpacerView
              style={utility.row}
              borderBottomWidth={5}
              borderBottomColor="#115272"
              height={50}
              marginBottom={10}
            >
              <ThemedText
                lightColor="#115272"
                darkColor="#115272"
                type="subtitle"
              >
                Account Settings
              </ThemedText>
            </SpacerView>
            <SpacerView
              height={35}
              borderBottomWidth={3}
              borderBottomColor="#C3D3DB"
              flexDirection="column"
              marginBottom={5}
            >
              <ThemedText
                lightColor="#DA4B46"
                darkColor="#DA4B46"
                type="body"
                paddingVertical={2}
              >
                {" "}
                Request for Account Deletion{" "}
              </ThemedText>
            </SpacerView>

            <SpacerView
              height={35}
              borderBottomWidth={3}
              borderBottomColor="#C3D3DB"
              flexDirection="column"
              marginBottom={5}
            >
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
                <ThemedText
                  lightColor="#DA4B46"
                  darkColor="#DA4B46"
                  type="body"
                  paddingVertical={2}
                >
                  {" "}
                  Logout{" "}
                </ThemedText>
              </Pressable>
            </SpacerView>
          </ThemedView>

          <SpacerView height={80} />
        </ScrollView>
      </ThemedView>
    );
  } else if (Platform.OS === "web") {
    const [modalDelete, setModalDelete] = useState(false);
    const [modalLogout, setModalLogout] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const handleModalDelete = () => {
      setModalDelete(true);
    };

    const handleModalLogout = () => {
      setModalLogout(true);
    };

    const handleEdit = () => {
      setIsEditable((prev) => !prev);
    };

    return (
      <ThemedView style={[styles.mainContainer, utility.blueBackground]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* MAIN CONTAINER */}
          <SpacerView
            flex={1}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalDelete}
              onRequestClose={() => setModalDelete(false)}
            >
              <DeleteModal setModalDelete={setModalDelete} />
            </Modal>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalLogout}
              onRequestClose={() => setModalLogout(false)}
            >
              <LogoutModal setModalLogout={setModalLogout} />
            </Modal>
            {/* MIDDLE COLUMN */}
            <SpacerView
              flex={1}
              height="100%"
              width="75%"
              flexDirection="column"
              justifyContent="space-evenly"
            >
              <SpacerView
                backgroundColor="#FFF"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                width="100%"
                borderRadius={20}
                height="auto"
                paddingTop="2%"
                paddingBottom="2%"
              >
                <Image
                  source={texture}
                  style={{
                    width: "90%", // Cover full width
                    height: 100, // Adjust based on your texture image size
                    resizeMode: "cover",
                    borderTopLeftRadius: 20, // Ensure the top is rounded
                    borderTopRightRadius: 20,
                  }}
                />
                <Image
                  source={image}
                  style={{
                    width: 80, // Adjust size of the circular image
                    height: 80,
                    borderRadius: 40, // Make the image circular
                    position: "absolute", // Position it on top of the texture
                    top: 50, // Adjust this based on how much you want it to overlap
                    zIndex: 1, // Ensure it's above the texture
                    borderColor: "#FFF", // Add white border around the image
                    borderWidth: 3, // Adjust the thickness of the border
                    marginTop: 30,
                  }}
                />

                <ThemedText
                  lightColor="#115272"
                  darkColor="#115272"
                  type="title"
                  paddingVertical={2}
                  style={{ marginTop: 30 }}
                >
                  {" "}
                  John Doe{" "}
                </ThemedText>
              </SpacerView>

              <SpacerView height="auto" justifyContent="space-between">
                <SpacerView
                  backgroundColor="#FFF"
                  height="auto"
                  width="45%"
                  flexDirection="column"
                  justifyContent="center"
                  paddingLeft="2%"
                  paddingRight="2%"
                  paddingTop="1%"
                  paddingBottom="1%"
                  borderRadius={20}
                >
                  <SpacerView
                    borderBottomWidth={5}
                    borderBottomColor="#115272"
                    height="auto"
                    marginTop="5%"
                    marginBottom="5%"
                  >
                    <ThemedText
                      lightColor="#115272"
                      darkColor="#115272"
                      type="subtitle"
                    >
                      Personal Information
                    </ThemedText>
                  </SpacerView>

                  <SpacerView
                    flex={1}
                    justifyContent="space-between"
                    height="auto"
                  >
                    <SpacerView
                      height="auto"
                      width="45%"
                      flexDirection="column"
                    >
                      <ThemedText
                        lightColor="#115272"
                        darkColor="#115272"
                        type="subtitle"
                      >
                        {" "}
                        First Name{" "}
                      </ThemedText>
                      <ThemedInput
                        borderRadius={5}
                        backgroundColor="#FFF"
                        type="blueOutline"
                        placeholderTextColor="#115272"
                        placeholder="John" //where we put the params etc
                        editable={isEditable}
                        aria-disabled={!isEditable}
                      />
                    </SpacerView>

                    <SpacerView
                      height="auto"
                      width="45%"
                      flexDirection="column"
                    >
                      <ThemedText
                        lightColor="#115272"
                        darkColor="#115272"
                        type="subtitle"
                        paddingVertical={2}
                      >
                        {" "}
                        Last Name{" "}
                      </ThemedText>
                      <ThemedInput
                        borderRadius={5}
                        backgroundColor="#FFF"
                        type="blueOutline"
                        marginVertical="2.5%"
                        placeholderTextColor="#115272"
                        placeholder="Doe"
                        editable={isEditable}
                        aria-disabled={!isEditable}
                      />
                    </SpacerView>
                  </SpacerView>

                  <SpacerView flexDirection="column" height="auto">
                    <ThemedText
                      lightColor="#115272"
                      darkColor="#115272"
                      type="subtitle"
                    >
                      {" "}
                      Email{" "}
                    </ThemedText>
                    <ThemedInput
                      width="45%"
                      borderRadius={5}
                      backgroundColor="#FFF"
                      type="blueOutline"
                      marginVertical="2.5%"
                      placeholderTextColor="#115272"
                      placeholder="@gmail.com"
                      editable={isEditable}
                      aria-disabled={!isEditable}
                    />

                    <ThemedText
                      lightColor="#115272"
                      darkColor="#115272"
                      type="subtitle"
                    >
                      {" "}
                      Phone Number{" "}
                    </ThemedText>
                    <ThemedInput
                      width="45%"
                      borderRadius={5}
                      backgroundColor="#FFF"
                      type="blueOutline"
                      marginVertical="2.5%"
                      placeholderTextColor="#115272"
                      placeholder="+63"
                      editable={isEditable}
                      aria-disabled={!isEditable}
                      keyboardType="numeric"
                      maxLength={11}
                    />
                  </SpacerView>

                  <SpacerView
                    justifyContent="center"
                    alignItems="flex-end"
                    height="auto"
                    marginTop="5%"
                  >
                    <ThemedButton
                      width="35%"
                      title={isEditable ? "Save" : "Edit"}
                      onPress={handleEdit}
                    />
                  </SpacerView>
                </SpacerView>

                <SpacerView
                  backgroundColor="#FFF"
                  height="50%"
                  width="45%"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <SpacerView
                    borderBottomWidth={5}
                    borderBottomColor="#115272"
                    height="auto"
                    marginTop="5%"
                    width="90%"
                  >
                    <ThemedText
                      lightColor="#115272"
                      darkColor="#115272"
                      type="subtitle"
                    >
                      Account Settings
                    </ThemedText>
                  </SpacerView>

                  <SpacerView
                    flex={1}
                    flexDirection="column"
                    justifyContent="space-evenly"
                    alignItems="center"
                    height="auto"
                    width="100%"
                  >
                    <ThemedButton
                      width="35%"
                      title="Delete Account"
                      onPress={handleModalDelete}
                    />

                    <ThemedButton
                      width="35%"
                      title="Logout"
                      onPress={handleModalLogout}
                    />
                  </SpacerView>
                </SpacerView>
              </SpacerView>
            </SpacerView>
          </SpacerView>
        </ScrollView>
      </ThemedView>
    );
  }
}
