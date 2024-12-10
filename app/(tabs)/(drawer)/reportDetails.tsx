import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";

interface ReportDetailsType {
  id: string;
  title: string;
  category: string;
  location: string | null;
  time: string;
  status: 0 | 1 | 2;
  additionalInfo: string | null;
  reporterName?: string | null;
  image?: {
    filename: string;
    uri: string;
  };
}

const ReportDetails = () => {
  const route = useRoute(); // Using useRoute to access params
  const { id } = route.params as {
    id: string;
  };
  // Example report data (this should come from your data source, such as an API or state)

  const [reportDetails, setReportDetails] = useState<ReportDetailsType | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchReportDetails = async () => {
        try {
          const reportRef = firestore().collection("reports").doc(id);
          const reportDoc = await reportRef.get();

          if (reportDoc.exists) {
            const reportData = reportDoc.data();
            setReportDetails({
              id: reportDoc.id,
              title: reportData?.title || "Untitled",
              category: reportData?.category || "Unknown Category",
              location: reportData?.location || "Unknown Location",
              time: reportData?.time || "Unknown Time",
              status: reportData?.status || "PENDING",
              additionalInfo:
                reportData?.additionalInfo || "No additional information",
              reporterName: reportData?.name || "Anonymous",
              image: reportData?.image || null, // Add image field
            });
          } else {
            setError("No such document found.");
          }
        } catch (err) {
          console.error("Error fetching report details:", err);
          setError("Failed to fetch report details.");
        } finally {
          setLoading(false);
        }
      };

      fetchReportDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#115272" />
      </View>
    );
  }

  if (error || !reportDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || "No report details found."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Header */}

      {/* Report Information */}

      <View style={styles.content}>
        <Text style={styles.header}>Report Details</Text>
        {/* Reporter's Name */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Reportee's Username:</Text>
          <Text style={styles.value}>{reportDetails.reporterName}</Text>
        </View>

        {/* Selected Crime Type */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{reportDetails.category}</Text>
        </View>

        {/* Location */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>
            {reportDetails.location || "Location not provided"}
          </Text>
        </View>

        {/* Time */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Time:</Text>
          <Text style={styles.value}>{reportDetails.time}</Text>
        </View>

        {/* Status */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Status:</Text>
          <Text
            style={[
              styles.value,
              {
                color:
                  reportDetails.status === 2
                    ? "green"
                    : reportDetails.status === 0
                      ? "red"
                      : "#FFA500",
              },
              styles.statusText,
            ]}
          >
            {reportDetails.status === 2
              ? "VALID"
              : reportDetails.status === 1
                ? "PENDING"
                : "ARCHIVED"}
          </Text>
        </View>

        {/* Additional Information */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Additional Information:</Text>
          <View style={styles.textArea}>
            <Text style={styles.value}>
              {reportDetails.additionalInfo ||
                "No additional information provided"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Attached Image:</Text>
            {reportDetails.image ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: reportDetails.image.uri }}
                  style={styles.image}
                  resizeMode="contain"
                />
                <Text style={styles.filename}>
                  {reportDetails.image.filename}
                </Text>
              </View>
            ) : (
              <Text style={styles.value}>No image attached.</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#115272", // Set the background color to #115272
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  header: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#115272", // Changed text color to white for better contrast against dark background
    marginBottom: 20,
  },
  content: {
    backgroundColor: "#fff", // Keep the card background white for contrast
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  image: {
    width: 500, // Increase width
    height: 500, // Increase height
    borderRadius: 8, // Optional, keep or remove based on design preference
    marginBottom: 5,
  },
  filename: {
    marginTop: 5,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  detailRow: {
    marginBottom: 20,
  },
  label: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#115272", // Change label color to match header
    marginBottom: 5,
  },
  value: {
    fontSize: 20,
    color: "#333",
    lineHeight: 26,
  },
  statusText: {
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    marginTop: 5,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // White background for loading state
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // White background for error state
    paddingHorizontal: 20,
  },
  errorText: {
    color: "red",
    fontSize: 22,
    textAlign: "center",
  },
});

export default ReportDetails;
