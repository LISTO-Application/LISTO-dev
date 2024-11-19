import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "@/styles/styles"; // Adjust the path if necessary
import { router } from "expo-router";
import { SpacerView } from "@/components/SpacerView"; // Adjust the path if necessary
import { useLocalSearchParams } from "expo-router"; // Ensure you have expo-router installed
import { webstyles } from "@/styles/webstyles"; // For web styles

export default function ReportDetails({ navigation }: { navigation: any }) {
  const { id } = useLocalSearchParams(); // Get the report ID from the URL
  const [report, setReport] = useState<any>(null);

  // Example report data (this should come from your data source, such as an API or state)
  const reportData = [
    {
      id: "1",
      title: "Violent Activity near 6th street",
      location: "6th Street",
      additionalInfo: "Heard shouting and yelling.",
      crimeType: "Assault",
    },
    {
      id: "2",
      title: "Theft near 6th street",
      location: "6th Street",
      additionalInfo: "Someone stole my bike.",
      crimeType: "Theft",
    },
  ];

  useEffect(() => {
    // Find the report data based on the ID
    const foundReport = reportData.find((r) => r.id === id);
    if (foundReport) {
      setReport(foundReport);
    }
  }, [id]);

  if (!report) {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.headerText}>Report Not Found</Text>
      </View>
    );
  }

  const { title, crimeType, location, additionalInfo } = report;

  if (Platform.OS === "android" || Platform.OS === "ios") {
    return (
      <View style={styles.mainContainer}>
        {/* Blue Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backIcon}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Report Details</Text>
          <SpacerView height={120} />
        </View>

        <ScrollView style={styles.formContainer}>
          <Text style={styles.reportTitle}>{title}</Text>

          <View style={webstyles.detailItem}>
            <Text style={webstyles.detailLabel}>Crime Type:</Text>
            <Text style={webstyles.detailValue}>{crimeType}</Text>
          </View>

          <View style={webstyles.detailItem}>
            <Text style={webstyles.detailLabel}>Location:</Text>
            <Text style={webstyles.detailValue}>{location}</Text>
          </View>

          <View style={webstyles.detailItem}>
            <Text style={webstyles.detailLabel}>Additional Information:</Text>
            <Text style={webstyles.detailValue}>{additionalInfo}</Text>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else if (Platform.OS === "web") {
    return (
      <View style={webstyles.container}>
        <View style={webstyles.mainContainer}>
          <Text style={webstyles.headerText}>Report Details</Text>

          <ScrollView contentContainerStyle={webstyles.reportList}>
            <View style={webstyles.detailItem}>
              <Text style={webstyles.detailLabel}>Crime Type:</Text>
              <Text style={webstyles.detailValue}>{crimeType}</Text>
            </View>

            <View style={webstyles.detailItem}>
              <Text style={webstyles.detailLabel}>Location:</Text>
              <Text style={webstyles.detailValue}>{location}</Text>
            </View>

            <View style={webstyles.detailItem}>
              <Text style={webstyles.detailLabel}>Additional Information:</Text>
              <Text style={webstyles.detailValue}>{additionalInfo}</Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={webstyles.button}
            onPress={() => router.back()}
          >
            <Text style={webstyles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
