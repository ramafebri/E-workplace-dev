import React from 'react'
import LoggedIn from '../screens/LoggedIn'
import HomeHD from '../screens//HomeHeadDivision'
import Profile from '../screens/Profile'
import WorkInRemote from "../screens/WorkInRemote"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function TopNavigation() {
  return (
    <Tab.Navigator
      initialRouteName='Home'
      tabBarOptions={{
      labelStyle: { fontSize: 15, fontWeight:'bold' },
      style: { backgroundColor: '#1A446D' },
      activeTintColor: '#f0edf6',
      inactiveTintColor: '#4a90e2',
      headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={LoggedIn} />
      {/* <Tab.Screen name="HomeHeadDivision" component={HomeHD} /> */}
      <Tab.Screen name="Not at Office" component={WorkInRemote} />
      <Tab.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
    </Tab.Navigator>
  );
}

// function TopNavigation() {
//   return (
//     <Tab.Navigator
//       initialRouteName='Home'
//       tabBarOptions={{
//       labelStyle: { fontSize: 15, fontWeight:'bold' },
//       style: { backgroundColor: '#1A446D' },
//       activeTintColor: '#f0edf6',
//       inactiveTintColor: '#4a90e2',
//       headerShown: false,
//       }}
//     >
//       <Tab.Screen name="Home" component={LoggedIn} />
//       <Tab.Screen name="HomeHeadDivision" component={HomeHD} />
//       <Tab.Screen name="Not at Office" component={WorkInRemote} />
//       <Tab.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
//     </Tab.Navigator>
//   );
// }

  export default TopNavigation;
