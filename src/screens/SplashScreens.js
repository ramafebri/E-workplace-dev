import React, { Component } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { addJWT } from '../actions/JwtActions';
import { addLoading, addNama } from '../actions/DataActions';
import Logo from '../../image/eworkplace.svg';

class SplashScreens extends Component {    
      componentDidMount() {
        this.loadJWT();
      }

      loadJWT = async () => {
        const userToken = await AsyncStorage.getItem('id_token');
        const user_permission = await AsyncStorage.getItem('user_permission');
        const permission = parseInt(user_permission);

        const username = await AsyncStorage.getItem('username');
        const name = await AsyncStorage.getItem('name');

        this.props.add(userToken)
        this.props.addName(username, name)
        this.props.addLoad(true)

        if(userToken !== null && userToken !== ""){
          if(permission === 1){
            this.props.navigation.push('HomeHD');
          }
          else if(permission === 2){
            this.props.navigation.push('Home');
          }
        }
        else{
          this.props.navigation.push('Login');
        }
    };
    
    render() {
        return (
          <View style={styles.container}>
            <View style={{width: '100%', alignSelf:'center', justifyContent:'center',alignItems:'center', alignContent:'center'}}>
              <Logo width={250} height={150}/>
            </View>
            <View style={{marginTop:'20%' }}>  
              <ActivityIndicator color='white' size={40}/>
            </View>  
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    paddingTop: 60,
    backgroundColor:'#1A446D',
    height: '100%',
    width: '100%'
  },
});

const mapStateToPropsData = (state) => {
  console.log(state);
  return {
    tokenJWT: state.JwtReducer.jwt
  }
}

const mapDispatchToPropsData = (dispatch) => {
  return {
    addLoad : (Loading) => dispatch(addLoading(Loading)),
    addName: (username, fullname) => dispatch(addNama(username, fullname)),
    add: (userToken) => dispatch(addJWT(userToken))
  }
}

export default connect(mapStateToPropsData, mapDispatchToPropsData)(SplashScreens)
