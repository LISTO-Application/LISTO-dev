import { View, Pressable, Image, Text } from "react-native";

const FilterWebModal = ({
  isFilterModalVisible,
  setIsFilterModalVisible,
  toggleButton,
  activeButtonIndexes,
}: {
  isFilterModalVisible: boolean;
  setIsFilterModalVisible: (visible: boolean) => void;
  toggleButton: any;
  activeButtonIndexes: any;
}) => {
  const images = [
    { source: require("../../assets/images/knife-icon.png"), label: "Murder" },
    {
      source: require("../../assets/images/homicide-icon.png"),
      label: "Homicide",
    },
    { source: require("../../assets/images/thief-icon.png"), label: "Theft" },
    {
      source: require("../../assets/images/car-icon.png"),
      label: "Carnapping",
    },
    { source: require("../../assets/images/injury-icon.png"), label: "Injury" },
    {
      source: require("../../assets/images/robbery-icon.png"),
      label: "Robbery",
    },
    { source: require("../../assets/images/rape-icon.png"), label: "Rape" },
  ];

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <View
        style={{
          width: "50%",
          padding: 20,
          backgroundColor: "white",
          borderRadius: 10,
          height: "30%",
        }}
      >
        <Text
          style={{
            color: "#115272",
            fontSize: 24, // Increase the font size for better visibility
            fontWeight: "bold", // Optional: make the text bold for emphasis
            textAlign: "center", // Center the text horizontally
            marginBottom: 20, // Add some space below the text
          }}
        >
          Choose your filter
        </Text>

        {/* Render the images as toggleable buttons */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          {images.map((image, index) => (
            <Pressable
              key={index}
              onPress={() => toggleButton(index)} // Toggle this button's active state
              style={{
                alignItems: "center",
                borderStyle: "solid",
                borderColor: "#115272",
                borderWidth: 2,
                margin: 10,
                backgroundColor: activeButtonIndexes.includes(index)
                  ? "#E63B36"
                  : "#E07875", // Change color based on active status
                width: 85,
                height: 85,
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Image
                source={image.source}
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: "contain",
                }}
              />
            </Pressable>
          ))}
        </View>

        {/* Centered close button */}
        <Pressable
          onPress={() => setIsFilterModalVisible(false)}
          style={{
            marginTop: 20,
            alignSelf: "center",
            backgroundColor: "#115272",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 25,
          }}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default FilterWebModal;
