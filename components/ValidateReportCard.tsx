import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { Component, useState } from "react";
import { webstyles } from "@/styles/webstyles";

export default function ValidateReportCard({
  report,
  handleTitlePress,
  handleStatusChange,
}: {
  report: any;
  handleTitlePress: any;
  handleStatusChange: any;
}) {
  const [isImageZoomVisible, setIsImageZoomVisible] = useState(false);
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", gap: 20 }}>
        <TouchableOpacity onPress={() => setIsImageZoomVisible(true)}>
          {report.image ? (
            <View style={style.imageContainer}>
              <Image
                source={{ uri: report.image.uri }}
                style={style.image}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={style.imageContainer}>
              <Image
                source={require("@/assets/images/question.png")}
                style={style.image}
                resizeMode="cover"
              />
            </View>
          )}
        </TouchableOpacity>
        <View style={{ flexDirection: "column", alignSelf: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => handleTitlePress(report)}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#115272",
                }}
              >
                {report.title}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: "#115272",
                fontSize: 14,
                marginLeft: 10,
              }}
            >
              {report.time} &nbsp; {report.date}
            </Text>
          </View>
          {/* Report Category */}
          <Text style={{ color: "#115272", marginTop: 5 }}>
            {`Category: ${report.category}`}
          </Text>
          {/* Report Location */}
          <Text style={{ color: "#115272", marginTop: 5 }}>
            {`Location: ${report.location || "Not provided"}`}
          </Text>
        </View>
      </View>
      {/* Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          alignSelf: "flex-end",
          marginTop: 10,
        }}
      >
        {report.status === "PENDING" ? (
          <>
            <TouchableOpacity
              style={{
                backgroundColor: "#28a745",
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 5,
                marginLeft: 5,
              }}
              onPress={() => handleStatusChange(report.id, "VALID")}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Validate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#dc3545",
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 5,
                marginLeft: 5,
              }}
              onPress={() => handleStatusChange(report.id, "PENALIZED")}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Penalize
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text
            style={{
              color:
                report.status === "VALID"
                  ? "#28a745"
                  : report.status === "PENALIZED"
                    ? "#dc3545"
                    : "#6c757d",
              fontWeight: "bold",
              fontSize: 20,
              textAlign: "right",
            }}
          >
            {report.status === "VALID" ? "Valid" : "Penalized"}
          </Text>
        )}
      </View>
      <Modal
        visible={isImageZoomVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsImageZoomVisible(false)}
      >
        <View style={webstyles.modalContainer}>
          <View style={webstyles.modalContent}>
            {report.image ? (
              <View style={style.imageContainer}>
                <Image
                  source={{ uri: report.image.uri }}
                  style={style.image}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View style={style.imageContainer}>
                <Image
                  source={require("@/assets/images/question.png")}
                  style={style.image}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const style = StyleSheet.create({
  imageContainer: {
    alignItems: "center",
    borderRadius: 10,
    width: 100,
    height: 100,
  },
  image: {
    objectFit: "contain",
    width: "100%", // Increase width
    height: "100%", // Increase height
    borderRadius: 10, // Optional, keep or remove based on design preference
    borderWidth: 1,
  },
});
