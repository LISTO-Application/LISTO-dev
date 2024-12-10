import { Ionicons } from "@expo/vector-icons";

export const getIconName = (route: string, focused: boolean): string => {
  switch (route) {
    case "crimemap":
      return focused ? "megaphone" : "megaphone-outline";
    case "emergency":
      return focused ? "call" : "call-outline";
    case "account":
      return focused ? "person" : "person-outline";
    case "viewReports":
      return focused ? "ticket" : "ticket-outline";
    case "validateReports":
      return focused ? "bag-check" : "bag-check-outline";
    case "ViewAdminEmergencyList":
      return focused ? "bag-check" : "bag-check-outline";
    default:
      return "help-circle-outline";
  }
};
