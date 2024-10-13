import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SpacerView } from '@/components/SpacerView';
import { styles } from '@/styles/styles'; // Adjust the path if necessary
import { router } from 'expo-router';
export default function NewReportForm() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('Select Crime Type');
  const [location, setLocation] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [image, setImage] = useState(null); // Placeholder for image upload

  const crimeTypes = [
    { label: 'Theft', value: 'theft' },
    { label: 'Assault', value: 'assault' },
    { label: 'Vandalism', value: 'vandalism' },
  ];

  const handleSelect = (item) => {
    setSelectedValue(item.label);
    setModalVisible(false);
  };

  const handleSubmit = () => {
    console.log('Crime Type:', selectedValue);
    console.log('Location:', location);
    console.log('Additional Information:', additionalInfo);
    // Logic to submit the report or handle the data
  };

  return (
    <View style={styles.mainContainer}>
    {/* Blue Header */}
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Submit a Report</Text>
      <SpacerView height={120} />
    </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Custom Dropdown for Crime Type */}
        <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
          <Text style={styles.selectedText}>{selectedValue}</Text>
          <Ionicons name="chevron-down" size={24} color="gray" />
        </TouchableOpacity>

        {/* Modal for Dropdown List */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <FlatList
                data={crimeTypes}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                    <Text style={styles.itemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Location Input */}
        <TextInput
          style={styles.textInput}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        {/* Additional Information Input */}
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Additional Information"
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
          multiline={true}
        />

        {/* Image Upload Placeholder */}
        <TouchableOpacity style={styles.imageUpload}>
          <Ionicons name="image-outline" size={24} color="gray" />
          <Text style={styles.uploadText}>Add file</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainerReport}>
        <TouchableOpacity style={styles.cancelButtonReport} onPress={() => console.log('Cancel')}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={styles.submitButton}
             // Redirect to the new report form
          >
            <Text style={[styles.buttonText, { color: '#FFF' }]}>Submit Report</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}

