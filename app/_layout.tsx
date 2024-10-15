// React Imports
import { useEffect, useState } from "react";
import "react-native-reanimated";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Expo Imports
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

//Portal Imports
import { PortalProvider } from "@gorhom/portal";

//Hooks
import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const isLoggedIn = true; // Replace with actual login state

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  console.log(
    "Rendering Stack with initialRouteName:",
    isLoggedIn ? "(tabs)" : "index"
  );

  return (
    <GestureHandlerRootView>
      <PortalProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack initialRouteName={isLoggedIn ? "(tabs)" : "index"}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="forgot" options={{ headerShown: false }} />
            <Stack.Screen name="emergency" options={{ headerShown: false }} />
            <Stack.Screen name="otp" options={{ headerShown: false }} />
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
            <Stack.Screen name="changepass" options={{ headerShown: false }} />
            <Stack.Screen name="adminLogin" options={{ headerShown: false }} />
            <Stack.Screen
              name="changeUserInformation"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="changeAdminInformation"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="viewReports" options={{ headerShown: false }} />
            <Stack.Screen name="editReport" options={{ headerShown: false }} />
            <Stack.Screen
              name="newReportsForm"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="validateReports"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
}
