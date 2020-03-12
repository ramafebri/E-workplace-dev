import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import UnderDevelopment from '../../image/UnderDevelopment.svg'

export default class Task extends Component {
    render() {
        return (
            <View style={styles.container}>
                <UnderDevelopment width={150} heigth={150}/>
                <Text style={styles.text}>Feature is Under Development</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      justifyContent: 'center',
      alignItems:'center'
    },
    text:{
      fontFamily:'Nunito-SemiBold',
      fontSize: 20,
      textAlign:'center',
      textAlignVertical:'center',
      color:'#265685'
    },
  });