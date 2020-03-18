import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, BackHandler} from 'react-native'
import UnderDevelopment from '../../image/UnderDevelopment.svg'
import Add from '../../image/add.svg'

export default class Meetings extends Component {
    constructor(props){
        super(props);
        this.state = {
          backPressed: 0,
        }
        this.onBack = this.onBack.bind(this);
      }

      componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
      }
      componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
      }  

    onBack = () => {
      this.setState({
        backPressed : this.state.backPressed + 1
      })

      if(this.state.backPressed % 2 === 1){
        this.props.navigation.goBack();
        return true;
      }
    };

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