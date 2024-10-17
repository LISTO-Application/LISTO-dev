import { MaterialIcons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { TouchableOpacity, View, StyleSheet } from "react-native";

type DrawerParamList = {
  emergency: undefined;
  index: undefined;
  "[id]": undefined;
  Custom: undefined;
};

type CustomNavigatorProps = {
  navigation: DrawerNavigationProp<DrawerParamList>;
};

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
});

export default MyHeader;
