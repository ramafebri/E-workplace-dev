import React, { Component } from 'react'
import {StyleSheet, Text, View } from 'react-native'

export default class Logo extends Component {
    render() {
        return (
            <View style={styles.circle2}>
            <Text style={{fontSize:46, color:'white', fontFamily:'segoe ui symbol'}}>E</Text>
              <View style={styles.circle}>
                <Text style={styles.logintext}>Workplace</Text>
              </View>
              </View>
        )
    }
}
const styles = StyleSheet.create({
logintext: {
    fontFamily: 'Segoe-ui',
    fontSize: 20,
    // fontVariant: 'body1',
    fontWeight: 'bold',
    color: '#4A90E2',
    position: 'absolute'
  },
  circle: {
    width: 150,
    height: 40,
    borderRadius: 80/2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems:'center',
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 1,
},
circle2:{
    width: 120,
    height: 120,
    borderRadius: 120/2,
    backgroundColor: 'transparent',
    borderColor:'white',
    borderWidth:3,
    justifyContent: 'flex-end',
    alignItems:'center',
    margin: 'auto',
    shadowColor: 'black',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 1,
  },
})