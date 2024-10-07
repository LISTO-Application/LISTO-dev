import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { styles } from '@/styles/styles'; // Adjust the path if necessary
import { router } from 'expo-router';
import { SpacerView } from '@/components/SpacerView';

export default function ViewReports() {
  // Example report data stored in state
  const [reports, setReports] = useState([
    {
      id: 1,
      title: 'Violent Activity near 6th street',
      time: '9:41 AM',
    },
    {
      id: 2,
      title: 'Theft near 6th street',
      time: '9:41 AM',
    },
  ]);

  // Delete report handler
  const handleDeleteReport = (reportId) => {
    // Show confirmation alert
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            // Remove the report from the state
            setReports(reports.filter((report) => report.id !== reportId));
          },
        },
      ]
    );
  };

  // Edit report handler (redirect to editReport.tsx with report ID)
  const handleEditReport = (reportId) => {
    // Redirect to the report edit page with the report ID in the query
    router.push(`/editReport?id=${reportId}`);
  };

  // Submit report handler (redirect to new report form)
  const handleSubmitReport = () => {
    // Redirect to the page where the user can fill in new report details
    router.push('/newReportsForm');  // Adjust this path based on your routing setup
  };

  return (
    <View style={styles.mainContainer}>
      {/* Blue Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Submitted Reports</Text>
        <SpacerView height={120} />
      </View>

      {/* Report List */}
      <SpacerView height={90} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {reports.map((report) => (
          <View key={report.id} style={styles.reportContainer}>
            <SpacerView height={20} />
            <View style={styles.reportIcon}>
              <Ionicons name="alert-circle-outline" size={24} color="white" />
            </View>
            <View style={styles.reportTextContainer}>
              <Text style={styles.reportTitle}>{report.title}</Text>
            </View>
            <View style={styles.reportActions}>
              {/* Edit Icon */}
              <TouchableOpacity 
                style={styles.editIcon} 
                onPress={() => handleEditReport(report.id)}
              >
                <Ionicons name="pencil" size={24} color="white" />
              </TouchableOpacity>

              {/* Trash Icon (Delete) */}
              <TouchableOpacity 
                style={styles.editIcon} 
                onPress={() => handleDeleteReport(report.id)}
              >
                <Ionicons name="trash-bin" size={24} color="white" />
              </TouchableOpacity>

              <Text style={styles.timeText}>{report.time}</Text>
            </View>
          </View>
        ))}

        {/* Submit & Cancel Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmitReport}  // Redirect to the new report form
          >
            <Text style={[styles.buttonText, { color: '#FFF' }]}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
