import {
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React from "react";
import { getIconName } from "@/assets/utils/getIconName";
import { webstyles } from "@/styles/webstyles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export const SideBar = ({
  sideBarPosition,
  navigation,
}: {
  sideBarPosition: any;
  navigation: any;
}) => {
  //Assets
  const id = "John Doe";
  const image = require("../assets/images/texture.svg");
  const handleLogout = () => {
    router.push("/");
  };

  //Icon assets
  const menuItems = [
    { name: "Emergency Dial", route: "Emergency" },
    { name: "Report Incident", route: "Report Incident" },
    { name: "Account", route: "Account" },
    { name: "View Reports", route: "ViewReports" },
    { name: "Validate Tickets", route: "Validate" },
    { name: "View Admin Emergency List", route: "ViewAdminEmergencyList" },
  ];

  return (
    <Animated.View
      style={[
        webstyles.sidebar,
        { transform: [{ translateX: sideBarPosition }] },
      ]}
    >
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={webstyles.userSection}
      >
        <TouchableOpacity onPress={() => router.push(`/${id}`)}>
          <Image
            source={require("../assets/images/user-icon.png")}
            style={webstyles.userImage}
          />
          <Text style={webstyles.userName}>{id}</Text>
        </TouchableOpacity>
      </ImageBackground>
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          paddingTop: 30,
        }}
      >
        <Text style={webstyles.sidebarTitle}>Admin</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={webstyles.sidebarItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={{ flex: 1, flexDirection: "row", gap: 20 }}>
              <Ionicons
                name={getIconName(item.route, false)}
                size={24}
                color={"#333"}
              />
              <Text style={[webstyles.sidebarText]}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={webstyles.logoutContainer}>
          <TouchableOpacity
            onPress={handleLogout}
            style={webstyles.logoutButton}
          >
            <Text style={webstyles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default SideBar;

const styles = StyleSheet.create({});
