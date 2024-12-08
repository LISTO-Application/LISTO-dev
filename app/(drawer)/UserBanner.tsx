import {
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { router } from "expo-router";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Text,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { onAuthStateChanged } from "firebase/auth";
import { authWeb } from "../(auth)";

interface UserBannerProps extends DrawerContentComponentProps {}

const UserBanner: React.FC<UserBannerProps> = (props) => {
  const id = "John Doe";
  const image = require("../../assets/images/texture.svg");
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("UserBanner must be within an AuthProvider");
  }
  const { setIsLoggedIn } = authContext;

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(authWeb, (user) => {
      if (user) {
        setIsLoggedIn(true); // Update context to reflect logged-in state
      } else {
        setIsLoggedIn(false); // Update context to reflect logged-out state
        router.replace("/login"); // Redirect to login page
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [setIsLoggedIn, router]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <SafeAreaView>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={layoutStyles.image}
      >
        {" "}
        <View style={layoutStyles.drawer}>
          <TouchableOpacity onPress={() => router.push(`/${id}`)}>
            <Image source={require("../../assets/images/user-icon.png")} />
            <ThemedText>{id}</ThemedText>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <DrawerItemList {...props} />

      <View style={layoutStyles.logoutContainer}>
        <TouchableOpacity
          onPress={handleLogout}
          style={layoutStyles.logoutButton}
        >
          <Text style={layoutStyles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const layoutStyles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
    height: 200,
    width: "100%",
  },
  drawer: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#f4f4f4",
    borderBottomWidth: 1,
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  logoutButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UserBanner;
