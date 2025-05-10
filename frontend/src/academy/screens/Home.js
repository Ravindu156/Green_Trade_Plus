import React from 'react';
import {useState} from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, Text,Searchbar } from 'react-native-paper';

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
    id: 1,
    title: 'Fundamentals of Packaging',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum',
  },
  {
    id: 2,
    title: 'Harvesting Techniques',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum',
  },
];




const Home = ({ navigation }) => {
  
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>Agro Learn</Title>

      <Searchbar style={styles.searchbar}
      placeholder="Search"
      onChangeText={setSearchQuery}
      value={searchQuery}
    />



      {courses.map((course) => (
        <Card key={course.id} style={styles.card}>
          <Card.Content>
            <Title>{course.title}</Title>
            <Card.Cover source={{ uri: "https://picsum.photos/700" }} style={styles.img} />
            <Paragraph>{course.description}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('Content', { courseId: course.id })}
            >
              Enroll Now
            </Button>
          </Card.Actions>
        </Card>
      ))}
      
      <View style={styles.seeMoreContainer}>
        <Button mode="text" onPress={() => {}}>
          See More Courses
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
  },
  seeMoreContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  searchbar:{
    marginBottom:16
  }
});

export default Home;