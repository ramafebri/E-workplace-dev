import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Card } from 'react-native-elements'
import Coffee from '../../image/coffee.svg'
import Aid from '../../image/first-aid.svg'

export default class Leave extends Component {
    constructor(props){
        super(props);
          this.moveToDayOff = this.moveToDayOff.bind(this);
          this.moveToSick = this.moveToSick.bind(this)
        }
    moveToDayOff(){
      this.props.navigation.navigate('DayOff')
    }

    moveToSick(){
      this.props.navigation.navigate('Sick')
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={{flex:1, marginLeft:25}}>
                    <Text style={styles.text2}>
                        Leave
                    </Text>
                </View>
                <View style={{flex:15, flexDirection:'row',alignSelf:'center'}}>
                    <Card containerStyle={styles.card}>
                    <TouchableOpacity style={styles.Button} onPress={this.moveToDayOff}>
                        <Coffee width={70} height={70} />
                        <Text style={styles.text}>Taking Day Off</Text>
                    </TouchableOpacity>
                    </Card>
                    <Card containerStyle={styles.card}>
                    <TouchableOpacity style={styles.Button} onPress={this.moveToSick}>
                        <Aid width={70} height={70}/>
                        <Text style={styles.text}>Sick Leave</Text>
                    </TouchableOpacity>
                    </Card>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:'#F9FCFF',
    },
    card:{
        width:160, height:160, justifyContent:'center', alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        borderRadius:7,
    },
    Button:{
        justifyContent:'center',
        alignItems:'center',
        width:'100%',
        height:'100%',
    },
    text:{
        fontFamily:'Nunito-Bold', fontSize:16, fontWeight:'600', marginLeft:5,  color:'#505050', paddingTop:13
    },
    text2:{
        fontFamily:'Nunito-Bold', fontSize:20, fontWeight:'600', marginLeft:5,  color:'#505050', paddingTop:13
    }
})