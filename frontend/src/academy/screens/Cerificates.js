import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Card, Paragraph, Button } from 'react-native-paper';

const Certificates = () => {
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
  ];

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.header}>My Certificates</Title>
      
      {certificates.map((cert) => (
        <Card key={cert.id} style={styles.card}>
          <Card.Content>
            <Title>{cert.title}</Title>
            <Paragraph>{cert.date}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => {}}>
              View Certificate
            </Button>
            <Button mode="outlined" onPress={() => {}}>
              Share
            </Button>
          </Card.Actions>
        </Card>
      ))}
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
});

export default Certificates;