    import React from 'react';
    import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
    import HomeScreen from '../screens/HomeScreen';
    import MessagesScreen from '../screens/MessagesScreen';
    import CartScreen from '../screens/CartScreen';
    import AccountScreen from '../screens/AccountScreen';


    const Tab = createBottomTabNavigator();

    const ProductsTabs = () => {
    return (
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Messages" component={MessagesScreen} />
                <Tab.Screen name="Cart" component={CartScreen} />
                <Tab.Screen name="Account" component={AccountScreen} />
            </Tab.Navigator>
        
    );
    };

    export default ProductsTabs;
