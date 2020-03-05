import React, { Component } from 'react'
import { StyleSheet,Text, View,TouchableOpacity } from 'react-native'

export default class Button extends Component {
    render() {
        return (
            <View style={{alignItems:'center',justifyContent: 'center', flex: 0.5}}>
            <TouchableOpacity onPress={this.props.action}>
              <View style={styles.btn}>
              <Text style={{color:'white', fontFamily:'Roboto', fontSize:20}}>{this.props.value}</Text>
            </View>
            </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    btn: {
        width: 280,
        height: 45,
        position:'relative',
        borderRadius:15,
        backgroundColor: '#E74C3C',
        justifyContent: 'center',
        alignItems:'center',
        elevation: 1,
        
        
      },
});