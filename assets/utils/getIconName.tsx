import { Ionicons } from "@expo/vector-icons";

export const getIconName = (route: string, focused: boolean): string => {
  switch (route) {
    case "Report Incident":
      return focused ? "megaphone" : "megaphone-outline";
    case "Emergency":
      return focused ? "call" : "call-outline";
    case "Account":
      return focused ? "person" : "person-outline";
    case "Reports":
      return focused ? "ticket" : "ticket-outline";
    case "Validate":
      return focused ? "bag-check" : "bag-check-outline";
    default:
      return "help-circle-outline";
  }
};
