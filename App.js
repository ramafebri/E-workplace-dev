import React, { Component } from 'react';
import MyStack from './src/components/MainNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';

enableScreens();
class App extends Component {
  render() {  
    return(
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
    );
  }
}

export default App