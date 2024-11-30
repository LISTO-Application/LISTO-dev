import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import ClearFilter from "./ClearFilter";

export default function SearchSort({
  reports,
  setCategoryModalVisible,
  setFilteredReports,
  isAlignedRight,
  filterReports,
}: {
  reports: any;
  setCategoryModalVisible: any;
  setFilteredReports: any;
  isAlignedRight: any;
  filterReports: any;
}) {
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // State for selected category filter
  const [currentStatusSort, setCurrentStatusSort] = useState<
    "PENDING" | "VALID" | "PENALIZED"
  >("PENDING");
  // Handle search query change
  const handleSearch = (query: string) => {
    setSearchQuery(query); // Update search query state
    filterReports(query, selectedCategory); // Re-filter reports based on query and selected category
  };
  // Clear category filter
  const handleClearFilter = () => {
    setSearchQuery(""); // Clear search query
    setSelectedCategory(null); // Clear selected category
    setFilteredReports(reports); // Show all reports again
  };

  // Sort reports by date (ascending/descending)
  const sortReportsByDateAsc = () => {
    setFilteredReports((prevReports: any) => {
      const sortedReports = [...prevReports];
      sortedReports.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
      return sortedReports;
    });
    setIsSortedAsc((prev) => !prev); // Toggle sorting order
  };

  const sortReportsByDateDesc = () => {
    setFilteredReports((prevReports: any) => {
      const sortedReports = [...prevReports];
      sortedReports.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      return sortedReports;
    });
    setIsSortedAsc((prev) => !prev); // Toggle sorting order
  };

  // Sort reports alphabetically by title
  const sortReportsByAlphabetAsc = () => {
    setFilteredReports((prevReports: any) => {
      const sortedReports = [...prevReports].sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      return sortedReports;
    });
  };

  // Sort reports alphabetically by title
  const sortReportsByAlphabetDesc = () => {
    setFilteredReports((prevReports: any) => {
      const sortedReports = [...prevReports].sort((a, b) => {
        return b.title.localeCompare(a.title);
      });
      return sortedReports;
    });
  };

  const sortReportsByStatus = () => {
    // Cycle through status types
    const nextStatus =
      currentStatusSort === "PENDING"
        ? "VALID"
        : currentStatusSort === "VALID"
          ? "PENALIZED"
          : "PENDING";

    setCurrentStatusSort(nextStatus); // Update the state to the next status

    // Sort the reports based on the new status
    setFilteredReports((prevReports: any) => {
      const sortedReports = [...prevReports].sort((a, b) => {
        const statusOrder = ["PENDING", "VALID", "PENALIZED"];
        // Sort reports by the status order
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      });
      return sortedReports;
    });
  };

  //DropDown Sorter
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Sort by Date (Earliest)", value: "date-asc" },
    { label: "Sort by Date (Latest)", value: "date-desc" },
    { label: "Sort by Alphabet (A-Z)", value: "alphabet-asc" },
    { label: "Sort by Alphabet (Z-A)", value: "alphabet-desc" },
    { label: "Sort by Crime Category", value: "category" },
    { label: "Sort by Status", value: "status" },
  ]);

  const handleDropDownChange = (selectedValue: any) => {
    switch (selectedValue) {
      case "date-asc":
        sortReportsByDateAsc();
        break;
      case "date-desc":
        sortReportsByDateDesc();
        break;
      case "alphabet-asc":
        sortReportsByAlphabetAsc();
        break;
      case "alphabet-desc":
        sortReportsByAlphabetDesc();
        break;
      case "status":
        sortReportsByStatus(); // Call the sort function when "Sort by Status" is selected
        break;
      case "category":
        setCategoryModalVisible(true); // Show category modal
        break;
      default:
        break;
    }
    console.log(selectedValue);
  };

  return (
    <View
      style={[
        {
          zIndex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
        },
      ]}
    >
      <View style={{ flexDirection: "row" }}>
        <TextInput
          placeholder="Search reports..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={{
            width: 200,
            borderWidth: 1,
            borderColor: "#000",
            borderRadius: 8,
            padding: 8,
          }}
        />
        <View style={{ alignSelf: "center", left: -40 }}>
          <Ionicons name={"search-outline"} size={24} />
        </View>
      </View>
      <View
        style={[
          {
            alignSelf: "flex-end",
            paddingRight: 40,
            width: "25%",
            flexDirection: "row",
            gap: 20,
          },
          isAlignedRight && {
            left: -450,
          },
        ]}
      >
        <ClearFilter handleClearFilter={handleClearFilter} />
        <View style={{ width: "75%" }}>
          <DropDownPicker
            multiple={false}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setItems={setItems}
            setValue={setValue}
            onChangeValue={handleDropDownChange}
            placeholder="Select a filter"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
