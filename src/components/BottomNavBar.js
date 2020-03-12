import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React from 'react'
import LoggedIn from '../screens/LoggedIn'
import Profile from '../screens/Profile'
import Leave from '../screens/Leave'
import Task from '../screens/Task'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

export default function BottomNavBar() {
  return (
    <Tab.Navigator
        initialRouteName='Home'
        tabBarOptions={{
        labelStyle: { fontSize: 15, fontWeight:'bold', fontFamily:'Nunito-Bold', },
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
          tabBarIcon: ({ color }) => (
            <Icon name="home-outline" color={color} size={25} />
          ),
        }}/>
      <Tab.Screen name="Task" component={Task} options={{
          tabBarLabel: 'Task',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="clipboard" color={color} size={20} />
          ),
        }}/>
      <Tab.Screen name="Leave" component={Leave} options={{
          tabBarLabel: 'Leave',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="suitcase" color={color} size={20} light/>
          ),
        }}/>
        <Tab.Screen name="Profile" component={Profile} options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" color={color} size={20} />
          ),
        }}/>
    </Tab.Navigator>
  );
}