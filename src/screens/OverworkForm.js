import React, { Component } from 'react'
import { Text, View, StyleSheet, BackHandler } from 'react-native'
import UnderDevelopment from '../../image/UnderDevelopment.svg'

export default class OverworkForm extends Component {
  constructor(props){
    super(props);
    this.onBack = this.onBack.bind(this);
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.onBack);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }  

  onBack = () => {
      this.props.navigation.goBack();
      return true;
  };

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