import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import MyHeader from "./MyHeader";
import { Ionicons } from "@expo/vector-icons";

const DrawerScreenOptions = ({
  route,
  navigation,
}: {
  navigation: any;
  route: any;
}) => {
  return {
    drawerIcon: ({
      color,
      focused,
      size,
    }: {
      color: string;
      focused: boolean;
      size: number;
    }) => {
      let iconName;
      if (route.name === "Crimemap") {
        iconName = focused ? "megaphone" : "megaphone-outline";
      } else if (route.name === "Emergency") {
        iconName = focused ? "call" : "call-outline";
      } else if (route.name === "Account") {
        iconName = focused ? "person" : "person-outline";
      } else if (route.name === "ViewReports") {
        iconName = focused ? "ticket" : "ticket-outline";
      } else if (route.name === "Validate") {
        iconName = focused ? "bag-check" : "bag-check-outline";
      }
      return <Ionicons name={iconName} size={size} color={color} />;
    },
    headerShown: !["Reports", "Validate"].includes(route.name),
    header: () => <MyHeader navigation={navigation} />,
    drawerStyle: {
      backgroundColor: "#f0f0f0",
      width: "20%",
      shadowColor: "#333333",
      shadowOffset: {
        width: 5,
        height: 5,
      },
      shadowRadius: 5,
      shadowOpacity: 0.5,
    },
    headerTintColor: "#fff",
    headerStyle: {
      backgroundColor: "#6200EE",
    },
    headerTransparent: true,
  };
};

export default DrawerScreenOptions;
