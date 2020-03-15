import React, { Component } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { addJWT } from '../actions/JwtActions';
import { addLoading } from '../actions/DataActions';
import Logo from '../../image/eworkplace.svg'
import { CommonActions } from '@react-navigation/native';

class SplashScreens extends Component {    
      componentDidMount() {
        this.loadJWT();
      }

      loadJWT = async () => {
        const userToken = await AsyncStorage.getItem('id_token');
        this.props.add(userToken)
        this.props.addLoad(true)

        // this.props.navigation.push(userToken ? 'Home' : 'Home');
        // this.props.navigation.dispatch( userToken ?
        //   CommonActions.navigate({
        //     name: 'HomeHD',
        //   })
        //   :
        //   CommonActions.navigate({
        //     name: 'Login',
        //   })
        // );
        // this.props.navigation.reset( userToken ?
        //   {
        //     index: 0,
        //     routes: [{ name: 'HomeHD' }],
        //   }
        //   :
        //   {
        //     index: 0,
        //     routes: [{ name: 'Login' }],
        //   }
        //   );
         this.props.navigation.push(userToken ? 'HomeHD' : 'Login');
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
    add: (userToken) => dispatch(addJWT(userToken))
  }
}

export default connect(mapStateToPropsData, mapDispatchToPropsData)(SplashScreens)
