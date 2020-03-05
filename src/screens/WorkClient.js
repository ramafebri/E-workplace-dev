import React, { Component } from 'react'
import { View, Text, Image, Picker, StyleSheet, Alert, BackHandler,TouchableOpacity, TextInput, ActivityIndicator, ToastAndroid, SafeAreaView, ScrollView } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import deviceStorage from '../services/deviceStorage';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import { CommonActions } from '@react-navigation/native';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Camera from '../../image/camera.svg'
import { connect } from 'react-redux';
import { addStatusClockin, addLoading } from '../actions/DataActions';

class WorkClient extends Component {
  constructor(props){
    super(props);
    this.state = {
        idUser : '',
        loadingPhoto: false,
        photo: null,
        Location: '',
        urlphoto:'',
        message:'',
        status: 'Work At Client',
        statusCheckInn: 'You have clocked in!',
        client : '',
        clientCompany : '',
        projectName : '',
        scrumMaster : ''
      }
    this.findCoordinates = this.findCoordinates.bind(this);
    this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.submitAll = this.submitAll.bind(this)
    this.onBack = this.onBack.bind(this);
  }

  componentDidMount(){
    // alert(this.props.clockin_status)
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBack);
    this.findCoordinates()
  }
  componentWillUnmount() {
      this.watchID != null && Geolocation.clearWatch(this.watchID);
      this.backHandler.remove();
  }

  onBack = () => {
    this.props.navigation.goBack();
    return true;
 };

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
        this.setState({ 
          loadingPhoto: true 
        })
        var url = 'https://absensiapiendpoint.azurewebsites.net/api/BlobStorage/InsertFile';
        const Header = {
          // 'Content-Type': 'multipart/form-data',
          // 'accept' : 'text/plain'
        }       
        var formData = new FormData();
        formData.append('stream', {
          uri: response.uri,
          name: response.fileName,
          type: response.type
        })
        axios.post(url, formData ,Header)
          .then(data => {
            this.setState({
              urlphoto : data.data,
              photo: response,
              loadingPhoto: true
            })
            //alert(this.state.urlphoto)
            console.log("ulrnya : " + this.state.urlphoto)
            }).catch(err => {
              //alert(err)
                console.log(err)
                this.setState({
                  loadingPhoto: false
                })
              }
            )
          }
        })
  }

  findCoordinates = () => {
    Geolocation.getCurrentPosition(
      position => {
        Geocoder.init('AIzaSyA5wKOId22uPu5jTKhTh0LpF3R5MRpmjyw');
        Geocoder.from(position.coords.latitude, position.coords.longitude)
          .then(json => {
            console.log(json);
            var addressComponent = json.results[1].address_components[0].long_name;
              this.setState({
                Location: addressComponent
              })
              console.log(addressComponent);
          })
        .catch(error => console.warn(error));
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 50000, maximumAge: 1000 }
    );
  };

  async submitAll(){
    const value = await AsyncStorage.getItem('clockin_state2');
    if(this.props.clockin_status === false || value === 'clockin'){
      alert('kamu sudah clock in hari ini')
    }
    else if(this.state.scrumMaster === '' || this.state.urlphoto === '' || this.state.projectName === '' || this.state.client === '' || this.state.clientCompany === ''){
      alert('Semua form dan foto harus terisi!');
    }
    else if(this.state.scrumMaster !== '' && this.state.urlphoto !== '' && this.state.projectName !== ''
    && this.state.client !== '' && this.state.clientCompany !== '' && this.props.clockin_status === true){
      axios({
        method: 'POST',
        url: 'https://absensiapiendpoint.azurewebsites.net/api/absensi',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
        data: {
          username: this.props.nameUser,
          name: this.props.namee,
          checkIn: new Date(),
          state: this.state.status,
          location : this.props.userLocation,
          message : this.state.message,
          approval: "pending",
          photo: this.state.urlphoto,
          companyName: this.state.clientCompany,
          clientName: this.state.client,
          projectName: this.state.projectName,
          headDivision: this.state.scrumMaster
        }
      }).then((response) => {
        console.log(response)
        this.setState({
          statusCheckIn: ' ',
          clockInstatus: false,
          idUser: response.data.idWAC,
        });
        deviceStorage.saveItem("clockin_state", "clockin");
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
            <ScrollView>
              <View style={{backgroundColor:'white', flex:1, alignSelf:'center', marginTop:'5%', width:'90%', paddingBottom:10}}>
                <Text style={{textAlign:'center', paddingTop:'5%', fontFamily:'Nunito', fontWeight:'600', fontSize:20}}>Take Picture as Evidence</Text>
                <View style={{backgroundColor:'#d4d4d4', width:100, height:100, alignSelf:'center', marginTop:'10%', borderRadius:100/2, justifyContent:'center', alignItems:'center', paddingBottom:'2%', }}>
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
                <Text style={{textAlign:'center', paddingTop:'10%', marginLeft:'5%', marginRight:'5%', fontFamily:'Nunito', fontWeight:'300', lineHeight:15, color:'#676767' }}>The picture should have your face in it. This data will be forwarded to your Scrum Master to be approved first</Text>
                <TouchableOpacity onPress={this.handleChoosePhoto} style={{borderWidth:1, borderRadius:5, borderColor:'#1A446D', backgroundColor:'#FFFFFF', width:'90%', height:50, alignSelf:'center',justifyContent:'center', marginTop:'5%'}}>
                    <Text style={{textAlign:'center', color:'#1A446D', fontSize:18}}>Take Picture</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex:1, marginTop:15, paddingBottom:30}}>
                <Text style={{fontSize:18, marginLeft:21, fontWeight:'600', lineHeight:22, fontFamily:'Nunito'}}>Please Fill This Form</Text>
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
                  Client's Name *
              </Text>
              <TextInput
                style={styles.inputText}
                onChangeText={text => this.setState({client: text})}
                value={this.state.client}>
              </TextInput>
                <Text
                  style={styles.textSM}>
                    Client's Company/Organizations *
                </Text>
                <TextInput 
                style={styles.inputText}
                onChangeText={text => this.setState({clientCompany: text})}
                value={this.state.clientCompany}></TextInput>

                <Text
                  style={styles.textSM}>
                  Project Name *
                </Text>
                <TextInput
                  style={styles.inputText}
                  onChangeText={text => this.setState({projectName: text})}
                  value={this.state.projectName}>
                </TextInput>

              <TouchableOpacity onPress={this.submitAll} style={styles.buttonSubmit}>
                  <Text style={styles.textbtnSubmit} >CLOCK IN</Text>
              </TouchableOpacity>
              </View>  
            </ScrollView>
          </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
Split:{
 flex: 1,
 flexDirection: 'row',
},
titleText: {
fontSize: 16,
fontWeight: 'bold',
},
baseText: {
fontSize: 13,
},
locText:{
fontSize: 20,
textAlign:'center'
},
card: {
  height: '26%', backgroundColor:'#FFFFFF', width:'100%'
},
container2:{
  flex: 1,
  backgroundColor:'#e5e5e5',
},
split1: {
  flex:3, paddingTop:15, paddingLeft:10
},
viewIcon: {
  alignItems:'flex-start', alignSelf:'flex-start', paddingTop:15,
},
viewLocation: {
  paddingTop:15, paddingLeft:15
},
boldText: {
  fontSize: 30,
  color: 'red',
},
 Split:{
   flex: 1,
   flexDirection: 'row',
 },
 titleText: {
  fontSize: 16,
  fontWeight: 'bold',
},
baseText: {
  fontSize: 13,
},
locText:{
  fontSize: 15,
  textAlign:'left'
},
split2:{
  alignItems:'center', flex:2, backgroundColor:'#7C7C7C', justifyContent: 'flex-end'
},
image:{
  width: 150, height: 150, borderRadius:150/2
},
buttonPhoto:{
  backgroundColor:'#E74C3C',alignItems:'center', width:'100%', height:'20%'
},
textPhoto:{
  color:'white', fontSize: 17, fontWeight:'bold', textAlign:'center',textAlignVertical: "center"
},
textSM:{
  marginTop: 16,
  paddingLeft:20,
  fontSize:16
},
viewPicker:{
  width:'90%', height:'10%', marginLeft:20, borderRadius:5, borderColor:'grey', borderWidth:1, backgroundColor:'white'
},
picker:{
  height: '100%', width: '100%', borderWidth:20, borderColor:'black'
},
inputText:{
  textAlignVertical: 'top', borderWidth: 1, borderRadius:5, width:'90%', height:'10%', marginLeft:20, backgroundColor:'white', fontSize:18, borderColor:'grey' 
},
buttonSubmit:{
  backgroundColor:'#26BF64', marginTop:30, alignItems:'center', width:'90%', height:'10%', alignSelf:'center', borderRadius:5
},
textbtnSubmit:{
  color:'white', fontSize: 20, fontWeight:'600', textAlign:'center',textAlignVertical: "center", flex:1 
}
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

export default connect(mapStateToPropsData, mapDispatchToPropsData)(WorkClient)
