import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Use the correct hook for route params
import firestore from '@react-native-firebase/firestore';

interface ReportDetailsType {
  title: string;
  category: string;
  location: string | null;
  time: string;
  status: 'PENDING' | 'VALID' | 'PENALIZED';
  details: string | null;
  id: string;
}

const ReportDetails = () => {
  const route = useRoute(); // Using useRoute to access params
  const { id, title, category } = route.params as { id: string; title: string; category: string };

  const [reportDetails, setReportDetails] = useState<ReportDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the report details from Firestore based on the id
  useEffect(() => {
    if (id) {
      const fetchReportDetails = async () => {
        try {
          const reportRef = firestore().collection('reports').doc(id);
          const reportDoc = await reportRef.get();

          if (reportDoc.exists) {
            setReportDetails(reportDoc.data() as ReportDetailsType);
          } else {
            setError('No such document found.');
          }
        } catch (err) {
          console.error('Error fetching report details:', err);
          setError('Failed to fetch report details.');
        } finally {
          setLoading(false);
        }
      };

      fetchReportDetails();
    }
  }, [id]);

  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render error state if data is not found
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Render report details
  if (!reportDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Report details could not be loaded.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{reportDetails.title}</Text>
      <Text style={styles.category}>Category: {reportDetails.category}</Text>
      <Text style={styles.location}>Location: {reportDetails.location || 'Not provided'}</Text>
      <Text style={styles.time}>Time: {reportDetails.time}</Text>
      <Text style={styles.status}>Status: {reportDetails.status}</Text>
      <Text style={styles.details}>Details: {reportDetails.details || 'No details available'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#115272',
  },
  category: {
    fontSize: 18,
    marginTop: 10,
    color: '#115272',
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    color: '#115272',
  },
  time: {
    fontSize: 16,
    marginTop: 20,
    color: '#115272',
  },
  status: {
    fontSize: 16,
    marginTop: 20,
    color: '#115272',
  },
  details: {
    fontSize: 16,
    marginTop: 20,
    color: '#115272',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default ReportDetails;
