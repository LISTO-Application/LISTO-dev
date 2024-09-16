import React from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { styles } from '@/styles/styles'; // Make sure to adjust the path to your actual styles file
import { router } from 'expo-router';
import { SpacerView } from '@/components/SpacerView';
export default function ViewReports() {
  // Example report data
  const reports = [
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
  ];

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
              <TouchableOpacity style={styles.editIcon}>
                <Ionicons name="pencil" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editIcon}>
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
          <TouchableOpacity style={styles.submitButton}>
            <Text style={[styles.buttonText, { color: '#FFF' }]}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
