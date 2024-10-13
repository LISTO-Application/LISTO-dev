import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SpacerView } from '@/components/SpacerView'; // Assuming this component is available
import { router } from 'expo-router';

export default function ValidateReports() {
  const [reports, setReports] = useState([
    { id: 1, title: 'HOMICIDE', details: 'Batasan resident stabbed by family member', time: '5:47 pm', status: 'PENDING' },
    { id: 2, title: 'THEFT', details: 'Alfamart Holy Spirit caught a teenager stealing', time: '5:47 pm', status: 'VALID' },
    { id: 3, title: 'HOMICIDE', details: 'Batasan resident stabbed by family member', time: '5:47 pm', status: 'PENDING' },
    { id: 4, title: 'HOMICIDE', details: 'Batasan resident stabbed by family member', time: '5:47 pm', status: 'PENALIZED' },
    // Add more reports as needed
  ]);

  // Handle report validation status
  const handleValidate = (reportId, status) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, status: status === 'PENDING' ? 'VALID' : 'PENDING' } : report
      )
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Listed Reports (ADMINS)</Text>
        <SpacerView height={120} />
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
                <Text style={styles.reportTitle}>{report.title}</Text>
                <Text style={styles.reportDetails}>{report.details}</Text>
                <Text style={styles.timeText}>{report.time}</Text>
              </View>

              {/* Status badge */}
              <View style={styles.statusContainer}>
                <Text style={[styles.statusBadge, getStatusStyle(report.status)]}>
                  {report.status}
                </Text>
              </View>

              {/* Validation action (for admin) */}
              <TouchableOpacity
                style={styles.validateIcon}
                onPress={() => handleValidate(report.id, report.status)}
              >
                <Ionicons name="settings" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Horizontal separator */}
            <View style={styles.horizontalLine} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#004d79',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  backIcon: {
    position: 'absolute',
    left: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  reportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  reportIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff3b30',
    borderRadius: 20,
  },
  reportTextContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  reportTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  reportDetails: {
    fontSize: 14,
    color: '#6c757d',
  },
  timeText: {
    fontSize: 12,
    color: '#6c757d',
  },
  statusContainer: {
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    textAlign: 'center',
  },
  validateIcon: {
    paddingHorizontal: 5,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: '#d3d3d3',
    marginVertical: 10,
  },
});

const getStatusStyle = (status) => {
  switch (status) {
    case 'VALID':
      return { backgroundColor: '#115272', color: 'white' };
    case 'PENDING':
      return { backgroundColor: 'grey', color: 'white' };
    case 'PENALIZED':
      return { backgroundColor: '#dc3545', color: 'white' };
    default:
      return { backgroundColor: '#6c757d', color: 'white' };
  }
};
