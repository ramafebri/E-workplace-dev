import React, { Component } from 'react'
import { View, StyleSheet, ToastAndroid} from 'react-native'
import axios from 'axios';
import { Card, Button, Icon, Text } from 'react-native-elements'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CustomAlert from './CustomAlertComponent';

export default class CardApproval extends Component {
    constructor(props) {
        super(props);
        this.state = {
          detail: [],
          visible: false
        }
        this.onDetails = this.onDetails.bind(this);
        this.buttonApprove = this.buttonApprove.bind(this)
        this.buttonDecline = this.buttonDecline.bind(this)
    }
     
    onDetails = async () =>{
        const headers = {
            accept: '*/*',
        };
        axios({
          method: 'GET',
          url: 'https://absensiapiendpoint.azurewebsites.net/api/WorkFromHome/' + this.props.person.idWFH,
          headers: headers,
        }).then((response) => { 
          console.log(response)    
          this.setState({
            detail:response.data,
            visible: true
          });
        }).catch((errorr) => {
          alert(errorr)       
        });       
    };

    buttonDecline(){
        const headers = {
            accept: '*/*',
           'Content-Type': 'application/json'
        };
        axios({
          method: 'PUT',
          url: 'https://absensiapiendpoint.azurewebsites.net/api/WorkFromHome/' + this.props.person.idWFH,
          headers: headers,
          data : {
            approval : 'decline'
          }
        }).then((response) => { 
          console.log(response)    
          this.setState({
            visible: false
          });
          ToastAndroid.showWithGravity(
            'Decline success',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }).catch((errorr) => {
          alert(errorr)
          this.setState({
            visible: false
          });
          ToastAndroid.showWithGravity(
            'Decline fail',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );       
        });
    }

    buttonApprove(){
        const headers = {
            accept: '*/*',
           'Content-Type': 'application/json'
        };
        axios({
          method: 'PUT',
          url: 'https://absensiapiendpoint.azurewebsites.net/api/WorkFromHome/' + this.props.person.idWFH,
          headers: headers,
          data : {
            approval : 'accept'
          }
        }).then((response) => { 
          console.log(response)    
          this.setState({
            visible: false
          });
          ToastAndroid.showWithGravity(
            'Approve success',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }).catch((errorr) => {
          alert(errorr)
          this.setState({
            visible: false
          });
          ToastAndroid.showWithGravity(
            'Approve fail',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );       
        });
    }

    render() {
        return (
            // <View style={styles.mainContainer}>
            
                <View style={styles.viewContainer} >
                  <View style={{flex:1.3,borderBottomRightRadius: 70, borderTopRightRadius:70, borderTopLeftRadius:30, borderBottomLeftRadius:30, backgroundColor:'red', justifyContent:'center', alignItems:'center', height:110}}>
                    <FontAwesome5 name='map-marker' size={40} color='#FFFFFF'/>
                  </View>
                  <View style={styles.viewText}>
                    <Text style={styles.text}>
                        {this.props.person.name}
                    </Text>
                    <Text style={styles.text1}>
                        {this.props.person.state}
                        {this.props.person.idWFH}
                    </Text>
                  </View>
                
                  
                  <View style={{flex:1.4,justifyContent:'space-between'}}>
                  <Text style={styles.text2}>{this.props.date}</Text>
                      <Text style={styles.text3} onPress={this.onDetails}>View Details</Text>
                  </View>
                  <CustomAlert details={this.state.detail} visible={this.state.visible} decline={this.buttonDecline} approve={this.buttonApprove}/>
                </View>
            
        //     {/* 
        // </View>     */}
        )
    }
}

const styles = StyleSheet.create({
    container:{
        height:'100%',
       
        borderRadius: 25,
        padding:0,
        shadowColor: "#000",
        backgroundColor:'aqua',

        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
            
    },
    viewContainer:{
       flexDirection : 'row',
        backgroundColor:'white',
        borderRadius: 25, 
        paddingRight:'5%',
        marginVertical:8,
        marginHorizontal:12,
        flex:2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
        
    },
    viewText:{
        flex:3, justifyContent:'center', 
    },
    text:{
        fontWeight: 'bold', fontSize:20, paddingLeft:'6%'
    },
    text1:{
        marginBottom: 10, fontWeight: 'bold', fontSize:16, marginLeft:'6%'
    },
    text2:{
      fontSize: 16, fontWeight:'bold', color: 'grey', textAlignVertical:'top', textAlign:'left',paddingTop:10
    },
    text3:{
      fontSize: 14, color: 'grey', textAlignVertical:'bottom', textAlign:'left', paddingBottom:10
    },
    mainContainer: {
       justifyContent:'center'
      },
  })
