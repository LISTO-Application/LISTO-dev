import { Ionicons } from "@expo/vector-icons";
import { addMonths, format, subMonths } from "date-fns";
import { useState } from "react";
import {
  Pressable,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Button,
} from "react-native";

//Date
const DateDisplay = ({ setToggleModal }: { setToggleModal: any }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const handlePrevMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };
  const currentDate = format(selectedDate, "MMMM yyyy");

  return (
    <View style={style.dateButton}>
      <View style={style.container}>
        <TouchableOpacity onPress={handlePrevMonth} style={style.arrows}>
          <Ionicons name={"chevron-back-outline"} size={24} color="#115272" />
        </TouchableOpacity>
        <Pressable
          style={style.dateContainer}
          onPress={() => setToggleModal(true)}
        >
          <Text style={style.dateText}>{currentDate}</Text>
        </Pressable>
        <TouchableOpacity onPress={handleNextMonth} style={style.arrows}>
          <Ionicons
            name={"chevron-forward-outline"}
            size={24}
            color="#115272"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  dateContainer: {
    width: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#115272",
    fontWeight: "bold",
  },
  dateButton: {
    position: "absolute",
    bottom: 100,
    borderWidth: 3,
    padding: 0,
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "white",
  },
  arrows: {
    alignSelf: "flex-end",
    borderWidth: 2,
    padding: 1,
    borderRadius: 30,
  },
});

export default DateDisplay;
