import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity, BackHandler,Picker, TextInput, ToastAndroid, RefreshControl, SafeAreaView, ScrollView } from 'react-native'
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import deviceStorage from '../services/deviceStorage';
import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/native';
import {ApiMaps} from '../config/apiKey'
import axios from 'axios';
import { connect } from 'react-redux';
import { addStatusClockin, addLoading } from '../actions/DataActions';

class sick extends Component {
    constructor(props){
        super(props);
        this.state = {
            idUser : '',
            fullname :'',
            username:'',
            photo: null,
            Location:'',
            message:'',
            status: 'Sick Leave',
            scrumMaster: '',
            projectName :'',
            clockInstatus: false,
            statusCheckInn: 'You have clocked in!',
            refreshing: false,
          }
        this.findCoordinates = this.findCoordinates.bind(this);
        this.submitAll = this.submitAll.bind(this);
        this.onBack = this.onBack.bind(this);
        this.loadData = this.loadData.bind(this)
      }
  
      componentDidMount(){
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBack);
        this.findCoordinates()
      }
      componentWillUnmount() {
          this.backHandler.remove();
      }

      onBack = () => {
        this.props.navigation.goBack();
        return true;
     };

     loadData = async () => {     
      const username = await AsyncStorage.getItem('username');  
      const name = await AsyncStorage.getItem('name');
      const location = await AsyncStorage.getItem('location');
      this.setState({
        username : username,
        name : name,
        Location : location
      })
      };

      async submitAll(){
        const value = await AsyncStorage.getItem('clockin_state2');
        if(this.props.clockin_status === false || value === 'clockin'){
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
        else if(this.state.scrumMaster === '' || this.state.projectName === ''){
          alert('All form must be filled!');
        }
        else if(this.state.scrumMaster !== '' && this.state.projectName !== '' && this.props.clockin_status === true){
          axios({
            method: 'POST',
            url: 'https://absensiapiendpoint.azurewebsites.net/api/absensi',
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
              approval: "pending",
              headDivision: this.state.scrumMaster,
              projectName: this.state.projectName,
              note: this.state.message
            }
          }).then((response) => {
            console.log(response)
            this.setState({
              statusCheckIn: ' ',
              clockInstatus: false,
              idUser: response.data.absenceId,
            });
            deviceStorage.saveItem("clockin_state", "clockin");
            deviceStorage.saveItem("state", '1');
            deviceStorage.saveItem("id_user", JSON.stringify(this.state.idUser));
            this.props.addClockin(this.state.clockInstatus, this.state.statusCheckInn, this.state.idUser, this.state.status)
            this.props.addLoad(true)
            ToastAndroid.showWithGravity(
              'Clock in success',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'Home' },
                ],
              })
            )
          })
          .catch((errorr) => {
            alert(errorr)
        });
        }       
      }

      findCoordinates = () => {
        Geolocation.getCurrentPosition(
          position => {
            Geocoder.init(ApiMaps);
            Geocoder.from(position.coords.latitude, position.coords.longitude)
              .then(json => {
                  console.log(json);
                  var addressComponent = json.results[1].address_components[0].long_name;
                  this.setState({
                    Location: addressComponent
                  })
                  deviceStorage.saveItem("location", this.state.Location);
                  console.log(addressComponent);       
              })
            .catch(error => console.warn(error));
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
              <View style={{flex:10}}>
                <Text style={styles.textareaContainer}>
                    Please fill this forms
                </Text>
                <Text style={styles.textSM}>
                    Select Your Scrum Master *
                </Text>

                <View style={styles.viewPicker}>            
                  <Picker
                    mode={"dropdown"}
                    selectedValue={this.state.scrumMaster}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({scrumMaster: itemValue})
                    }>
                    <Picker.Item label="" value="" />
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="js" />
                  </Picker>
                </View>

                <Text
                  style={styles.textSM}>
                    Project Name *
                </Text>
                <TextInput
                  style={styles.inputText}
                  onChangeText={text => this.setState({projectName: text})}
                  value={this.state.projectName}>
                </TextInput>

                <Text
                  style={styles.textSM}>
                    Notes
                </Text>
                <TextInput
                    multiline={true}
                    placeholder="kamu sakit apa..." 
                    style={styles.textInput}
                    onChangeText={text => this.setState({message: text})}
                    value={this.state.message}>
                </TextInput>
                </View>

                <View style={{flex:1, marginTop:130}}>
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
  textareaContainer: {fontSize:20, marginLeft:21, fontWeight:'600', lineHeight:22, fontFamily:'Nunito-SemiBold', color:'#505050', paddingTop:10},
   textSM:{
    marginTop: 16,
    marginBottom:10,
    paddingLeft:20,
    fontSize:16,
    fontWeight:'300', lineHeight:19, fontFamily:'Nunito-Light'
  },
  viewPicker:{
    width:'90%', height:'15%', marginLeft:20, borderRadius:5, borderColor:'gray', borderWidth:1, backgroundColor:'white'
  },
  picker:{
    height: '100%', width: '100%', borderWidth:20, borderColor:'gray'
  },
  textInput:{
    paddingLeft:10, paddingRight:10,height:'55%', borderColor: 'gray', textAlignVertical: 'top', borderWidth: 1, marginLeft:20, borderColor:'gray', width:'90%', borderRadius:5, backgroundColor:'white', fontSize:18
  },
  buttonSubmit:{
    backgroundColor:'#1A446D', marginTop:30, alignItems:'center', width:'90%', height:50, alignSelf:'center', borderRadius:5
  },
  textbtnSubmit:{
    color:'white', fontSize: 20, fontWeight:'600', textAlign:'center',textAlignVertical: "center", flex:1, fontFamily:'Nunito-SemiBold', marginBottom:7 
  },
  inputText:{
    textAlignVertical: 'top', borderWidth: 1, borderRadius:5, width:'90%', height:'15%', marginLeft:20, backgroundColor:'white', fontSize:18, fontFamily:'Nunito', fontWeight:'600', paddingLeft:10, paddingRight:10,
    borderColor:'gray' 
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
    workStatus :  state.DataReducer.workStatus
  }
}
const mapDispatchToPropsData = (dispatch) => {
  return {
    addLoad : (Loading) => dispatch(addLoading(Loading)),
    addClockin : (clockInstatus, statusCheckInn, idUser, status) => dispatch(addStatusClockin(clockInstatus, statusCheckInn, idUser, status))
  }
}

export default connect(mapStateToPropsData, mapDispatchToPropsData)(sick)
