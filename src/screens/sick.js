import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity, BackHandler,Picker, TextInput, ToastAndroid, RefreshControl, SafeAreaView, ScrollView } from 'react-native'
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import deviceStorage from '../services/deviceStorage';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native';
import {ApiMaps} from '../config/apiKey'
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { addStatusClockin, addLoading } from '../actions/DataActions';
import {Url_Clockin, Url_GetListHD} from '../config/URL'

//Sick Form
class Sick extends Component {
    constructor(props){
        super(props);
        this.state = {
            idUser : '',
            fullname :'',
            username:'',
            photo: null,
            Location:'',
            permission: null,
            message:'',
            status: 'Sick Leave',
            headDivision: '',
            projectName :'',
            clockInstatus: false,
            statusCheckInn: 'You have clocked in!',
            refreshing: false,
            backPressed: 0,
            listHD: [],
          }
        this.findCoordinates = this.findCoordinates.bind(this);
        this.onBack = this.onBack.bind(this);
        this.loadData = this.loadData.bind(this);
        this.submitAll = this.submitAll.bind(this);
      }
  
      componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
        this.loadData();
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

     loadData = async () => {     
      const username = await AsyncStorage.getItem("username");  
      const name = await AsyncStorage.getItem("name");
      const location = await AsyncStorage.getItem("location");
      const division = await AsyncStorage.getItem("division");
      const user_permission = await AsyncStorage.getItem('user_permission');
      const permission = parseInt(user_permission);

        this.setState({
          username : username,
          fullname : name,
          Location : location,
          permission : permission
        })
        axios({
          method: 'GET',
          url: Url_GetListHD + division,
          headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer ' + this.props.tokenJWT
          },
        }).then((response) => {
          console.log('Success: Get list Head Division')
          this.setState({
            listHD: response.data.data
          });
        })
        .catch((errorr) => {
          console.log('Error: Get list Head Division')
          console.log(errorr)
        });
      };

      async submitAll(){
        const value = await AsyncStorage.getItem('clockin_state2');
        const location = await AsyncStorage.getItem('location');
        const sickValue = await AsyncStorage.getItem('sick_submit');

        if(this.props.clockin_status === true || value === 'clockin'){
          Alert.alert(
            "You can't submit!",'You have clocked in today, your next submit will be start tomorrow at 07.00 AM',
            [
              { text: "OK", onPress: () => console.log('OK'), style: "cancel"},
            ],
            { cancelable: false },
          );
          this.props.addLoad(false)
          return true;
        }
        else if(this.state.headDivision === '' || this.state.projectName === '' || this.state.message === ''){
          alert('All form must be filled!');
        }
        else if(sickValue === '1'){
          Alert.alert(
            "You can't submit!",'You have submitted sick form today. Your next submit will be start tomorrow at 07.00 AM',
            [
              { text: "OK", onPress: () => console.log('OK'), style: "cancel"},
            ],
            { cancelable: false },
          );
          this.props.addLoad(false)
          return true;
        }
        else if(location === null || location === ''){
          Alert.alert(
            'Location is nowhere','You must enable your location before clock in!',
            [
              { text: "OK", onPress: () => console.log('OK'), style: "cancel"},
            ],
            { cancelable: false },
          );
          this.props.addLoad(false)
          return true; 
        }
        else if(this.state.headDivision !== '' && this.state.projectName !== '' && this.props.clockin_status === false && this.state.message !== ''){
          axios({
            method: 'POST',
            url: Url_Clockin,
            headers: {
              'accept': 'application/json',
              'Authorization': 'Bearer ' + this.props.tokenJWT
            },
            data: {
              Username: this.state.username,
              Name: this.state.fullname,
              CheckIn: new Date(),
              State: this.state.status,
              Location : this.state.Location,
              Approval : 'Pending',
              ApprovalByAdmin : 'Pending',
              HeadDivision: this.state.headDivision,
              ProjectName: this.state.projectName,
              Note: this.state.message
            }
          }).then((response) => {
            console.log('Success: Submit sick data')
            this.props.addClockin(false, ' ', this.state.idUser, this.state.status);
            this.setState({
              idUser: response.data.Id,
            });
            deviceStorage.saveItem("sick_submit", "1");
            deviceStorage.saveItem("sick_submit_day", moment().format('dddd'));

            this.props.addLoad(true)
            if(this.state.permission === 1){
              this.props.navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    { name: 'HomeHD' },
                  ],
                })
              )
            }
            else if(this.state.permission === 2){
              this.props.navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    { name: 'Home' },
                  ],
                })
              )
            }
            ToastAndroid.showWithGravity(
              'Submit success!',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          })
          .catch((errorr) => {
            console.log('Error: Submit sick data')
            ToastAndroid.showWithGravity(
              'Submit fail!',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
        });
        }       
      }

      findCoordinates = () => {
        Geolocation.getCurrentPosition(
          position => {
            Geocoder.init(ApiMaps);
            Geocoder.from(position.coords.latitude, position.coords.longitude)
              .then(json => {
                  console.log('Success: Get user location');
                  var array = [];
                  var addressComponent = json.results[0].formatted_address;
  
                  for( var i = 0; i < addressComponent.length; i++){
                    if(addressComponent[i] !== ','){
                        array.push(addressComponent[i]);
                    }
                    else{
                      break;
                    }
                  }
  
                  var fixAddress = array.join('').toString();
  
                  this.setState({
                    Location: fixAddress
                  })
                  deviceStorage.saveItem("location", this.state.Location);
                  console.log(addressComponent);       
              })
            .catch(error => console.warn('Error: Get user location'));
          },
          error => Alert.alert(error.message),
          { enableHighAccuracy: true, timeout: 50000, maximumAge: 1000 }
        );
	  };

    render() {
        return (
            <SafeAreaView style={styles.container2}>
              <ScrollView
                alwaysBounceVertical={true} 
                refreshControl={
                <RefreshControl refreshing={this.state.refreshing} 
                onRefresh={this.findCoordinates} />
              }>
              <View style={{flex:8}}>
                <Text style={styles.textareaContainer}>
                    Please fill this forms
                </Text>
                <Text style={styles.textSM}>
                    Select Your Head Division *
                </Text>

                <View style={styles.viewPicker}>            
                  <Picker
                    mode={"dropdown"}
                    selectedValue={this.state.headDivision}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({
                        headDivision: itemValue
                      })
                    }>
                    <Picker.Item label='' value=''/>
                    {this.state.listHD.map((u,i) => {
                      return (<Picker.Item key={i} label={u.profile.firstname+' '+u.profile.lastname} value={u.username}/>);
                      })
                    }
                  </Picker>
                </View>

                <Text
                  style={styles.textSM}>
                    Project Name *
                </Text>
                <TextInput
                  style={styles.inputText}
                  maxLength={40}
                  onChangeText={text => this.setState({projectName: text})}
                  value={this.state.projectName}>
                </TextInput>

                <Text
                  style={styles.textSM}>
                    Notes *
                </Text>
                <TextInput
                    multiline={true}
                    placeholder="tell us about your health issue"
                    maxLength={200} 
                    style={styles.textInput}
                    onChangeText={text => this.setState({message: text})}
                    value={this.state.message}>
                </TextInput>
                </View>

                <View style={{flex:1, marginTop:30}}>
                  <TouchableOpacity onPress={this.submitAll} style={styles.buttonSubmit}>
                      <Text style={styles.textbtnSubmit} >Submit</Text>
                  </TouchableOpacity>
                </View>
                
            </ScrollView>
          </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
  container2:{
    flex:1, backgroundColor:'#F9FCFF'
  },
  textareaContainer: {fontSize:20, marginLeft:21, fontWeight:'600', fontFamily:'Nunito-SemiBold', color:'#505050', paddingTop:10},
   textSM:{
    marginTop: 16,
    marginBottom:10,
    paddingLeft:20,
    fontSize:16,
    fontWeight:'300', fontFamily:'Nunito-Light'
  },
  viewPicker:{
    width:'90%', height:50, marginLeft:20, borderRadius:5, borderColor:'#505050', borderWidth:1, backgroundColor:'white'
  },
  picker:{
    height: '100%', width: '100%', borderWidth:20, borderColor:'#505050'
  },
  textInput:{
    paddingLeft:10, paddingRight:10,height:200, borderColor: '#505050', textAlignVertical: 'top', borderWidth: 1, marginLeft:20, borderColor:'#505050', width:'90%', borderRadius:5, backgroundColor:'white', fontSize:18
  },
  buttonSubmit:{
    backgroundColor:'#1A446D', marginTop:30, alignItems:'center', width:'90%', height:50, alignSelf:'center', borderRadius:5
  },
  textbtnSubmit:{
    color:'white', fontSize: 20, fontWeight:'600', textAlign:'center',textAlignVertical: "center", flex:1, fontFamily:'Nunito-SemiBold', marginBottom:7 
  },
  inputText:{
    textAlignVertical: 'top', borderWidth: 1, borderRadius:5, width:'90%', height:50, marginLeft:20, backgroundColor:'white', fontSize:18, fontFamily:'Nunito', fontWeight:'600', paddingLeft:10, paddingRight:10,
    borderColor:'#505050', fontFamily:'Nunito-Regular', fontWeight:'600' 
  },
});

const mapStateToPropsData = (state) => {
  console.log(state);
  return {
    tokenJWT: state.JwtReducer.jwt,
    clockin_status : state.DataReducer.clockIn,
  }
}
const mapDispatchToPropsData = (dispatch) => {
  return {
    addLoad : (Loading) => dispatch(addLoading(Loading)),
    addClockin : (clockInstatus, statusCheckInn, idUser, status) => dispatch(addStatusClockin(clockInstatus, statusCheckInn, idUser, status))
  }
}

export default connect(mapStateToPropsData, mapDispatchToPropsData)(Sick)
