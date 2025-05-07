import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
      App: {
        screens: {
          Home: 'home',
          Profile: 'profile',
          Settings: 'settings',
        },
      },
      ProductsTabs: {
        path: 'products',
        screens: {
          Home: 'home',
          Messages: 'messages',
          Cart: 'cart',
          Account: 'account',
        },
      },
    },
  },
};
