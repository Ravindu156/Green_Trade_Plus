import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text, // Using standard Text component
  StyleSheet,
  TouchableOpacity, // For creating custom buttons
  TextInput, // For creating the search bar
  Image // For displaying images
} from 'react-native';

// --- Courses Data ---
// Ensuring each course has a truly unique 'id' to prevent React key warnings.
const courses = [
  {
    id: 1,
    title: 'Fundamentals of Packaging',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum',
  },
  {
    id: 2,
    title: 'Harvesting Techniques',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum',
  },
  {
    id: 3,
    title: 'Post-Harvest Management',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum',
  },
  {
    id: 4,
    title: 'Sustainable Agriculture',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum',
  },
  {
    id: 5,
    title: 'Crop Disease Control',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum',
  },
  {
    id: 6,
    title: 'Farm Business Planning',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum',
  },
];

// --- Home Component Definition ---
const Home = ({ navigation }) => {
  // State to manage the input value of the search bar
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView style={styles.container}>
      {/* Application Header (replaces Paper's Title) */}
      <Text style={styles.header}>Agro Learn</Text>

      {/* Custom Search Bar (replaces Paper's Searchbar) */}
      <View style={styles.searchbarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onChangeText={setSearchQuery} // Updates the search query state on text change
          value={searchQuery} // Binds the search bar value to the state
          placeholderTextColor="#666" // Placeholder color for better visibility
        />
      </View>

      {/* Mapping over the 'courses' array to render a custom Card for each course */}
      {courses.map((course) => (
        // Custom Card (replaces Paper's Card)
        <View key={course.id} style={styles.card}>
          {/* Card Content (replaces Paper's Card.Content) */}
          <View style={styles.cardContent}>
            {/* Title of the course (replaces Paper's Title) */}
            <Text style={styles.cardTitle}>{course.title}</Text>
            {/* Image for the card (replaces Paper's Card.Cover) */}
            {/* Using a placeholder image URL. */}
            <Image source={{ uri: "https://picsum.photos/700" }} style={styles.cardImage} />
            {/* Description of the course (replaces Paper's Paragraph) */}
            <Text style={styles.cardDescription}>{course.description}</Text>
          </View>
          {/* Card Actions (replaces Paper's Card.Actions) */}
          <View style={styles.cardActions}>
            {/* Custom Button for "Enroll Now" (replaces Paper's Button) */}
            <TouchableOpacity
              style={styles.enrollButton}
              onPress={() => navigation.navigate('Content', { courseId: course.id })}
            >
              <Text style={styles.enrollButtonText}>Enroll Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Container for the "See More Courses" button */}
      <View style={styles.seeMoreContainer}>
        {/* Custom "See More Courses" Button (replaces Paper's Button mode="text") */}
        <TouchableOpacity style={styles.seeMoreButton} onPress={() => {}}>
          <Text style={styles.seeMoreButtonText}>See More Courses</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// --- StyleSheet for component styling ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  // --- Custom Search Bar Styles ---
  searchbarContainer: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
    color: '#333',
  },
  // --- Custom Card Styles ---
  card: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
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
    marginBottom: 8,
    color: '#333',
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 4,
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Aligns button to the right
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  enrollButton: {
    backgroundColor: '#007bff', // Blue color for primary action
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  enrollButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // --- "See More" Button Styles ---
  seeMoreContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  seeMoreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    // No background for text mode button
  },
  seeMoreButtonText: {
    color: '#007bff', // Blue color for text button
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Home;
