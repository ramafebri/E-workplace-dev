import React, { Component } from 'react'
import { View, StyleSheet, ToastAndroid, TouchableOpacity} from 'react-native'
import axios from 'axios';
import { Text } from 'react-native-elements'
import CustomAlert from './CustomAlertComponent';
import Coffee from '../../image/coffee.svg'
import Buildings from '../../image/buildings.svg'
import WFH from '../../image/wfh.svg'
import Sick from '../../image/first-aid.svg'
import moment from 'moment';
import {Url_Clockin} from '../config/URL'

export default class CardApproval extends Component {
    constructor(props) {
        super(props);
        this.state = {
          detail: [],
          date :'',
          visible: false,
        }
        
        this.onDetails = this.onDetails.bind(this);
        this.buttonApprove = this.buttonApprove.bind(this)
        this.buttonDecline = this.buttonDecline.bind(this)
    }

    componentDidMount(){    
      this.checkWorkStatus

      const dateApi = this.props.person.checkIn.substr(0, 10)
      var convertToMMDD = dateApi.split("-");
      var finalDate = moment(convertToMMDD, "YYYY/MM/DD").toString().substr(3, 7)

      this.setState({
        date : finalDate
      })
    }
     
    onDetails = async () =>{
        const headers = {
            accept: '*/*',
        };
        axios({
          method: 'GET',
          url: Url_Clockin + this.props.person.Id,
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
          url: Url_Clockin + this.props.person.Id,
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
          this.props.loadData;
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
          url: Url_Clockin + this.props.person.Id,
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
          this.props.loadData;
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
          <View style={styles.viewContainer} >
            <TouchableOpacity style={{height:'100%', width:'100%', flexDirection : 'row',}} onPress={this.onDetails}>
                    <View style={[styles.view1,{display: this.props.person.State === 'Work at client office' ? 'flex':'none'}]}>
                      <Buildings width={64} heigth={64}/>
                    </View>
                    <View style={[styles.view1,{display: this.props.person.State === 'Taking day off' ? 'flex':'none'}]}>
                      <Coffee width={64} heigth={64}/>
                    </View>
                    <View style={[styles.view1,{display: this.props.person.State === 'Work from home' ? 'flex':'none'}]}>
                      <WFH width={64} heigth={64}/>
                    </View>
                    <View style={[styles.view1,{display: this.props.person.State === 'Sick Leave' ? 'flex':'none'}]}>
                      <Sick width={64} heigth={64}/>
                    </View>
                    <View style={styles.viewText}>
                      <Text style={styles.text}>
                          {this.props.person.Name}
                      </Text>
                      <Text style={styles.text1}>
                          {this.props.person.State}
                      </Text>
                    </View>
                          
                    <View style={styles.view3}>
                        <Text style={styles.text2}>{this.state.date}</Text>
                        <Text style={styles.textViewDetails}>View Details</Text>
                    </View>
                  </TouchableOpacity>  
                  <CustomAlert details={this.state.detail} visible={this.state.visible} decline={this.buttonDecline} approve={this.buttonApprove}/>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    viewContainer:{    
        backgroundColor:'white',
        alignSelf:'center',
        borderRadius: 5, 
        marginVertical:8,
        marginHorizontal:12,
        height: 120,
        width:'90%',
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
      fontFamily:'Nunito-Bold', fontSize:20, color:'#505050', fontWeight:'600', paddingLeft:'6%', textAlignVertical:'center'
    },
    text1:{
        marginBottom: 10, fontFamily:'Nunito-Light', fontSize:18, color:'#505050', fontWeight:'300', marginLeft:'6%'
    },
    text2:{
      fontFamily:'Nunito-Light', fontSize:16, color:'#505050', fontWeight:'300', textAlignVertical:'top', textAlign:'right',paddingTop:10, marginRight:20
    },
    textViewDetails:{
    textAlign:'left', textAlignVertical:'center', fontFamily:'Nunito-Regular', fontSize:16, color:'#4A90E2', fontWeight:'300', lineHeight:16, paddingBottom:20
     },
    view1: {
      justifyContent:'center', flex:1.8, alignItems:'center'
    },
    view3: {
      flex:2,justifyContent:'space-between'
    },
  })
