import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.createURL('/')], // creates something like exp://localhost:8081/
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register'
        }
      },
      App: {
        screens: {
          Home: 'home',
          Profile: 'profile',
          Settings: 'settings'
        }
      }
    }
  }
};
