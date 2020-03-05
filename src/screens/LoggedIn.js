import React, { Component } from 'react';
import { View, StyleSheet, Alert, BackHandler, SafeAreaView, ScrollView, ActivityIndicator,RefreshControl, ToastAndroid, Text, TouchableOpacity, Image } from 'react-native';
import { Loading } from '../components/Loading';
import deviceStorage from '../services/deviceStorage';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import { connect } from 'react-redux';
import { addNama, addLocation, addStatusClockin, addLoading } from '../actions/DataActions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {ApiMaps} from '../config/apiKey'
import { Card } from 'react-native-elements'

class LoggedIn extends Component {
  _isMounted = false;
  constructor(props){
    super(props);
    this.state = {
        loadingCheckin: false,
        idUser:'',
        username: '',
        fullname:'',
        status:'Work at Office',
        Location:'',
        statusCheckInn:'You have not clocked in yet!',
        clockInstatus: true,
        url: 'https://absensiapiendpoint.azurewebsites.net/api/absensi',
        refreshing : false,
        textButton:'',
      }
      this.checkIn = this.checkIn.bind(this);
      this.checkOut = this.checkOut.bind(this);
      this.onBack = this.onBack.bind(this);
      this.onRefresh = this.onRefresh.bind(this);
      this.loadData = this.loadData.bind(this);
      this.findCoordinates = this.findCoordinates.bind(this);
      this.checkClockInStatus = this.checkClockInStatus.bind(this);
      this.deleteStatusClockIn = this.deleteStatusClockIn.bind(this);
      this.checkClockInDouble = this.checkClockInDouble.bind(this)
      this.gotoApprovalPage = this.gotoApprovalPage.bind(this);
      this.movetoWAC = this.movetoWAC.bind(this);
      this.movetoWFH = this.movetoWFH.bind(this);
      this.ButtonCheck = this.ButtonCheck.bind(this)
    }

    async componentDidMount() {
      this.props.addLoad(true)
      this.intervalID = setInterval( () => {
        this.setState({
          hour : moment().format('hh:mm a'),
          day : moment().format('dddd'),
          monthYear : moment().format('D MMMM YYYY'),
        })
      },1000)

      this.checkClockInDouble()
      this.checkClockInStatus();
      this.findCoordinates();
      this.loadData();
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    async checkClockInStatus(){
      const value = await AsyncStorage.getItem('clockin_state');
        if(value === 'clockin'){
          this.props.addClockin(true, ' ', this.state.idUser, this.state.status)
          this.setState({
            textButton:'Clock Out'
          })
        }else{
          this.props.addClockin(false, this.state.statusCheckInn, this.state.idUser, this.state.status)
          this.setState({
            textButton:'Clock In'
          })
        }     
    }

    async checkClockInDouble(){
      var time = new Date().getHours();
        if(time > 6 && time < 12){
        this.deleteStatusClockIn();
        }
    }

    onRefresh = () =>{
      this.setState({
        refreshing : true
      })  
      this.setState({
        hour : moment().format('hh:mm a'),
        day : moment().format('dddd'),
        monthYear : moment().format('MMM Do YYYY'),
      })

      this.checkClockInDouble();
      this.checkClockInStatus();
      this.findCoordinates();
      this.loadData();
      this.setState({
        refreshing : false
      })
    }

    loadData = async () => {     
      const headers = {
       accept: 'application/json',
      'Authorization': 'Bearer ' + this.props.tokenJWT 
      };

      axios({
          method: 'GET',
          url: 'https://userabensiendpoint.azurewebsites.net/v1/me',
          headers: headers,
        }).then((response) => { 
          //alert(response)    
          this.setState({
            username: response.data.data.username,
            fullname: response.data.data.profile.firstname + ' ' + response.data.data.profile.lastname,
          });
          this.props.addName(this.state.username, this.state.fullname)
          this.props.addLoad(false)
        }).catch((errorr) => {
          //alert(errorr)       
            this.setState({
              error: 'Error retrieving data',
            });
            this.props.addLoad(false)
          });
      };

    findCoordinates = async () => {
      Geolocation.getCurrentPosition(
        position => {
          Geocoder.init('AIzaSyA5wKOId22uPu5jTKhTh0LpF3R5MRpmjyw');
          Geocoder.from(position.coords.latitude, position.coords.longitude)
            .then(json => {
              // if(this._isMounted){
                console.log(json);
                var addressComponent = json.results[1].address_components[0].long_name;
                this.setState({
                  Location: addressComponent
                })
                console.log(addressComponent);
              //}          
            })
          .catch(error => console.warn(error));
          this.props.addLoc(this.state.Location)
        },
        error => Alert.alert(error.message),
        { enableHighAccuracy: true, timeout: 50000, maximumAge: 1000 }
      );       
     };

  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.intervalID);
    BackHandler.removeEventListener('hardwareBackPress', this.onBack)
  }

 async ButtonCheck(){
  const value = await AsyncStorage.getItem('state');
   if(value === '1'){
    this.checkOut()
   }
   else if(value === '0'){
    this.checkIn()
   }
 }  

 async checkIn(){
  this.props.addLoad(true) 
  const value = await AsyncStorage.getItem('clockin_state2');
  if(value === 'clockin'){
    Alert.alert(
      'You have clock in today!','Your next clock in will be start tomorrow at 07.00 AM',
      [
        { text: "OK", onPress: () => console.log('OK'), style: "cancel"},
      ],
      { cancelable: false },
    );
    this.props.addLoad(false)
    return true;   
  } 
  else{
    axios({
      method: 'POST',
      url: this.state.url,
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      data: {
        username: this.state.username,
        name: this.state.fullname,
        checkIn: new Date(),
        state: this.state.status,
        location : this.state.Location,
      }
    }).then((response) => {
      console.log(response)
      this.setState({
        statusCheckInn: ' ',
        idUser: response.data.absenceId,
        clockInstatus: true,
        textButton: 'Clock Out'
      });
      this.props.addLoad(false)
      this.props.addClockin(this.state.clockInstatus, this.state.statusCheckInn, this.state.idUser, this.state.status)
      ToastAndroid.showWithGravity(
        'Clock in success',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      deviceStorage.saveItem("state", '1');
      deviceStorage.saveItem("clockin_state", "clockin");
      deviceStorage.saveItem("id_user", JSON.stringify(this.state.idUser));
    })
    .catch((errorr) => {
      console.log(errorr)
      this.props.addLoad(false)
      ToastAndroid.showWithGravity(
        'Clock in fail',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
   });
  } 
}

 async checkOut(){
  this.props.addLoad(true)
  const value = await AsyncStorage.getItem('id_user');
  const id = parseInt(value);
    axios({
      method: 'put',
      url: this.state.url + '/' + id,
      headers: { 'accept' : '*/*',
      'Content-Type' : 'application/json'},
      data : {
        checkOut : new Date()
      }
    }).then(data => {
      this.setState({
        statusCheckInn: 'You have not clocked in!',
        clockInstatus: false,
        textButton: 'Clock In'
      });
      this.props.addLoad(false)
      this.props.addClockin(this.state.clockInstatus, this.state.statusCheckInn)
      deviceStorage.saveItem("state", '0');
      deviceStorage.saveItem("clockin_state2", "clockin");
      deviceStorage.deleteClockInStatus();
      ToastAndroid.showWithGravity(
        'Clock out success',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }).catch(err => {
        this.props.addLoad(false)
        console.log(err);
        ToastAndroid.showWithGravity(
          'Clock out fail',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
    });
  }

 onBack = () => {
    Alert.alert(
      'Exit from the app?','',
      [
        { text: "Yes", onPress: () => BackHandler.exitApp() },
        { text: "No", onPress: () => console.log('NO Pressed'), style: "cancel" },
      ],
      { cancelable: false },
    );
    return true;
 };

 movetoWFH(){
  this.props.navigation.navigate('WHome')
 }

 movetoWAC(){
  this.props.navigation.navigate('WClient')
}

 async deleteStatusClockIn(){
  await AsyncStorage.removeItem('clockin_state2')
 }

 gotoApprovalPage(){
  this.props.navigation.navigate('Approval')
 }

  render() {
    const loadings = this.props.loading
      return(
          <SafeAreaView style={{backgroundColor:'#F9FCFF'}}>
            <ScrollView
              alwaysBounceVertical={true} 
              refreshControl={
                <RefreshControl refreshing={this.state.refreshing} 
              onRefresh={this.onRefresh} />
            }>
              <View style={{marginLeft:'5%'}}>
                <Text style={styles.textUsername}>Hi, {this.state.username}!</Text>
                <View style={styles.view1}>
                  <FontAwesome5 name='map-marker-alt' size={16} color='#E74C3C'/> 
                  <Text style={styles.textLocation}>{this.state.Location}</Text>
                </View>
              </View>

              <View style={{ flex:1,}}>
                <Card containerStyle={styles.card4}>
                  <Text style={styles.textHour}>
                    {this.state.hour}
                  </Text>
                  <Text style={styles.textDay}>
                    {this.state.day}, {this.state.monthYear}
                  </Text>
                  <View>
                    <TouchableOpacity style={[this.props.clockin_status === false ? styles.buttonClockIn : styles.buttonClockOut]} onPress={this.ButtonCheck}>
                      <Text style={styles.textClockin}>{this.state.textButton}</Text>
                    </TouchableOpacity>
                    <Text style={[styles.textStatus]}>{this.props.status_Checkin}</Text>
                  </View>
                </Card>
              </View>

              <View style={{flexDirection:'row', flex:0.5, marginTop:36}}>
                <View style={{width:'50%', flex:1}}>
                  <Card containerStyle={styles.card4}>
                    <TouchableOpacity style={{flexDirection:'row', padding:0}} onPress={this.movetoWFH}>
                    <Image source={require('../../image/homeicon.png')}/> 
                    <Text style={styles.text1}>Work From {'\n'}Home</Text>
                    </TouchableOpacity>
                  </Card>
                </View>
                <View style={{width:'50%', flex:1}}>
                  <Card containerStyle={styles.card4}>
                    <TouchableOpacity style={{flexDirection:'row', paddingBottom:3}} onPress={this.movetoWAC}>
                    <Image source={require('../../image/buildings1.png')}/> 
                    <Text style={styles.text1}>Work At {'\n'}Client Office</Text>
                    </TouchableOpacity>
                  </Card>
                </View>            
              </View> 

              <View style={{ flex:3, paddingBottom:'5%'}}>
              <Text style={styles.textDashboard}>Dashboard</Text>
                <Card containerStyle={styles.card1}>
                  <TouchableOpacity style={styles.baseTouchAble}>
                    <Text style={styles.text2}>Meeting</Text>
                    <Text style={styles.text3}>Scrum Meetings</Text>
                    <View style={styles.viewInCard1}>
                      <FontAwesome5 name='map-marker-alt' size={16} color='#505050'/>
                      <Text style={styles.text4}>Meeting Room A, Moonlay Office</Text>
                    </View>
                    <Image style={{width: '100%'}} source={require('../../image/line.png')}/>
                    <View style={styles.view2InCard1}>
                      <View style={{flex:3, flexDirection:'row'}}>
                        <FontAwesome5 name='clock' size={16} color='#505050'/>
                        <Text style={styles.text5}>02.00 PM</Text>
                      </View>
                      <View style={{flex:3}}>
                      <Text style={styles.textViewDetails}>View Details</Text>
                      </View>                     
                    </View> 
                  </TouchableOpacity>
                </Card>


                <Card containerStyle={styles.card2}>
                  <TouchableOpacity style={styles.baseTouchAble}>
                    <Text style={styles.text2}>Ongoing Task</Text>
                    <View style={styles.viewInCard2}>
                      <FontAwesome5 name='circle' size={8} color='#505050' solid/>
                      <Text style={styles.text6}>Task 01 - 25 Feb 2020</Text>
                    </View>
                    <View style={styles.viewInCard2}>
                      <FontAwesome5 name='circle' size={8} color='#505050' solid/>
                      <Text style={styles.text6}>Task 01 - 25 Feb 2020</Text>
                    </View>
                    <View style={styles.viewInCard2}>
                      <FontAwesome5 name='circle' size={8} color='#505050' solid/>
                      <Text style={styles.text6}>Task 01 - 25 Feb 2020</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <View style={{flex:3}}>
                        <Text style={styles.text6}>...</Text>
                      </View>
                      <View style={{flex:3}}>
                        <Text style={styles.textViewDetails}>View Details</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Card>
                
                <Card containerStyle={styles.card3}>
                  <TouchableOpacity style={styles.baseTouchAble}>
                  <Text style={styles.text2}>Task Done</Text>
                    <View style={styles.viewInCard2}>
                      <FontAwesome5 name='circle' size={8} color='#505050' solid/>
                      <Text style={styles.text6}>Task 01 - 25 Feb 2020</Text>
                    </View>
                    <View style={styles.viewInCard2}>
                      <FontAwesome5 name='circle' size={8} color='#505050' solid/>
                      <Text style={styles.text6}>Task 01 - 25 Feb 2020</Text>
                    </View>
                    <View style={styles.viewInCard2}>
                      <FontAwesome5 name='circle' size={8} color='#505050' solid/>
                      <Text style={styles.text6}>Task 01 - 25 Feb 2020</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <View style={{flex:3}}>
                        <Text style={styles.text6}>...</Text>
                      </View>
                      <View style={{flex:3}}>
                        <Text style={styles.textViewDetails}>View Details</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Card>        
          </View>
              <Loading visible={loadings === true ? true : false}/>               
            </ScrollView>
          </SafeAreaView>
        );
      }
  }

const styles = StyleSheet.create({
  textUsername:{
    fontFamily:'Nunito-Bold', fontWeight:'600', fontSize:18
  },
  view1:{
    flexDirection:'row', alignItems:'center', alignContent:'center'
  },
  textLocation:{
    fontFamily:'Nunito', fontWeight:'300', fontSize:16, textAlignVertical:'top'
  },
  textHour:{
    color:'#265685', fontFamily:'Nunito', fontSize:38, fontWeight:'600', textAlign:'center'
  },
  textDay:{
    textAlign:'center', fontFamily:'Nunito', fontSize:18, fontWeight:'600'
  },
  buttonClockIn:{
    backgroundColor:'#26BF64', width:'90%', alignSelf:'center', height:'45%',justifyContent:'center', marginTop:10, borderRadius:10
  },
  buttonClockOut:{
    backgroundColor:'#EA5656', width:'90%', alignSelf:'center', height:'45%',justifyContent:'center', marginTop:10, borderRadius:10
  },
  textClockin:{
    textAlign:'center', textAlignVertical:'center', color:'#FFFFFF', fontFamily:'Nunito', fontSize:22
  },
  textStatus:{
    textAlign:'center', textAlignVertical:'center', fontFamily:'Nunito', fontSize:12, marginTop:10,
  },
  text1:{
    textAlign:'left', textAlignVertical:'center', fontFamily:'Nunito', fontSize:15, fontWeight:'600', marginLeft:5
  },
  textDashboard:{
    marginLeft:'4%', marginTop:'4%', fontFamily:'Nunito', fontSize:18, fontWeight:'600',
  },
  card1:{
    flex:1, borderRadius:7,borderWidth:5, borderStartColor:'#DB984A', borderLeftColor:'#FFFFFF', borderRightColor:'#FFFFFF', borderEndColor:'#FFFFFF', borderTopColor:'#FFFFFF', borderBottomColor:'#FFFFFF', shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5, 
   },
   baseTouchAble:{
    flexWrap:'wrap', padding:0, height:'100%', width:'100%',
   },
   text2:{
    textAlign:'left', textAlignVertical:'center', fontFamily:'Nunito', fontSize:14, color:'#505050', fontWeight:'300', marginLeft:5
   },
   text3:{
    textAlign:'left', textAlignVertical:'center', fontFamily:'Nunito', fontSize:16, color:'#505050', fontWeight:'600', marginLeft:5
   },
   viewInCard1:{
    flexDirection:'row', paddingTop:10, marginLeft:5, paddingBottom:10, alignContent:'center', alignItems:'center'
   },
   view2InCard1:{
    flexDirection:'row', paddingTop:10, marginLeft:5, paddingBottom:10, alignContent:'center', alignItems:'center'
   },
   text4:{
    marginLeft:10, textAlign:'left', textAlignVertical:'center', fontFamily:'Nunito', fontSize:14, color:'#505050', fontWeight:'300',
   },
   text5:{
    marginLeft:10, textAlign:'left', textAlignVertical:'center', fontFamily:'Nunito', fontSize:14, color:'#505050', fontWeight:'300',
   },
   textViewDetails:{
    marginLeft:10, textAlign:'right', textAlignVertical:'center', fontFamily:'Nunito', fontSize:14, color:'#4A90E2', fontWeight:'300',
   },
   card2:{
    flex:1, borderRadius:7,borderWidth:5,borderStartColor:'#4A90E2', borderLeftColor:'#FFFFFF', borderRightColor:'#FFFFFF', borderEndColor:'#FFFFFF', borderTopColor:'#FFFFFF', borderBottomColor:'#FFFFFF',shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  elevation: 5,
   },
   viewInCard2:{
    flexDirection:'row', marginTop:10, marginLeft:5, alignContent:'center', alignItems:'center'
   },
   text6:{
    marginLeft:10, textAlign:'left', textAlignVertical:'center', fontFamily:'Nunito', fontSize:16, color:'#505050', fontWeight:'600',
   },
   card3:{
    backgroundColor:'#EFFFF6', flex:1, borderRadius:7,borderWidth:5,borderStartColor:'#26BF64', borderLeftColor:'#FFFFFF', borderRightColor:'#FFFFFF', borderEndColor:'#FFFFFF', borderTopColor:'#FFFFFF', borderBottomColor:'#FFFFFF', shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
   },
   card4:{
    borderRadius:7,
    maxHeight:'150%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
   },
   card5:{
     flex:1, alignItems:'flex-start', backgroundColor:'white'
   },
});

const mapStateToPropsData = (state) => {
  console.log(state);
  return {
    tokenJWT: state.JwtReducer.jwt,
    nameUser: state.DataReducer.username,
    namee: state.DataReducer.fullname,
    userLocation: state.DataReducer.locations,
    clockin_status : state.DataReducer.clockIn,
    status_Checkin : state.DataReducer.statusCheckIn,
    id : state.DataReducer.id,
    workStatus :  state.DataReducer.workStatus,
    loading : state.DataReducer.loading
  }
}
const mapDispatchToPropsData = (dispatch) => {
  return {
    addName: (username, fullname) => dispatch(addNama(username, fullname)),
    addLoc: (Location) => dispatch(addLocation(Location)),
    addLoad : (Loading) => dispatch(addLoading(Loading)),
    addClockin : (clockInstatus, statusCheckInn, idUser, status) => dispatch(addStatusClockin(clockInstatus, statusCheckInn, idUser, status))
  }
}
  
export default connect(mapStateToPropsData, mapDispatchToPropsData)(LoggedIn)