import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, Alert, BackHandler,TouchableOpacity, Picker, TextInput,ToastAndroid, SafeAreaView, ScrollView, RefreshControl, PermissionsAndroid} from 'react-native'
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
import {Url_Clockin, Url_UploadPhoto, Url_GetListHD} from '../config/URL'

//Work From Home
 class WorkHome extends Component {
      constructor(props){
        super(props);
        this.state = {
            idUser : '',
            fullname :'',
            username:'',
            Location: '',
            permission: null,
            photo: null,
            urlphoto:'',
            clockInstatus: false,
            statusCheckInn: 'You have clocked in!',
            message:'',
            status: 'Work from home',
            headDivision: '',
            projectName: '',
            loadingPhoto: false,
            refreshing: false,
            backPressed: 0,
            listHD:[]
          }
        this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
        this.handleChangeMessage = this.handleChangeMessage.bind(this);
        this.onBack = this.onBack.bind(this);
        this.loadData = this.loadData.bind(this);
        this.loadLocation = this.loadLocation.bind(this);
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

    async loadLocation(){
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
    }

      handleChoosePhoto = () => {
        var options = {
          title: 'Select Image',
          maxWidth: 1000,
          maxHeight: 1000,
          quality: 1,
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
        ImagePicker.showImagePicker(options, response => {
          if (response.uri) {
            console.log(response.uri)
            const name = response.fileName;
            const type = response.type;
            this.setState({ 
              loadingPhoto: true
            })

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
                  console.log('Success: Upload photo')
                  this.setState({
                    urlphoto : data.data,
                    photo: response,
                  })
                  console.log("Photo url: " + this.state.urlphoto)
                  }).catch(err => {
                      console.log('Error: Upload photo')
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

      async submitAll(){
        if(this.props.announcement !== ''){
          Alert.alert(
            "You can't clock in!",this.props.announcement,
            [
              { text: "OK", onPress: () => console.log('OK'), style: "cancel"},
            ],
            { cancelable: false },
          );
          return true;
        }
        else{
        const value = await AsyncStorage.getItem('clockin_state2');
        const location = await AsyncStorage.getItem('location');
        const sickValue = await AsyncStorage.getItem('sick_submit');

        //Get Hour
        const hour = new Date().getHours();
        console.log('Time right now: '+hour)
        
        if(this.props.clockin_status === true || value === 'clockin'){
          Alert.alert(
            'You have clocked in today!','Your next clock in will be start tomorrow at 07.00 AM',
            [
              { text: "OK", onPress: () => console.log('OK'), style: "cancel"},
            ],
            { cancelable: false },
          );
          this.props.addLoad(false)
          return true;
        }
        else if(hour <= 6){
          Alert.alert(
            "You can't clock in!",'Clock in time only available at 7 AM - 24 PM',
            [
              { text: "OK", onPress: () => console.log('OK'), style: "cancel"},
            ],
            { cancelable: false },
          );
          this.props.addLoad(false)
          return true;
        }
        else if(this.state.headDivision === '' || this.state.urlphoto === '' || this.state.projectName === '' || this.state.message === ''){
          alert('All form must be filled!');
        }
        else if(sickValue === '1'){
          Alert.alert(
            "You can't clock in!",'You have submitted sick form today. Your next clock in will be start tomorrow at 07.00 AM',
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
        else if(this.state.headDivision !== '' && this.state.urlphoto !== '' && this.state.projectName !== '' && this.props.clockin_status === false && this.state.message !== '' && hour > 6){
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
              State: this.state.status,
              Photo : this.state.urlphoto,
              Location : this.state.Location,
              Note : this.state.message,
              ProjectName : this.state.projectName,
              Approval : 'Pending',
              ApprovalByAdmin : 'Pending',
              HeadDivision : this.state.headDivision
            }
          }).then((response) => {
            console.log('Success: Clock in work from home')
            this.setState({
              statusCheckIn: ' ',
              idUser: response.data.Id,
              clockInstatus: true,
            });
            deviceStorage.saveItem("clockin_state", "clockin");
            deviceStorage.saveItem("state", '1');
            deviceStorage.saveItem("clockinHour", new Date().getHours().toString());
            deviceStorage.saveItem("clockinMinute", new Date().getMinutes().toString());
            deviceStorage.saveItem("id_user", JSON.stringify(this.state.idUser));

            this.props.addClockin(this.state.clockInstatus, this.state.statusCheckInn, this.state.idUser, this.state.status)
            this.props.addLoad(true)
            ToastAndroid.showWithGravity(
              'Clock in success!',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
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
          })
          .catch((errorr) => {
            console.log('Error: Clock in work from home')
            ToastAndroid.showWithGravity(
              'Clock in fail!',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
        });     
      }
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
                <Text style={styles.textbelowPIC}>The picture should capture your face in it. The data from this form will be sent to your head division for their approval</Text>
                <TouchableOpacity onPress={this.handleChoosePhoto} style={styles.buttonPhoto}>
                    <Text style={styles.textPhoto}>Take Picture</Text>
                </TouchableOpacity>
              </View>
              <View style={{flex:1, marginTop:15, paddingBottom:50}}>
                <Text style={styles.titleText}>Please Fill This Form</Text>
                <Text style={styles.textSM}>
                    Select Your Head Division *
                </Text>

                <View style={styles.viewPicker}>            
                  <Picker
                    mode={"dropdown"}
                    value={this.state.headDivision}
                    selectedValue={this.state.headDivision}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({headDivision: itemValue})
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
                  onChangeText={text => this.setState({projectName: text})}
                  value={this.state.projectName}>
                </TextInput>

                <Text style={styles.textSM}>
                    Notes *
                </Text>
                <TextInput
                    multiline={true}
                    numberOfLines={4}
                    maxLength={200}
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
    fontSize:18, marginLeft:21, fontWeight:'600', fontFamily:'Nunito-SemiBold', color:'#505050'
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
    fontWeight:'300', fontFamily:'Nunito-Light'
  },
  viewPicker:{
    width:'90%', height:'10%', marginLeft:20, borderRadius:5, borderColor:'#505050', borderWidth:1, backgroundColor:'white'
  },
  picker:{
    height: '100%', width: '100%', borderWidth:20, borderColor:'#505050'
  },
  textInput:{
    paddingLeft:10, paddingRight:10, height:160, borderColor: '#505050', textAlignVertical: 'top', borderWidth: 1, marginLeft:20, width:'90%', borderRadius:5, backgroundColor:'white', fontSize:18, fontFamily:'Nunito-Regular', fontWeight:'600',
  },
  buttonSubmit:{
    backgroundColor:'#26BF64', marginTop:30, alignItems:'center', width:'90%', height:'10%', alignSelf:'center', borderRadius:5
  },
  textbtnSubmit:{
    color:'white', fontSize: 20, fontWeight:'600', textAlign:'center',textAlignVertical: "center", flex:1, fontFamily:'Nunito-SemiBold' 
  },
  inputText:{
    paddingLeft:10, paddingRight:10,textAlignVertical: 'top', borderWidth: 1, borderRadius:5, borderColor:'#505050',width:'90%', height:'10%', marginLeft:20, backgroundColor:'white', fontSize:18, fontFamily:'Nunito-Regular', fontWeight:'600'
  },
});

const mapStateToPropsData = (state) => {
  return {
    clockin_status : state.DataReducer.clockIn,
    tokenJWT: state.JwtReducer.jwt,
    announcement :  state.DataReducer.announcement
  }
}
const mapDispatchToPropsData = (dispatch) => {
  return {
    addLoad : (Loading) => dispatch(addLoading(Loading)),
    addClockin : (clockInstatus, statusCheckInn, idUser, status) => dispatch(addStatusClockin(clockInstatus, statusCheckInn, idUser, status))
  }
}

export default connect(mapStateToPropsData, mapDispatchToPropsData)(WorkHome)
