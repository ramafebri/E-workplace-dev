import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity} from 'react-native'
import UnderDevelopment from '../../image/UnderDevelopment.svg'
import Add from '../../image/add.svg'

export default class Meetings extends Component {
    addMeetings=()=>{
        alert("Under Development!");
    }
    render() {
        return (
            <View style={styles.container}>
                <UnderDevelopment width={150} heigth={150}/>
                <Text style={styles.text}>Feature is Under Development</Text>
                <TouchableOpacity activeOpacity={0.5} onPress={this.addMeetings} style={styles.TouchableOpacityStyle} >
                    <Add width={20} height={20}/>
                </TouchableOpacity>
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
    TouchableOpacityStyle:{ 
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 60/2,
        backgroundColor:'#265685',
        alignItems: 'center',
        justifyContent: 'center',
        right: 30,
        bottom: 30,
      },
  });