import { View, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";

interface DropdownItem {
  label: string;
  value: string | number;
}

interface ThemedDropdownProps {
  data: DropdownItem[];
  placeholder?: string;
  onSelect?: (item: DropdownItem) => void;
  theme?: {
    container?: object;
    dropdown?: object;
    placeholderStyle?: object;
    selectedTextStyle?: object;
    inputSearchStyle?: object;
    iconStyle?: object;
    selectedText?: object;
  };
}

const ThemedDropdown = ({ data, placeholder, onSelect, theme }) => {
  const [value, setValue] = useState<string | number | null>(null);

  const handleSelect = (item: {
    value: React.SetStateAction<string | number | null>;
  }) => {
    setValue(item.value);
    if (onSelect) onSelect(item);
  };

  return (
    <View style={[styles.container, theme?.container]}>
      <Dropdown
        style={[styles.dropdown, theme?.dropdown]}
        placeholderStyle={[styles.placeholderStyle, theme?.placeholderStyle]}
        selectedTextStyle={[styles.selectedTextStyle, theme?.selectedTextStyle]}
        inputSearchStyle={[styles.inputSearchStyle, theme?.inputSearchStyle]}
        iconStyle={[styles.iconStyle, theme?.iconStyle]}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder || "Select item"}
        value={value}
        onChange={handleSelect}
      />
      {value && (
        <Text style={[styles.selectedText, theme?.selectedText]}>
          Selected: {value}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  selectedText: {
    marginTop: 10,
    fontSize: 16,
    color: "blue",
  },
});

export default ThemedDropdown;
