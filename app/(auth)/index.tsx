import { useSession } from "@/auth";
import { Redirect, router } from "expo-router";
import { SetStateAction, useEffect, useState } from "react";

import * as Firebase from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Platform } from "react-native";
import { firebase } from "@react-native-firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAzZ7B0faWwYTNHO3swEUErpD5UaWnMYGo",
  authDomain: "listo-dev-18c26.firebaseapp.com",
  projectId: "listo-dev-18c26",
  storageBucket: "listo-dev-18c26.appspot.com",
  messagingSenderId: "1019470933970",
  appId: "1:1019470933970:android:2ef6f747ad244c2607a20b",
  measurementId: "G-NE9YEPY24Z",
  databaseURL: "",
};

const app = initializeApp(firebaseConfig);
const authWeb = getAuth(app);
const functionWeb = getFunctions(app, "asia-east1");
const dbWeb = getFirestore(app);
const strWeb = getStorage(app);
export { authWeb, app, dbWeb, functionWeb, strWeb };

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
