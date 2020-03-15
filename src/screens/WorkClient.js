import React, { Component } from 'react'
import { View, Text, Image, Picker, StyleSheet, Alert, BackHandler,TouchableOpacity, TextInput, ToastAndroid, SafeAreaView, ScrollView, RefreshControl } from 'react-native'
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
import {Url_Clockin, Url_UploadPhoto} from '../config/URL'

class WorkClient extends Component {
  constructor(props){
    super(props);
    this.state = {
        idUser : '',
        photo: null,
        username:'',
        fullname:'',
        Location: '',
        urlphoto:'',
        status: 'Work at client office',
        client : '',
        clientCompany : '',
        projectName : '',
        headDivision : '',
        loadingPhoto: false,
        refreshing:false
      }
    this.findCoordinates = this.findCoordinates.bind(this);
    this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
    this.handleChangeMessage = this.handleChangeMessage.bind(this);
    this.submitAll = this.submitAll.bind(this)
    this.onBack = this.onBack.bind(this);
    this.loadData = this.loadData.bind(this)
  }

  componentDidMount(){
    BackHandler.addEventListener('hardwareBackPress', this.onBack);
    this.loadData();
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }

  onBack = () => {
    this.props.navigation.goBack();
    return true;
 };

 loadData = async () => {     
  const username = await AsyncStorage.getItem("username");  
  const name = await AsyncStorage.getItem("name");
  const location = await AsyncStorage.getItem("location");
    this.setState({
      username : username,
      fullname : name,
      Location : location
    })
  };

  handleChoosePhoto = () => {
    var options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 1
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.uri) {
        //console.log(response)
        const name = response.fileName;
        const type = response.type;
        this.setState({ 
          loadingPhoto: true 
        })
          console.log(response.size)
          var url = Url_UploadPhoto;
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
      }
    })
  }

  findCoordinates = () => {
    Geolocation.getCurrentPosition(
      position => {
        Geocoder.init(ApiMaps);
        Geocoder.from(position.coords.latitude, position.coords.longitude)
          .then(json => {
           // console.log(json);
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

  async submitAll(){
    const value = await AsyncStorage.getItem('clockin_state2');
    if(this.props.clockin_status === true || value === 'clockin'){
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
    else if(this.state.headDivision === '' || this.state.urlphoto === '' || this.state.projectName === '' || this.state.client === '' || this.state.clientCompany === ''){
      alert('All form must be filled!');
    }
    else if(this.state.headDivision !== '' && this.state.urlphoto !== '' && this.state.projectName !== ''
    && this.state.client !== '' && this.state.clientCompany !== '' && this.props.clockin_status === false){
      const clockintime = new Date();
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
          CheckIn: clockintime,
          CheckOut: clockintime,
          State: this.state.status,
          Location : this.state.Location,
          Approval : 'Pending',
          ApprovalByAdmin : 'Pending',
          Photo: this.state.urlphoto,
          CompanyName: this.state.clientCompany,
          ClientName: this.state.client,
          ProjectName: this.state.projectName,
          HeadDivision: this.state.headDivision
        }
      }).then((response) => {
        console.log(response)
        this.setState({
          statusCheckIn: ' ',
          clockInstatus: true,
          idUser: response.data.Id,
        });
        deviceStorage.saveItem("clockin_state", "clockin");
        deviceStorage.saveItem("state", '1');
        deviceStorage.saveItem("id_user", JSON.stringify(this.state.idUser));
        deviceStorage.saveItem("clockin_time", response.data.CheckIn);

        this.props.addClockin(this.state.clockInstatus, this.state.statusCheckInn, this.state.idUser, this.state.status)
        this.props.addLoad(true)
        ToastAndroid.showWithGravity(
          'Clock in success!',
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
        console.log(errorr)
        ToastAndroid.showWithGravity(
          'Clock in fail!',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
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
              <View style={{flex:1, marginTop:15, paddingBottom:30}}>
                <Text style={styles.titleText}>Please Fill This Form</Text>
                <Text style={styles.textSM}>
                    Select Your Head Division *
                </Text>

                 <View style={styles.viewPicker}>            
                   <Picker
                    mode={"dropdown"}
                    selectedValue={this.state.headDivision}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({headDivision: itemValue})
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
                maxLength={40}
                onChangeText={text => this.setState({client: text})}
                value={this.state.client}>
              </TextInput>
                <Text
                  style={styles.textSM}>
                    Client's Company/Organizations *
                </Text>
                <TextInput 
                style={styles.inputText}
                maxLength={40}
                onChangeText={text => this.setState({clientCompany: text})}
                value={this.state.clientCompany}></TextInput>

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
    borderWidth:1, borderRadius:5, borderColor:'#1A446D', width:'90%', height:50, alignSelf:'center',justifyContent:'center', marginTop:'5%'
  },
  textPhoto:{
    textAlign:'center', color:'#1A446D', fontSize:18, fontFamily:'Nunito-SemiBold', fontWeight:'600', marginBottom:7
  },
image:{
  width: 150, height: 150, borderRadius:150/2
},
textSM:{
  marginTop: 16,
  paddingLeft:20,
  fontSize:16,
  fontWeight:'300', lineHeight:19, fontFamily:'Nunito-Light'
},
viewPicker:{
  width:'90%', height:'10%', marginLeft:20, borderRadius:5, borderColor:'grey', borderWidth:1, backgroundColor:'white'
},
picker:{
  height: '100%', width: '100%', borderWidth:20, borderColor:'black'
},
inputText:{
  textAlignVertical: 'top', borderWidth: 1, borderRadius:5, width:'90%', height:'10%', marginLeft:20, backgroundColor:'white', fontSize:18, borderColor:'grey', fontFamily:'Nunito-Regular', fontWeight:'600' 
},
buttonSubmit:{
  backgroundColor:'#26BF64', marginTop:30, alignItems:'center', width:'90%', height:'10%', alignSelf:'center', borderRadius:5
},
textbtnSubmit:{
  color:'white', fontSize: 18, fontWeight:'600', textAlign:'center',textAlignVertical: "center", flex:1, fontFamily:'Nunito-SemiBold' 
}
});

const mapStateToPropsData = (state) => {
  //console.log(state);
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

export default connect(mapStateToPropsData, mapDispatchToPropsData)(WorkClient)
