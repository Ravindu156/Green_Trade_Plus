import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, List, Divider } from 'react-native-paper';

const Menu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Title style={styles.header}>Agro Learn</Title>
      
      <List.Section>
        <List.Item
          title="Ravindu Hirushanka"
          left={() => <List.Icon icon="account" />}
          right={() => <List.Icon icon="checkbox-blank-outline" />}
        />
        <List.Item
          title="My Courses"
          left={() => <List.Icon icon="book" />}
          right={() => <List.Icon icon="checkbox-marked" />}
          onPress={() => navigation.navigate('Home')}
        />
      </List.Section>
      
      <Divider style={styles.divider} />
      
      <Title style={styles.sectionTitle}>Certifications</Title>
      <List.Item
        title="View Certificates"
        left={() => <List.Icon icon="certificate" />}
        onPress={() => {}}
      />
    </View>
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
  sectionTitle: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 16,
  },
  divider: {
    marginVertical: 16,
  },
});

export default Menu;