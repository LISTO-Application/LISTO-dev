import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { webstyles } from "@/styles/webstyles"; // For web styles
import { styles } from "@/styles/styles"; // For mobile styles

export default function ValidateReports({ navigation }: { navigation: any }) {
  const [reports, setReports] = useState([
    { id: 1, title: 'HOMICIDE', details: 'Batasan resident stabbed by family member', time: '5:47 pm', status: 'PENDING' },
    { id: 2, title: 'THEFT', details: 'Alfamart Holy Spirit caught a teenager stealing', time: '5:47 pm', status: 'VALID' },
    { id: 3, title: 'HOMICIDE', details: 'Batasan resident stabbed by family member', time: '5:47 pm', status: 'PENDING' },
    { id: 4, title: 'HOMICIDE', details: 'Batasan resident stabbed by family member', time: '5:47 pm', status: 'PENALIZED' },
  ]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'VALID':
        return { backgroundColor: '#115272', color: 'red' };
      case 'PENDING':
        return { backgroundColor: 'grey', color: 'blue' };
      case 'PENALIZED':
        return { backgroundColor: '#dc3545', color: 'green' };
      default:
        return { backgroundColor: '#6c757d', color: '' };
    }
  };

  const handleApprove = (reportId: number) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, status: 'VALID' } : report
      )
    );
  };

  const handleReject = (reportId: number) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, status: 'PENALIZED' } : report
      )
    );
  };

  const handleTitlePress = (reportId: number) => {
    // Ensure the navigation to reportDetails works
    navigation.navigate("reportDetails", { id: reportId });
  };

  if (Platform.OS === "android" || Platform.OS === "ios") {
    return (
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Listed Reports (ADMINS)</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {reports.map((report) => (
            <View key={report.id}>
              {/* Report content */}
              <View style={styles.reportContainer}>
                <View style={styles.reportIcon}>
                  <Ionicons name={report.title === 'HOMICIDE' ? 'alert-circle' : 'alert'} size={24} color="white" />
                </View>

                <View style={styles.reportTextContainer}>
                  {/* Title wrapped in TouchableOpacity for navigation */}
                  <TouchableOpacity onPress={() => handleTitlePress(report.id)}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                  </TouchableOpacity>
                  <Text style={styles.reportDetails}>{report.details}</Text>
                </View>

                {/* Status badge */}
                <View style={styles.statusContainer}>
                  <Text style={[styles.statusBadge, getStatusStyle(report.status)]}>
                    {report.status}
                  </Text>
                </View>

                {/* Approve and Reject buttons */}
                {report.status === 'PENDING' ? (
                  <View style={styles.actionContainer}>
                    <TouchableOpacity
                      style={webstyles.approveButton}
                      onPress={() => handleApprove(report.id)}
                    >
                      <Text style={webstyles.buttonText}>Validate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={webstyles.rejectedButton}
                      onPress={() => handleReject(report.id)}
                    >
                      <Text style={webstyles.buttonText}>Penalize</Text>
                    </TouchableOpacity>
                  </View>
                ) : report.status === 'VALID' ? (
                  <TouchableOpacity
                    style={webstyles.approvedButton}
                    onPress={() => { /* Optional: Add any action for approved state */ }}
                  >
                    <Text style={webstyles.approvedButtonText}>Validated</Text>
                  </TouchableOpacity>
                ) : report.status === 'PENALIZED' ? (
                  <TouchableOpacity
                    style={webstyles.rejectedButton}
                    onPress={() => { /* Optional: Add any action for rejected state */ }}
                  >
                    <Text style={webstyles.rejectedButtonText}>Penalized</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Horizontal separator */}
             
            </View>
          ))}
        </ScrollView>
      </View>
    );
  } else if (Platform.OS === "web") {
    return (
      <View style={webstyles.container}>
        <View style={webstyles.mainContainer}>
          <Text style={webstyles.headerText}>Listed Reports</Text>
          <ScrollView contentContainerStyle={webstyles.reportList}>
            {reports.map((report) => (
              <View key={report.id} style={webstyles.reportContainerValidate}>
                <View style={webstyles.reportIconContainer}>
                  <Ionicons
                    name={report.title === 'HOMICIDE' ? 'alert-circle' : 'alert'}
                    size={24}
                    color="white"
                    style={webstyles.reportIcon}
                  />
                </View>

                <View style={webstyles.reportTextContainer}>
                  <TouchableOpacity onPress={() => handleTitlePress(report.id)}>
                    <Text style={webstyles.reportTitleValidate}>{report.title}</Text>
                  </TouchableOpacity>
                  <Text style={webstyles.reportDetails}>{report.details}</Text>
                </View>

                {/* Approve and Reject buttons */}
                {report.status === 'PENDING' ? (
                  <View style={webstyles.actionContainer}>
                    <TouchableOpacity
                      style={webstyles.approveButton}
                      onPress={() => handleApprove(report.id)}
                    >
                      <Text style={webstyles.buttonText}>Validate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={webstyles.rejectedButton}
                      onPress={() => handleReject(report.id)}
                    >
                      <Text style={webstyles.buttonText}>Penalize</Text>
                    </TouchableOpacity>
                  </View>
                ) : report.status === 'VALID' ? (
                  <TouchableOpacity
                    style={webstyles.approvedButton}
                    onPress={() => { /* Optional: Add any action for approved state */ }}
                  >
                    <Text style={webstyles.approvedButtonText}>Validated</Text>
                  </TouchableOpacity>
                ) : report.status === 'PENALIZED' ? (
                  <TouchableOpacity
                    style={webstyles.rejectedButton}
                    onPress={() => { /* Optional: Add any action for rejected state */ }}
                  >
                    <Text style={webstyles.rejectedButtonText}>Penalized</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
}
