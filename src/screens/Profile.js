import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from '../components/Loading';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import deviceStorage from '../services/deviceStorage';
import { CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import { addLoading } from '../actions/DataActions';
import { deleteToken } from '../actions/JwtActions';
import { Card } from 'react-native-elements'
import Person from '../../image/person.svg'
import ProfileEdit from '../../image/profile-edit.svg'
import axios from 'axios';
import moment from 'moment';
import {Url_Clockin} from '../config/URL'

class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
        username: '',
        name:'Name',
        photoUri: null,
        loadingPhoto: false,
        monthYear : moment().format('MMMM YYYY'),
        refreshing : false,
        history:[],
        jobTitle:'',
      }

      AsyncStorage.getItem('photoprofile').then(response => {
        this.setState({
          loadingPhoto: true,
          photoUri: response
        });
      });

      this.deleteJWT = deviceStorage.deleteJWT.bind(this);
      this.LogOut = this.LogOut.bind(this);
      this.loadData = this.loadData.bind(this);
      this.movetoClockinHistory = this.movetoClockinHistory.bind(this);
      this.movetoOverworkForm = this.movetoOverworkForm.bind(this);
      this.ChoosePhotoProfile = this.ChoosePhotoProfile.bind(this);
  }

  async componentDidMount(){
    this.props.addLoad(true)
    this.loadData();
  }

  async loadData(){
    const username = await AsyncStorage.getItem('username');
    const name = await AsyncStorage.getItem('name');
    const jobTitle = await AsyncStorage.getItem('job_title');    
    const month = moment().format('MM');
    const year = new Date().getFullYear();

    this.setState({
      username : username,
      name : name,
      jobTitle : jobTitle
    })

    const headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer ' + this.props.tokenJWT
     };

     axios({
         method: 'GET',
         url: Url_Clockin+'?Username='+this.state.username+'&CheckIn='+year+'-'+month+'&NotState=Sick%20Leave&SortByDate=1',
         headers: headers,
       }).then((response) => { 
         console.log('Success: Get clock in data')    
         this.setState({
            history: response.data.slice(0,6)
         });
         this.props.addLoad(false)
       }).catch((errorr) => {
         console.log('Error: Get clock in data')       
         this.props.addLoad(false)
      });
    }

    async LogOut(){
      const value = await AsyncStorage.getItem('state');
      if(value === '1'){
        alert('You must clock out before log out!')
      }
      else if(value === '0'){
        this.deleteJWT();
        this.props.delete();
        await AsyncStorage.removeItem('user_permission');

        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('firstname');

        await AsyncStorage.removeItem('division');
        await AsyncStorage.removeItem('job_title');
        await AsyncStorage.removeItem('location');

        await AsyncStorage.removeItem('clockinHour');
        await AsyncStorage.removeItem('clockinMinute');
        await AsyncStorage.removeItem('id_user');

        this.props.navigation.dispatch(
          CommonActions.navigate({
            name: 'Login',
          })
        );
      }
    }

    ChoosePhotoProfile(){
      alert('Under Development!')
    }

    movetoClockinHistory(){
      this.props.navigation.navigate('ClockinHistory')
    }

    movetoOverworkForm(){
      this.props.navigation.navigate('OverworkForm')
    }

  render() {
          return(
            <SafeAreaView style={styles.container}>
              <ScrollView
                alwaysBounceVertical={true} 
                refreshControl={
                  <RefreshControl refreshing={this.state.refreshing} 
                onRefresh={this.loadData} />
              }>
                  <View style={styles.view1}>
                    <Card containerStyle={styles.card}>
                      <View style={{flexDirection:'row'}}>
                      <View style={{flex:3, paddingLeft:30}}>
                        <View style={styles.viewPhoto}>
                          <View style={{display:'flex'}}>
                            <View>
                              <Person width={70} height={70}/>
                            </View>
                          </View>
                        </View>
                        <Text style={styles.text2}>{this.state.name}</Text>
                        <Text style={styles.text3}>{this.state.jobTitle}</Text>
                      </View>
                      <View>
                        <TouchableOpacity style={{alignSelf:'flex-end', width:40, height:30, alignItems:'flex-end'}} onPress={this.ChoosePhotoProfile}>
                          <ProfileEdit width={25} height={25}/>
                        </TouchableOpacity> 
                      </View>
                     </View>     
                    </Card>
                  </View>
                  <View style={{ flexDirection:'row'}}>
                    <Card containerStyle={styles.dcard}>
                    <Text style={styles.text4}>Day Off</Text>
                     <View style={{flexDirection:'row'}}>
                       <Text style={styles.text5}>-</Text>
                       <Text style={styles.text6}>Days {'\n'}Remaining</Text>
                     </View>                 
                    </Card>
                    <Card containerStyle={styles.dcard}> 
                     <Text style={styles.text4}>Overtime</Text>
                     <View style={{flexDirection:'row'}}>
                       <Text style={styles.text5}>--</Text>
                       <Text style={styles.text7}>Hours</Text>
                     </View>
                  
                    </Card>
                    <Card containerStyle={styles.dcard}>
                      <TouchableOpacity onPress={this.movetoOverworkForm}>                   
                        <Text style={styles.text4}>Overtime</Text>
                        <Text style={styles.text4}>Form</Text>
                        <FontAwesome5 name='file-alt' size={20} color='#505050' style={{alignSelf:'flex-end', marginTop:'15%'}}/>
                      </TouchableOpacity>                
                    </Card>
                  </View>
                  <View style={{ width:'100%', alignSelf:'center'}}>
                    <Text style={styles.text8}>History</Text>
                    <Text style={styles.textMonth}>{this.state.monthYear}</Text>
                  </View>
                  <View style={styles.cardHistory} >
                      {this.state.history.map((u, i) => {
                        const clockinTime = moment(u.CheckIn).add(7, 'hours').format('YYYY-MM-DD hh:mm:ss A');
                        const clockoutTime = moment(u.CheckOut).add(7, 'hours').format('YYYY-MM-DD hh:mm:ss A');
                        const clockin = clockinTime.substr(11,5)+' '+clockinTime.substr(20,15)
                        var clockout = '';
                        if(clockoutTime.substr(11,5) === '07:00' && clockoutTime.substr(20,15) === 'AM'){
                            clockout = 'Now'
                        }
                        else{
                            clockout = clockoutTime.substr(11,5)+' '+clockoutTime.substr(20,15)
                        }
                          return (
                            <View key={i} style={styles.history}>
                                <View style={{flex:1, marginLeft:10, justifyContent:'center'}}>
                                    <Text style={styles.Text}>{u.CheckIn.substr(8,2)+' / '+u.CheckIn.substr(5,2) +' / '+u.CheckIn.substr(0,4)}</Text>
                                </View>
                                <View style={{flex:1, alignItems:'flex-end', marginRight:10, justifyContent:'center'}}>
                                    <Text style={styles.Text}>{clockin+'-'+clockout}</Text>
                                </View>
                            </View>
                          );
                        })
                      }
                      <Text style={[styles.textStatus,{display: this.state.history.length === 0 ? 'flex':'none'}]}>No History</Text>
                  </View>
                    <TouchableOpacity style={{width:'40%', alignSelf:'center'}} onPress={this.movetoClockinHistory}>
                       <Text style={styles.textVD}>View More History</Text>
                    </TouchableOpacity>
                  <TouchableOpacity style={styles.Button} onPress={this.LogOut}>
                      <Text style={styles.textLogOut}>Log Out</Text>
                  </TouchableOpacity>
                  <Loading visible={this.props.loading === true ? true : false}/>  
              </ScrollView>
            </SafeAreaView>           
      );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#F9FCFF',
  },
  view1:{
    flex:1
  },
  card:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, borderRadius:7,
  },
  viewPhoto:{
    backgroundColor:'#d4d4d4', width:100, height:100, alignSelf:'center', borderRadius:100/2, justifyContent:'center', alignItems:'center', marginTop:5 
  },
  dcard: {
    flex:1, borderWidth:1, borderColor:'#C1C1C1', borderRadius:7, flexWrap:'nowrap'
  },
  cardHistory: {
    padding: 0,
    borderRadius: 1,
    width:'93%',
    alignSelf:'center',
    marginTop:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    backgroundColor:'#FFFFFF',
    elevation: 0.5, 
    height:250, 
  },
  image:{
    width: 100, height: 100, borderRadius:100/2
  },
  textHistory:{
    color:'#505050', fontFamily:'Nunito-Light', fontSize:14
  },
  textLogOut: {
    color:'white', textAlign:'center', fontSize:20, fontFamily:'Nunito-SemiBold', fontWeight:'600',
  },
  Button: {
    backgroundColor:'#1A446D', marginTop:20, height:50, justifyContent:'center'
  },
  text1:{
    textAlign:'center', fontSize:15, fontFamily:'Nunito-Light', fontWeight:'300', color:'#505050', marginTop:20
  },
  text2:{
    textAlign:'center', fontSize:20, fontFamily:'Nunito-Bold', fontWeight:'600', color:'#505050', marginTop:5
  },
  text3:{
    textAlign:'center', fontSize:15, fontFamily:'Nunito-Light', fontWeight:'300',  color:'#505050',
  },
  text4:{
    fontSize: 16, fontFamily:'Nunito-Bold', fontWeight:'600',  color:'#505050',
  },
  text5:{
    fontSize: 38, fontFamily:'Nunito-Bold', fontWeight:'600', color:'#505050', marginTop:'5%'
  },
  text6:{
    fontSize:12, color: '#505050', justifyContent:'center', paddingLeft:'5%', paddingTop:'15%', fontFamily:'Nunito-Light', fontWeight:'300',
  },
  text7:{
    paddingLeft:'5%', paddingTop:'35%', fontSize:12, color: '#505050',fontFamily:'Nunito', fontWeight:'300',
  },
  text8:{
    fontFamily:'Nunito-SemiBold', fontSize:20, fontWeight:'600', color:'#505050', marginLeft:15
  },
  Text:{
    fontFamily:'Nunito-Light', fontSize:16, fontWeight:'600', color:'#505050', textAlignVertical:'center'
  },
  textMonth:{
    marginLeft:15, marginTop:10, fontSize:18, fontFamily:'Nunito-Bold', fontWeight:'600', color:'#265685'
  },
  textVD:{
    textAlign:'center', textAlignVertical:'center', fontFamily:'Nunito-Regular', fontSize:16, color:'#4A90E2', fontWeight:'600'
  },
  history:{
    height:40, borderBottomColor:'#505050', borderBottomWidth:0.5, justifyContent:'center', flexDirection:'row', width:'100%'
},
 textStatus:{
  fontFamily:'Nunito-SemiBold', fontSize:20, textAlign:'center', textAlignVertical:'center', marginTop:100, color:'#505050'
 }
})

const mapStateToPropsData = (state) => {
  return {
    loading : state.DataReducer.loading,
    tokenJWT: state.JwtReducer.jwt,
  }
}
const mapDispatchToPropsData = (dispatch) => {
  return {
    addLoad : (Loading) => dispatch(addLoading(Loading)),
    delete: () => dispatch(deleteToken())
  }
}
  
export default connect(mapStateToPropsData, mapDispatchToPropsData) (Profile)