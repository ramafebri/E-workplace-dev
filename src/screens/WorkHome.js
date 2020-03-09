import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Alert, BackHandler,TouchableOpacity, Picker, TextInput,ToastAndroid, SafeAreaView, ScrollView, RefreshControl} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import deviceStorage from '../services/deviceStorage';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import { CommonActions } from '@react-navigation/native';
import {ApiMaps} from '../config/apiKey'
import axios from 'axios';
import Camera from '../../image/camera.svg'
import { connect } from 'react-redux';
import { addStatusClockin, addLoading } from '../actions/DataActions';
import ImageResizer from 'react-native-image-resizer';

 class WorkHome extends Component {
      constructor(props){
        super(props);
        this.state = {
            idUser : '',
            fullname :'',
            username:'',
            Location: '',
            photo: null,
            urlphoto:'',
            clockInstatus: false,
            statusCheckInn: 'You have clocked in!',
            message:'',
            status: 'Work from home',
            scrumMaster: '',
            projectName: '',
            loadingPhoto: false,
            refreshing: false,
            url: 'https://absensiapiendpoint.azurewebsites.net/api/absensi'
          }
        this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
        this.handleChangeMessage = this.handleChangeMessage.bind(this);
        this.submitAll = this.submitAll.bind(this);
        this.onBack = this.onBack.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadLocation = this.loadLocation.bind(this)
    }

    componentDidMount(){
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBack);
      this.loadData()
    }
    componentWillUnmount() {
        this.watchID != null && Geolocation.clearWatch(this.watchID);
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

    async loadLocation(){
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
    }

      handleChoosePhoto = () => {
        var options = {
          title: 'Select Image',
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, response => {
          if (response.uri) {
            console.log(response)
            const name = response.fileName;
            const type = response.type;
            this.setState({ 
              loadingPhoto: true
            })
            ImageResizer.createResizedImage(response.uri, 1000, 1000, 'JPEG', 100).then((response) => {
              console.log(response.size)
              var url = 'https://absensiapiendpoint.azurewebsites.net/api/BlobStorage/InsertFile';
              const Header = {
                // 'Content-Type': 'multipart/form-data',
                // 'accept' : 'text/plain'
              }       
              var formData = new FormData();
              formData.append('stream', {
                uri: response.uri,
                name: name,
                type: type
              })
              axios.post(url, formData ,Header)
                .then(data => {
                  this.setState({
                    urlphoto : data.data,
                    photo: response,
                  })
                  console.log("ulrnya : " + this.state.urlphoto)
                  }).catch(err => {
                      console.log(err)
                      ToastAndroid.showWithGravity(
                        'Upload Photo Failed',
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                      );
                    }
                  )
            })
            .catch((err) => {
                alert('Compress photo fail!')
            });       
          }
        })        
      }

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
        else if(this.state.scrumMaster === '' || this.state.urlphoto === '' || this.state.projectName === ''){
          alert('All form must be filled!');
        }
        else if(this.state.scrumMaster !== '' && this.state.urlphoto !== '' && this.state.projectName !== '' && this.props.clockin_status === true){
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
              photo : this.state.urlphoto,
              location : this.state.Location,
              note : this.state.message,
              projectName : this.state.projectName,
              approval : 'pending',
              headDivision : this.state.scrumMaster
            }
          }).then((response) => {
            console.log(response)
            this.setState({
              statusCheckIn: ' ',
              idUser: response.data.absenceId,
              clockInstatus: false,
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
    
    handleChangeMessage = event => {
      this.setState({ message: event });
    };

      render() {
        const { photo } = this.state
        return (
          <SafeAreaView style={{flex:1, backgroundColor:'#F9FCFF'}}>
            <ScrollView
                alwaysBounceVertical={true} 
                refreshControl={
                  <RefreshControl refreshing={this.state.refreshing} 
                onRefresh={this.loadLocation} />
              }>
              <View style={styles.card}>
                <Text style={styles.textTake}>Take Picture as Evidence</Text>
                <View style={styles.viewImage}>
                  <View style={{display: this.state.loadingPhoto === false ? 'flex' : 'none'}}>
                    <Camera width={50} height={50}/>
                  </View>
                  {photo && (
                      <React.Fragment>
                        <Image
                            source={{ uri: photo.uri }}
                            style={styles.image}
                            />  
                        </React.Fragment>
                  )}       
                </View>
                <Text style={styles.textbelowPIC}>The picture should have your face in it. This data will be forwarded to your Scrum Master to be approved first</Text>
                <TouchableOpacity onPress={this.handleChoosePhoto} style={styles.buttonPhoto}>
                    <Text style={styles.textPhoto}>Take Picture</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex:1, marginTop:15, paddingBottom:50}}>
                <Text style={styles.titleText}>Please Fill This Form</Text>
                <Text style={styles.textSM}>
                    Select Your Scrum Master *
                </Text>

                <View style={styles.viewPicker}>            
                  <Picker
                    mode={"dropdown"}
                    value={this.state.scrumMaster}
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

                <Text style={styles.textSM}>
                    Notes
                </Text>
                <TextInput
                    multiline={true}
                    placeholder="any message..." 
                    style={styles.textInput}
                    onChangeText={text => this.setState({message: text})}
                    value={this.state.message}>
                </TextInput>

                <TouchableOpacity onPress={this.submitAll} style={styles.buttonSubmit}>
                    <Text style={styles.textbtnSubmit} >Clock In</Text>
                </TouchableOpacity>
              </View>  
            </ScrollView>
          </SafeAreaView>
        )
      }
}

const styles = StyleSheet.create({
	card: {
		backgroundColor:'white', flex:1, alignSelf:'center', marginTop:'5%', width:'90%', paddingBottom:10
  },
  textTake:{
    textAlign:'center', paddingTop:'5%', fontFamily:'Nunito-SemiBold', fontWeight:'600', fontSize:20, color:'#505050'
  },
  viewImage: {
    backgroundColor:'#d4d4d4', width:100, height:100, alignSelf:'center', marginTop:'10%', borderRadius:100/2, justifyContent:'center', alignItems:'center', paddingBottom:'2%', 
  },
  textbelowPIC: {
    textAlign:'center', paddingTop:'7%', marginLeft:'5%', marginRight:'5%', fontFamily:'Nunito-Light', fontWeight:'300', color:'#676767' 
  },
   titleText: {
    fontSize:18, marginLeft:21, fontWeight:'600', lineHeight:22, fontFamily:'Nunito-SemiBold', color:'#505050'
  },
  buttonPhoto:{
    borderWidth:1, borderRadius:5, borderColor:'#1A446D', backgroundColor:'#FFFFFF', width:'90%', height:50, alignSelf:'center',justifyContent:'center', marginTop:'5%'
  },
  textPhoto:{
    textAlign:'center', color:'#1A446D', fontSize:18, fontFamily:'Nunito-SemiBold', fontWeight:'600', marginBottom:7
  },
  image:{
    width: 150, height: 150, borderRadius:150/2
  },
  textSM:{
    marginTop: 16,
    marginBottom:10,
    paddingLeft:20,
    fontSize:16,
    fontWeight:'300', lineHeight:19, fontFamily:'Nunito-Light'
  },
  viewPicker:{
    width:'90%', height:'10%', marginLeft:20, borderRadius:5, borderColor:'black', borderWidth:1, backgroundColor:'white'
  },
  picker:{
    height: '100%', width: '100%', borderWidth:20, borderColor:'black'
  },
  textInput:{
    paddingLeft:10, paddingRight:10, height:160, borderColor: 'gray', textAlignVertical: 'top', borderWidth: 1, marginLeft:20, borderColor:'black', width:'90%', borderRadius:5, backgroundColor:'white', fontSize:18, fontFamily:'Nunito', fontWeight:'600',
  },
  buttonSubmit:{
    backgroundColor:'#26BF64', marginTop:30, alignItems:'center', width:'90%', height:'10%', alignSelf:'center', borderRadius:5
  },
  textbtnSubmit:{
    color:'white', fontSize: 20, fontWeight:'600', textAlign:'center',textAlignVertical: "center", flex:1, fontFamily:'Nunito-SemiBold' 
  },
  inputText:{
    paddingLeft:10, paddingRight:10,textAlignVertical: 'top', borderWidth: 1, borderRadius:5, width:'90%', height:'10%', marginLeft:20, backgroundColor:'white', fontSize:18 
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

export default connect(mapStateToPropsData, mapDispatchToPropsData)(WorkHome)
