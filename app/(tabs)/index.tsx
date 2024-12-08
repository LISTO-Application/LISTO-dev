import { useSession } from "@/auth";
import { onAuthStateChanged } from "firebase/auth";
import { firebase } from "@react-native-firebase/firestore";
import { Redirect, router } from "expo-router";
import { SetStateAction, useEffect, useState } from "react";
import { Platform } from "react-native";
import { authWeb } from "../(auth)";

export default function Index() {
  if (Platform.OS === "web") {
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(authWeb, (user) => {
        if (user) {
          router.replace("../(tabs)");
          console.log(user);
        } else {
          router.replace("/login");
        }
      });

      return () => unsubscribe(); // Clean up listener
    }, []);
  } else if (Platform.OS === "android") {
    const auth = useSession();
    const session = firebase.auth().currentUser;

    if (session != null) {
      return <Redirect href="/(tabs)" />;
    } else {
      return <Redirect href="/login" />;
    }
  }

  return null; // Nothing to render
}
