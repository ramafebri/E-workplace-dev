import React, { Component } from 'react'
import {
  ActivityIndicator,
  StatusBar, Image, Text, StyleSheet,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { addJWT } from '../actions/JwtActions';
import Logo from '../../image/eworkplace.svg'

class JwtCheck extends Component {    
      componentDidMount() {
        this.loadJWT();
      }

      loadJWT = async () => {
        const userToken = await AsyncStorage.getItem('id_token');
        this.props.add(userToken)

        this.props.navigation.replace(userToken ? 'Home' : 'Login');
        // this.props.navigation.push(userToken ? 'HomeHD' : 'Login');
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

const mapDispatchToPropsJWT = (dispatch) => {
  return {
    add: (userToken) => dispatch(addJWT(userToken))
  }
}

export default connect(mapStateToPropsData, mapDispatchToPropsJWT)(JwtCheck)
