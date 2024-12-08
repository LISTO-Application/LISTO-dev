import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet,Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SpacerView } from '@/components/SpacerView'; // Assuming this component is available
import { router } from 'expo-router';
import { webstyles } from "@/styles/webstyles"; // For web styles

export default function ValidateReports() {
  const [reports, setReports] = useState([
    { id: 1, title: 'HOMICIDE', details: 'Batasan resident stabbed by family member', time: '5:47 pm', status: 'PENDING' },
    { id: 2, title: 'THEFT', details: 'Alfamart Holy Spirit caught a teenager stealing', time: '5:47 pm', status: 'VALID' },
    { id: 3, title: 'HOMICIDE', details: 'Batasan resident stabbed by family member', time: '5:47 pm', status: 'PENDING' },
    { id: 4, title: 'HOMICIDE', details: 'Batasan resident stabbed by family member', time: '5:47 pm', status: 'PENALIZED' },
    // Add more reports as needed
  ]);

  // Handle report validation status
  const handleValidate = (reportId: number, status : string) => {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId ? { ...report, status: status === 'PENDING' ? 'VALID' : 'PENDING' } : report
      )
    );
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
}else if (Platform.OS === "web") {
  return (
    <View style={webstyles.container}>
    {/* Sidebar */}
    <View style={webstyles.sidebar}>
        <Text style={webstyles.sidebarTitle}>Admin</Text>
        <TouchableOpacity style={webstyles.sidebarItem}>
            <Text style={webstyles.sidebarText}>Emergency Dial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={webstyles.sidebarItem}>
            <Text style={webstyles.sidebarText}>Report Incident</Text>
        </TouchableOpacity>
        <TouchableOpacity style={webstyles.sidebarItem}>
            <Text style={webstyles.sidebarText}>Report Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={webstyles.sidebarItem}>
            <Text style={webstyles.sidebarText}>Generate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={webstyles.sidebarItem}>
            <Text style={webstyles.sidebarText}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={webstyles.sidebarItem}>
            <Text style={webstyles.sidebarText}>Logout</Text>
        </TouchableOpacity>
    </View>
    
      <View style={webstyles.mainContainer}>
        <View style={webstyles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={webstyles.backIcon}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={webstyles.headerText}>Listed Reports (ADMINS)</Text>
          <SpacerView style = {{height: 120}} />
        </View>

        <ScrollView contentContainerStyle={webstyles.scrollViewContent}>
        {reports.map((report) => (
          <View key={report.id}>
            {/* Report content */}
            <View style={webstyles.reportContainer}>
              <View style={webstyles.reportIcon}>
                <Ionicons name={report.title === 'HOMICIDE' ? 'alert-circle' : 'alert'} size={24} color="white" />
              </View>

              <View style={webstyles.reportTextContainer}>
                <Text style={webstyles.reportTitleValidate}>{report.title}</Text>
                <Text style={webstyles.reportDetails}>{report.details}</Text>
                <Text style={webstyles.timeTextValdiate}>{report.time}</Text>
              </View>

              {/* Status badge */}
              <View style={webstyles.statusContainer}>
                <Text style={[webstyles.statusBadge, getStatusStyle(report.status)]}>
                  {report.status}
                </Text>
              </View>

              {/* Validation action (for admin) */}
              <TouchableOpacity
                style={webstyles.validateIcon}
                onPress={() => handleValidate(report.id, report.status)}
              >
                <Ionicons name="settings" size={24} color="#115272" />
              </TouchableOpacity>
            </View>

            {/* Horizontal separator */}
            <View style={webstyles.horizontalLine} />
          </View>
        ))}
      </ScrollView>
    </View>
    </View>
  );
}
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

const getStatusStyle = (status : string) => {
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
