import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, List, Avatar, Divider } from 'react-native-paper';

const Profile = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar.Image 
          size={100} 
          source={require('../assets/profile-placeholder.jpg')} 
          style={styles.avatar}
        />
        <Title style={styles.name}>Ravindu Hirushanka</Title>
      </View>
      
      <Divider style={styles.divider} />
      
      <List.Section>
        <List.Item
          title="My Courses"
          left={() => <List.Icon icon="book" />}
          onPress={() => {}}
        />
        <List.Item
          title="Certificates"
          left={() => <List.Icon icon="certificate" />}
          onPress={() => {}}
        />
        <List.Item
          title="Settings"
          left={() => <List.Icon icon="cog" />}
          onPress={() => {}}
        />
        <List.Item
          title="Logout"
          left={() => <List.Icon icon="logout" />}
          onPress={() => {}}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
});

export default Profile;