import React from 'react';
import {
  View,
  Text, // Using standard Text component
  StyleSheet,
  ScrollView,
  TouchableOpacity, // For creating custom buttons
} from 'react-native';

const Certificates = () => {
  // Hardcoded certificate data
  const certificates = [
    {
      id: 1,
      title: 'Fundamentals of Packaging',
      date: 'Completed: April 20, 2025',
    },
    {
      id: 2,
      title: 'Harvesting Techniques',
      date: 'Completed: March 15, 2025',
    },
    {
      id: 3, // Added unique ID for consistency
      title: 'Advanced Crop Rotation',
      date: 'Completed: June 01, 2025',
    },
    {
      id: 4, // Added unique ID for consistency
      title: 'Pest Management Strategies',
      date: 'Completed: May 10, 2025',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Page Header (replaces Paper's Title) */}
      <Text style={styles.header}>My Certificates</Text>

      {/* Mapping through certificates to render custom Card-like views */}
      {certificates.map((cert) => (
        // Custom Card (replaces Paper's Card)
        <View key={cert.id} style={styles.card}>
          {/* Card Content (replaces Paper's Card.Content) */}
          <View style={styles.cardContent}>
            {/* Certificate Title (replaces Paper's Title) */}
            <Text style={styles.cardTitle}>{cert.title}</Text>
            {/* Certificate Completion Date (replaces Paper's Paragraph) */}
            <Text style={styles.cardDate}>{cert.date}</Text>
          </View>
          {/* Card Actions (replaces Paper's Card.Actions) */}
          <View style={styles.cardActions}>
            {/* Custom "View Certificate" Button (replaces Paper's Button mode="contained") */}
            <TouchableOpacity style={styles.containedButton} onPress={() => {}}>
              <Text style={styles.containedButtonText}>View Certificate</Text>
            </TouchableOpacity>
            {/* Custom "Share" Button (replaces Paper's Button mode="outlined") */}
            <TouchableOpacity style={styles.outlinedButton} onPress={() => {}}>
              <Text style={styles.outlinedButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Consistent background color
  },
  header: {
    fontSize: 28, // Slightly larger header for prominence
    fontWeight: 'bold',
    marginBottom: 20, // Increased margin for spacing
    textAlign: 'center',
    color: '#333', // Darker text color
  },
  // --- Custom Card Styles ---
  card: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', // Ensures content respects border radius
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Aligns buttons to the left
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 10, // Adds space between buttons
  },
  // --- Custom Button Styles ---
  containedButton: {
    backgroundColor: '#007bff', // Blue background for primary action
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  containedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007bff', // Blue border for outlined button
    paddingVertical: 9, // Adjusted padding to align with contained button
    paddingHorizontal: 19, // Adjusted padding
    borderRadius: 5,
  },
  outlinedButtonText: {
    color: '#007bff', // Blue text color for outlined button
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Certificates;