import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React from 'react'
import LoggedIn from '../screens/LoggedIn'
import HomeHD from '../screens//HomeHeadDivision'
import Profile from '../screens/Profile'
import WorkInRemote from "../screens/WorkInRemote"

const Tab = createBottomTabNavigator();

export default function BottomNavBar() {
  return (
    <Tab.Navigator
        initialRouteName='Home'
        tabBarOptions={{
        labelStyle: { fontSize: 15, fontWeight:'bold' },
        style: { backgroundColor: '#FFFFFF' },
        activeTintColor: '#265685',
        inactiveTintColor: '#C1C1C1',
        adaptive:true,
        safeAreaInset:{
          bottom: 'never',
          top : 'never'
        }
        }}
    >
      <Tab.Screen name="Home" component={LoggedIn} options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => (
            <FontAwesome5 name="home" color={'blue'} size={20} />
          ),
        }}/>
      <Tab.Screen name="Not at Office" component={WorkInRemote} options={{
          tabBarLabel: 'Task',
          tabBarIcon: () => (
            <FontAwesome5 name="clipboard" color={'blue'} size={20} />
          ),
        }}/>
      <Tab.Screen name="Leave" component={Profile} options={{
          tabBarLabel: 'Leave',
          tabBarIcon: () => (
            <FontAwesome5 name="suitcase" color={'blue'} size={20} />
          ),
        }}/>
        <Tab.Screen name="Profile" component={Profile} options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => (
            <FontAwesome5 name="user" color={'blue'} size={20} />
          ),
        }}/>
    </Tab.Navigator>
  );
}