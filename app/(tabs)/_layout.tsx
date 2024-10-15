//React Imports
import React, { useContext, useEffect } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";

//Expo Imports
import {
  useRouter,
  Tabs,
  useFocusEffect,
  useNavigation,
  router,
} from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";
//Component Imports
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { TabBar } from "@/components/navigation/TabBar";
import { ThemedText } from "@/components/ThemedText";

import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerItemList,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import { NavigationContainer, RouteProp } from "@react-navigation/native";

//Hooks
import { useColorScheme } from "@/hooks/useColorScheme";
import Emergency from "./emergency";
import CrimeMap from ".";
import UserAccount from "./[id]";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ViewReports from "../viewReports";
import ValidateReports from "../validateReports";
import Login from "..";
import { AuthContext, AuthProvider } from "../AuthContext";

const report = require("../../assets/images/report-icon.png");

type DrawerParamList = {
  emergency: undefined;
  index: undefined;
  "[id]": undefined;
  Custom: undefined;
};

type CustomNavigatorProps = {
  navigation: DrawerNavigationProp<DrawerParamList>;
};
interface UserBannerProps extends DrawerContentComponentProps {}

const MyHeader: React.FC<CustomNavigatorProps> = ({ navigation }) => {
  return (
    <View
      style={{
        flex: 1,
        width: 100,
        justifyContent: "center",
        padding: 16,
      }}
    >
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <MaterialIcons
          name="menu"
          size={30}
          color="#115272"
          style={layoutStyles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};
const UserBanner: React.FC<UserBannerProps> = (props) => {
  const id = "John Doe";
  const image = require("../../assets/images/texture.svg");
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("UserBanner must be within an AuthProvider");
  }
  const { setIsLoggedIn } = authContext;

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.replace("/");
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

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const isLoggedIn = true;
  const Drawer = createDrawerNavigator();

  if (isLoggedIn && Platform.OS === "web") {
    return (
      <AuthProvider>
        <NavigationContainer independent={true}>
          <Drawer.Navigator
            initialRouteName="Report Incident"
            screenOptions={({ navigation }) => ({
              headerShown: true,
              header: () => <MyHeader navigation={navigation} />,
              drawerStyle: {
                backgroundColor: "#f0f0f0", // Change drawer background color
                width: 600, // Change drawer width
              },
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#6200EE",
              },
              headerTransparent: true,
            })}
            drawerContent={(props) => {
              return <UserBanner {...props} />;
            }}
          >
            <Drawer.Screen name="Emergency" component={Emergency} />
            <Drawer.Screen name="Report Incident" component={CrimeMap} />
            <Drawer.Screen name="Account" component={UserAccount} />
            <Drawer.Screen name="View Reports" component={ViewReports} />
            <Drawer.Screen
              name="Validate Reports"
              component={ValidateReports}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </AuthProvider>
    );
  } else if (isLoggedIn && Platform.OS === "android") {
    return (
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen
          name="emergency"
          options={{
            tabBarShowLabel: false,
            title: "Emergency",
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            tabBarShowLabel: false,
            title: "Crime Map",
          }}
        />
        <Tabs.Screen
          name="report"
          options={{
            tabBarShowLabel: false,
            title: "Report",
          }}
        />

        <Tabs.Screen
          name="[id]"
          options={{
            tabBarShowLabel: false,
            title: "Account",
          }}
        />
      </Tabs>
    );
  } else {
    console.log("User is not logged in");
    router.replace({
      pathname: "/",
    });
  }
}

const layoutStyles = StyleSheet.create({
  icon: {
    borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 2,
    width: 35,
    height: 35,
    borderColor: "#115272",
    backgroundColor: "white",
  },
  drawer: {
    height: 200,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#f4f4f4",
    borderBottomWidth: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    height: 200,
    width: "100%",
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
