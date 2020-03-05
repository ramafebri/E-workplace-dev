import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';

class IconButton extends Component {
    render() {
        return (
            <View style={styles.item1}>
                <TouchableOpacity>
                        <AntDesign name='form' size={40} color='#4A90E2' style={{alignSelf:'center'}} />
                        <Text style={{textAlign: 'center', paddingTop: 0, fontFamily: 'segoe ui'}}>Form 1</Text> 
                </TouchableOpacity>
            </View>
        )
    }
}


class CheckButton extends Component {
    render() {
        return (
            <View style={styles.item1}>
                <TouchableOpacity onPress={this.props.action}>
                    <View style={styles.button}>
                        <Text style={styles.buttontext} >{this.props.btntext}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
            itemrow: {
                flex: 1,
                flexDirection: 'row',
                
            },
            item1:{
                flex: 1,
                alignContent  : 'center',
                justifyContent: 'center',
                alignItems: 'center',
               
            },
            item2:{
                flex : 1,
                justifyContent: 'center',
                alignItems: 'center',
                alignItems: 'center',
                
            },

            button:{
                backgroundColor: '#ec407a'
            },
    menucard: {
        flex: 1,
       
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        opacity: 1,
        height: '48vh',
        width: '90vw',
        backgroundColor:'white',
        textAlign:'center',
        alignContent:'center',
        justifyContent: 'center',
        elevation: 1,
      },
      ava: {
      width: 90,
      height: 90,
      borderWidth: 4,
      borderColor: 'white',
      borderRadius: 100,
      alignSelf: 'flex-end',
      },
      nama:{
          fontSize: 20,
          color: 'white',
          justifyContent: 'center'
      },
      status:{
          fontSize: 20
      },
      pageheader: {
          fontFamily: 'D-Din',
          color: 'white',
          fontSize: 20,
          alignSelf: 'center',
          elevation: 1,
          padding: 18
      },
      checkbtn2:{
        width: 100,
        height: 100,
        borderRadius: 100/2,
        backgroundColor: '#ec407a',
        alignContent:'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 1,
        padding: 'auto'
      },
      checkbtn1:{
        width: 100,
        height: 100,
        borderRadius: 100/2,
        backgroundColor: '#F4D03F',
        alignContent:'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 1,
        padding: 'auto'
      },
      buttontext: {
          fontFamily: 'segoe ui',
          color : 'white',
          fontSize : 18
      }
      
})

export {CheckButton, IconButton}