//React Imports
import {
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMemo, useCallback, useRef, useState } from "react";

//Expo Imports
import { router, useFocusEffect } from "expo-router";

//Stylesheet Imports
import { styles } from "@/styles/styles";
import { utility } from "@/styles/utility";

//Component Imports
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedText } from "@/components/ThemedText";
import { SpacerView } from "@/components/SpacerView";
import { ThemedButton } from "@/components/ThemedButton";

//Portal Imports
import { Portal } from "@gorhom/portal";

//Bottom Sheet Import
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

const qcLogo = require("../../assets/images/qc-logo.png");
const holyspiritLogo = require("../../assets/images/holyspirit-logo.png");
const balaraLogo = require("../../assets/images/balara-logo.png");

export default function Emergency() {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["3%", "25%"], []);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // callbacks
  const handleSheetChange = useCallback((index: any) => {
    setIsBottomSheetOpen(index !== -1);
  }, []);

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => sheetRef.current?.close();
    }, [])
  );

  //useStates

  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    setIsPressed((prev) => !prev);
  };

  if (Platform.OS === "android") {
    return (
      <GestureHandlerRootView>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={[styles.mainContainer, utility.redBackground]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <SpacerView height={80} />
          <KeyboardAvoidingView
            behavior="height"
            keyboardVerticalOffset={0}
            style={[styles.container, utility.redBackground]}
          >
            <ThemedText lightColor="#FFF" darkColor="#FFF" type="subDisplay">
              Send a distress message
            </ThemedText>
            <ThemedText
              style={{ marginBottom: "2.5%" }}
              lightColor="#FFF"
              darkColor="#FFF"
              type="subtitle"
            >
              Send to
            </ThemedText>

            <SpacerView height="5%" marginBottom="5%">
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                overScrollMode="always"
              >
                <ThemedButton
                  title="Holy Spirit"
                  width="50%"
                  height="100%"
                  paddingHorizontal={25}
                  marginHorizontal="2.5%"
                  type="white-outline"
                  onPress={() => {
                    router.replace({
                      pathname: "/(tabs)",
                    });
                  }}
                />

                <ThemedButton
                  title="Matandang Balara"
                  width="50%"
                  height="100%"
                  paddingHorizontal={25}
                  marginHorizontal="2.5%"
                  type="white-outline"
                  onPress={() => {
                    router.replace({
                      pathname: "/(tabs)",
                    });
                  }}
                />

                <SpacerView width={160} height="auto"></SpacerView>
              </ScrollView>
            </SpacerView>
            <ThemedText
              style={{ marginBottom: "2.5%" }}
              lightColor="#FFF"
              darkColor="#FFF"
              type="subtitle"
            >
              Emergency Type
            </ThemedText>
            <SpacerView height="5%" marginBottom="5%">
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                scrollToOverflowEnabled={true}
              >
                <ThemedButton
                  title="Violent Crime"
                  width="33%"
                  marginHorizontal={5}
                  paddingHorizontal={25}
                  height="100%"
                  type="white-outline"
                  onPress={() => {
                    router.replace({
                      pathname: "/(tabs)",
                    });
                  }}
                />

                <ThemedButton
                  title="Active Fire"
                  width="33%"
                  marginHorizontal={5}
                  paddingHorizontal={25}
                  height="100%"
                  type="white-outline"
                  onPress={() => {
                    router.replace({
                      pathname: "/(tabs)",
                    });
                  }}
                />

                <ThemedButton
                  title="Serious Injury"
                  width="33%"
                  marginHorizontal={5}
                  paddingHorizontal={25}
                  height="100%"
                  type="white-outline"
                  onPress={() => {
                    router.replace({
                      pathname: "/(tabs)",
                    });
                  }}
                />

                <SpacerView width={120} height="auto"></SpacerView>
              </ScrollView>
            </SpacerView>
            <ThemedText lightColor="#FFF" darkColor="#FFF" type="subtitle">
              Additional Information
            </ThemedText>
            <ThemedInput
              marginTop={10}
              borderRadius={15}
              height={100}
              placeholder="Additional Information"
              textAlign="left"
              textAlignVertical="top"
              placeholderTextColor="#EDA5A3"
            />
            <SpacerView height={20} />
            <SpacerView
              flexDirection="column"
              justifyContent="space-evenly"
              alignItems="center"
              height="auto"
            >
              <ThemedButton
                title="Submit"
                width="50%"
                height="auto"
                type="blue"
                paddingVertical="2.5%"
                onPress={() => {
                  router.replace({
                    pathname: "/",
                  });
                }}
              />

              {!isBottomSheetOpen && (
                <ThemedButton
                  title="Speed Dial"
                  width="50%"
                  height="auto"
                  type="blue"
                  marginVertical="2.5%"
                  paddingVertical="2.5%"
                  onPress={() => handleSnapPress(1)}
                />
              )}

              {isBottomSheetOpen && (
                <ThemedButton
                  title="Close"
                  width="50%"
                  height="auto"
                  type="blue"
                  marginVertical="2.5%"
                  paddingVertical="2.5%"
                  onPress={() => handleClosePress()}
                />
              )}
            </SpacerView>
          </KeyboardAvoidingView>
        </ScrollView>
        <Portal>
          <BottomSheet
            ref={sheetRef}
            index={-1}
            snapPoints={snapPoints}
            onChange={handleSheetChange}
            backgroundStyle={{ backgroundColor: "#115272" }}
            handleIndicatorStyle={{ backgroundColor: "#FFF", width: "40%" }}
            enablePanDownToClose={true}
          >
            <BottomSheetScrollView
              style={{ height: "auto", backgroundColor: "#115272" }}
              horizontal={true}
              contentContainerStyle={{ alignItems: "center", width: "auto" }}
            >
              <SpacerView
                width="33%"
                height="auto"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                marginLeft="1.5%"
                marginRight="1.5%"
                backgroundColor="#115272"
                paddingLeft="2.5%"
                paddingRight="2.5%"
              >
                <SpacerView
                  width="auto"
                  height="auto"
                  backgroundColor="#FFF"
                  justifyContent="center"
                  padding="10%"
                  borderRadius={10}
                >
                  <Image source={qcLogo} />
                </SpacerView>
                <SpacerView
                  width="auto"
                  height="auto"
                  justifyContent="center"
                  marginTop="1%"
                >
                  <ThemedText
                    lightColor="#FFF"
                    darkColor="#FFF"
                    type="subtitle"
                  >
                    QC Hotline
                  </ThemedText>
                </SpacerView>
              </SpacerView>

              <SpacerView
                width="33%"
                height="auto"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                marginLeft="1.5%"
                marginRight="1.5%"
                backgroundColor="#115272"
                paddingLeft="2.5%"
                paddingRight="2.5%"
              >
                <SpacerView
                  width="auto"
                  height="auto"
                  backgroundColor="#FFF"
                  justifyContent="center"
                  padding="10%"
                  borderRadius={10}
                >
                  <Image source={holyspiritLogo} />
                </SpacerView>
                <SpacerView
                  width="auto"
                  height="auto"
                  justifyContent="center"
                  marginTop="1%"
                >
                  <ThemedText
                    lightColor="#FFF"
                    darkColor="#FFF"
                    type="subtitle"
                  >
                    Holy Spirit
                  </ThemedText>
                </SpacerView>
              </SpacerView>

              <SpacerView
                width="33%"
                height="auto"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                marginLeft="1.5%"
                marginRight="1.5%"
                backgroundColor="#115272"
                paddingLeft="2.5%"
                paddingRight="2.5%"
              >
                <SpacerView
                  width="auto"
                  height="auto"
                  backgroundColor="#FFF"
                  justifyContent="center"
                  padding="10%"
                  borderRadius={10}
                >
                  <Image source={balaraLogo} />
                </SpacerView>
                <SpacerView
                  width="auto"
                  height="auto"
                  justifyContent="center"
                  marginTop="1%"
                >
                  <ThemedText
                    lightColor="#FFF"
                    darkColor="#FFF"
                    type="subtitle"
                  >
                    Old Balara
                  </ThemedText>
                </SpacerView>
              </SpacerView>

              <SpacerView width={160} height="auto"></SpacerView>
            </BottomSheetScrollView>
          </BottomSheet>
        </Portal>
      </GestureHandlerRootView>
    );
  } else if (Platform.OS === "web") {
    return (
      <SpacerView
        width="100%"
        height="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        style={[utility.blueBackground, { margin: 20 }]}
      >
        <SpacerView height="10%" />
        <SpacerView
          backgroundColor="#DA4B46"
          height="90%"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          style={[utility.redBackground, style.shadowBox, { borderRadius: 20 }]}
        >
          <SpacerView height="auto" width="40%" justifyContent="center">
            <ThemedText
              lightColor="#FFF"
              darkColor="#FFF"
              type="display"
              textAlign="center"
            >
              Send a distress message
            </ThemedText>
          </SpacerView>

          <SpacerView
            justifyContent="flex-start"
            width="50%"
            height="auto"
            marginBottom="1%"
          >
            <ThemedText
              style={{ marginBottom: "2.5%" }}
              lightColor="#FFF"
              darkColor="#FFF"
              type="title"
            >
              Send to
            </ThemedText>
          </SpacerView>

          <SpacerView
            width="50%"
            height="auto"
            justifyContent="space-evenly"
            marginBottom="5%"
          >
            <ThemedButton
              title="Holy Spirit"
              width="50%"
              height="100%"
              paddingHorizontal="5%"
              paddingVertical="0.5%"
              type={isPressed ? "red" : "white-outline"}
              onPress={handlePress}
            />
            <ThemedButton
              title="Matandang Balara"
              width="50%"
              height="100%"
              paddingHorizontal="5%"
              paddingVertical="0.5%"
              type={isPressed ? "red" : "white-outline"}
              onPress={handlePress}
            />
          </SpacerView>

          <SpacerView
            justifyContent="flex-start"
            width="50%"
            height="auto"
            marginBottom="1%"
          >
            <ThemedText
              style={{ marginBottom: "2.5%" }}
              lightColor="#FFF"
              darkColor="#FFF"
              type="title"
            >
              Emergency Type
            </ThemedText>
          </SpacerView>

          <SpacerView
            width="50%"
            height="auto"
            justifyContent="space-evenly"
            marginBottom="5%"
          >
            <ThemedButton
              title="Violent Crime"
              width="33%"
              height="100%"
              paddingHorizontal="5%"
              paddingVertical="0.5%"
              type={isPressed ? "red" : "white-outline"}
              onPress={handlePress}
            />
            <ThemedButton
              title="Active Fire"
              width="33%"
              height="100%"
              paddingHorizontal="5%"
              paddingVertical="0.5%"
              type={isPressed ? "red" : "white-outline"}
              onPress={handlePress}
            />
            <ThemedButton
              title="Serious Injury"
              width="33%"
              height="100%"
              paddingHorizontal="5%"
              paddingVertical="0.5%"
              type={isPressed ? "red" : "white-outline"}
              onPress={handlePress}
            />
          </SpacerView>

          <SpacerView height="auto" flexDirection="column" width="50%">
            <ThemedText lightColor="#FFF" darkColor="#FFF" type="title">
              Location
            </ThemedText>
            <ThemedInput
              width="100%"
              height="100%"
              borderRadius={15}
              placeholder="Location"
              textAlign="left"
              textAlignVertical="top"
              placeholderTextColor="#EDA5A3"
            />
          </SpacerView>

          <SpacerView height="auto" flexDirection="column" width="50%">
            <ThemedText lightColor="#FFF" darkColor="#FFF" type="title">
              Additional Information
            </ThemedText>
            <ThemedInput
              width="100%"
              height={150}
              borderRadius={15}
              placeholder="Additional Information"
              textAlign="center"
              textAlignVertical="top"
              placeholderTextColor="#EDA5A3"
            />
          </SpacerView>

          <SpacerView
            width="25%"
            height="auto"
            justifyContent="center"
            flexDirection="column"
          >
            <ThemedButton
              title="Submit"
              width="auto"
              height="auto"
              paddingVertical="2.5%"
              type="blue"
              onPress={() => {
                router.replace({
                  pathname: "/(tabs)",
                });
              }}
            />
            <SpacerView height="5%" />
          </SpacerView>
        </SpacerView>
        <SpacerView height="10%" />
      </SpacerView>
    );
  }
}

const style = StyleSheet.create({
  //GENERAL STYLES
  container: {
    flex: 1,
    paddingTop: 200,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    backgroundColor: "white",
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

  //DISTRESS MESSAGE STYLES
  scrollViewItem: {
    width: "auto",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    marginHorizontal: 5,
    borderWidth: 3,
    borderRadius: 50,
  },
  scrollViewText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  //BOTTOM SHEET STYLES
  bottomSheet: {
    position: "absolute",
    bottom: 0,
  },
  bottomSheetItem: {
    width: 100,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
  },
  bottomSheetImageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderRadius: 100,
    borderColor: "#FFF",
  },
});
