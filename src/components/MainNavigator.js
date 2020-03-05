import React from 'react';
import { View, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import TopNavigation from './AppNavigator';
import Login from '../screens/Login';
import JwtCheck from "../screens/JwtCheck";
import WorkHome from "../screens/WorkHome";
import WorkClient from "../screens/WorkClient";
import Dayoff from "../screens/dayOff"
import Sick from "../screens/sick"
import Approval from '../screens/ApprovalPage'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BottomNavBar from './BotoomNavBar'
import Eworkplace3 from '../../image/eworkplace3.svg'

const Stack = createStackNavigator();
function HeaderRight () {
  return(
    <View style={{alignSelf: 'flex-end', paddingRight: 20}}>
    <Button 
      icon={<FontAwesome5
        name="bell"
        size={25}
        color="white"
        solid       
      />}
      buttonStyle={{backgroundColor:'#1A446D'}}
      onPress={()=>{alert('hai gay')}}  
    />
      
    </View>
  )
}

function HeaderLeft () {
  return(
    <View style={{marginTop: 30, height:'100%', marginLeft:15}}>
      <Eworkplace3 width={120} height={45}/> 
    </View>
  )
}

function MyStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerTintColor:'#FFFFFF',headerStyle:{backgroundColor: '#1A446D'}, headerTitleAlign:'center',
      }}
      initialRouteName='SplashScreen'
    >
      <Stack.Screen name="SplashScreen" component={JwtCheck} options={{headerShown: false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
      <Stack.Screen name="Home" component={BottomNavBar} 
      options={{
        headerRight:()=>{
          return(
            <HeaderRight />
          )
        },
        headerLeft:()=>{
          return(
            <HeaderLeft />
          )
        },
        headerTitle:null,
        headerStyle: {
          backgroundColor:'#1A446D',
          height: 80,
        },  
        }}
      />
      <Stack.Screen name="HomeHD" component={TopNavigation} 
      options={{
        headerRight:()=>{
          return(
            <HeaderRight />
          )
        },
        headerLeft:()=>{
          return(
            <HeaderLeft />
          )
        },
        headerTitle:null,
        headerStyle: {
          backgroundColor:'#1A446D',
          height: 80,
        },  
        }}
      />
      <Stack.Screen name="WHome" component={WorkHome} options={{headerTitle:'Work From Home',}}/>
      <Stack.Screen name="WClient" component={WorkClient} options={{headerTitle:'Work at Client Office',}}/>  
      <Stack.Screen name="DayOff" component={Dayoff} options={{headerTitle:'Day Off',}}/>  
      <Stack.Screen name="Sick" component={Sick} options={{headerTitle:'Sick',}}/>
      <Stack.Screen name="Approval" component={Approval} options={{headerTitle:'Approval',}}/>    
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
padRight:{
  paddingRight: 10,
  marginRight: 10
}
})
export default (MyStack)