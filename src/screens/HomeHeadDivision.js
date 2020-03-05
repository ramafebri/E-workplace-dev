import React, { Component } from 'react';
import { View, StyleSheet, Alert, BackHandler, SafeAreaView, ScrollView, ActivityIndicator,RefreshControl, ToastAndroid } from 'react-native';
import { Loading } from '../components/Loading';
import moment from 'moment';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import { connect } from 'react-redux';
import { addNama, addLocation, addStatusClockin, addLoading } from '../actions/DataActions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  ApplicationProvider,
  Button,
  Card,
  CardHeader,
  Text,
} from '@ui-kitten/components';
import { mapping, light } from '@eva-design/eva';

const Header0 = () => (
    <CardHeader title='Approval'/> 
  );

const Header1 = () => (
  <CardHeader title='Meetings'/> 
);

const Header2 = () => (
  <CardHeader title='Task'/> 
);

const Header3 = () => (
  <CardHeader title='Task Done'/> 
);

const Footer = () => (
  <View style={styles.footerContainer}>
    <Text category='s2'>Tap for details!</Text>
  </View>
);

class HomeHeadDivision extends Component {
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
        clockInstatus: false,
        url: 'https://absensiapiendpoint.azurewebsites.net/api/atOffice',
        refreshing : false
      }
      this.checkIn = this.checkIn.bind(this);
      this.checkOut = this.checkOut.bind(this);
      this.onBack = this.onBack.bind(this);
      this.wait - this.wait.bind(this);
      this.onRefresh = this.onRefresh.bind(this);
      this.loadData = this.loadData.bind(this);
      this.findCoordinates = this.findCoordinates.bind(this);
      this.gotoApprovalPage = this.gotoApprovalPage.bind(this)
    }

    componentDidMount() {
      this.setState({
        hour : moment().format('hh:mm a'),
        day : moment().format('dddd'),
        monthYear : moment().format('MMM Do YYYY'),
      })

      this.findCoordinates();
      this.loadData();
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }
    
    wait = (timeout) => {
      return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
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
      this.findCoordinates();
      this.loadData();
      this.props.addClockin(this.props.clockin_status, this.props.status_Checkin, this.props.id, this.props.workStatus)
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
          this.setState({
            username: response.data.data.username,
            fullname: response.data.data.profile.firstname + ' ' + response.data.data.profile.lastname,
          });
          this.props.addName(this.state.username, this.state.fullname)
          this.props.addLoad(this.state.loading)
        }).catch((errorr) => {       
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
              console.log(json);
              var addressComponent = json.results[1].address_components[0].long_name;
                this.setState({
                  Location: addressComponent
                })
                console.log(addressComponent);
            })
          .catch(error => console.warn(error));
          this.props.addLoc(this.state.Location)
        },
        error => Alert.alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
          // this.watchID = Geolocation.watchPosition(position => {
          // //Will give you the location on location change
          // console.log(position);
          // const currentLongitude = JSON.stringify(position.coords.longitude);
          // //getting the Longitude from the location json
          // const currentLatitude = JSON.stringify(position.coords.latitude);
          // //getting the Latitude from the location json
          // this.setState({ Location: currentLongitude + ' ' + currentLatitude});
          // });       
     };

  componentWillUnmount() {
    this.backHandler.remove();
    //this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

 checkIn(){ 
  this.setState({
    loadingCheckin: true
  }) 
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
    alert(response)
    this.setState({
      statusCheckInn: 'You have clocked in!',
      idUser: response.data.absenceId,
      clockInstatus: true,
      loadingCheckin: false
    });
    this.props.addClockin(this.state.clockInstatus, this.state.statusCheckInn, this.state.idUser, this.state.status)
    ToastAndroid.showWithGravity(
      'Clock in success',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
  })
  .catch((errorr) => {
    alert(errorr)
    this.setState({
      loadingCheckin: false
    });
    ToastAndroid.showWithGravity(
      'Clock out fail',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    );
 });
}

 checkOut(){
   if(this.props.workStatus === 'Work at Office'){
    axios({
      method: 'put',
      url: this.state.url + '/' + this.props.id,
      headers: { 'accept' : '*/*',
      'Content-Type' : 'application/json'},
      data : {
        checkOut : new Date()
      }
    }).then(data => {
      this.setState({
        statusCheckInn: 'You have not clocked in!',
        clockInstatus: false
      });
      this.props.addClockin(this.state.clockInstatus, this.state.statusCheckInn)
      ToastAndroid.showWithGravity(
        'Clock out success',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }).catch(err => {
        console.log(err);
        ToastAndroid.showWithGravity(
          'Clock out fail',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
    });
   }
   else if(this.props.workStatus === 'Work at Home'){
    axios({
      method: 'put',
      url: 'https://absensiapiendpoint.azurewebsites.net/api/WorkFromHome'+ '/' + this.props.id,
      headers: { 'accept' : '*/*',
      'Content-Type' : 'application/json'},
      data : {
        checkOut : new Date()
      }
    }).then(data => {
      this.setState({
        statusCheckInn: 'You have not clocked in!',
        clockInstatus: false
      });
      this.props.addClockin(this.state.clockInstatus, this.state.statusCheckInn)
      ToastAndroid.showWithGravity(
        'Clock out success',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }).catch(err => {
        console.log(err);
        ToastAndroid.showWithGravity(
          'Clock out fail',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
    });
   }
   else if(this.props.workStatus === 'Work at Client'){
    axios({
      method: 'put',
      url: 'https://absensiapiendpoint.azurewebsites.net/api/WorkAtClient'+ '/' + this.props.id,
      headers: { 'accept' : '*/*',
      'Content-Type' : 'application/json'},
      data : {
        checkOut : new Date()
      }
    }).then(data => {
      this.setState({
        statusCheckInn: 'You have not clocked in!',
        clockInstatus: false
      });
      this.props.addClockin(this.state.clockInstatus, this.state.statusCheckInn)
      ToastAndroid.showWithGravity(
        'Clock out success',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }).catch(err => {
        console.log(err);
        ToastAndroid.showWithGravity(
          'Clock out fail',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
    });
  }
   else if(this.props.workStatus === 'Sick'){
    axios({
      method: 'put',
      url: 'https://absensiapiendpoint.azurewebsites.net/api/Sick'+ '/' + this.props.id,
      headers: { 'accept' : '*/*',
      'Content-Type' : 'application/json'},
      data : {
        checkOut : new Date()
      }
    }).then(data => {
      this.setState({
        statusCheckInn: 'You have not clocked in!',
        clockInstatus: false
      });
      this.props.addClockin(this.state.clockInstatus, this.state.statusCheckInn)
      ToastAndroid.showWithGravity(
        'Clock out success',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }).catch(err => {
        console.log(err);
        ToastAndroid.showWithGravity(
          'Clock out fail',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );  
    });
  }
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

 gotoApprovalPage(){
     this.props.navigation.navigate('Approval')
 }

  render() {
    const { container } = styles;

    if (this.props.loading){
        return(
            <View style={container}>
              <Loading size={'large'}/>
            </View>
        )
      } else {
          return(
          <SafeAreaView style={{backgroundColor:'#e5e5e5'}}>
            <ScrollView 
            refreshControl={
              <RefreshControl refreshing={this.state.refreshing} 
              onRefresh={this.onRefresh} />
            }>
              <ApplicationProvider mapping={mapping} theme={light}>
                <View style={styles.card}>
                <View style={styles.Split}>
                  <View style={styles.childcard1}>
                    <View style={styles.childcard2}>
                      <Text category='h2' status='info'>
                      {this.state.hour}
                      </Text>
                    </View>
                    <View style={styles.childcard21}>
                      <Text category='s1' status='info'>
                        {this.state.day},
                      </Text>
                      <Text category='s1' status='info'>
                        {this.state.monthYear}
                      </Text>
                    </View>  
                    <View style={styles.childcard3}>
                        <View style={styles.viewIcon}>
                          <FontAwesome5 name='map-marker' size={30} color='#3366FF'/>       
                        </View>
                        <View style={styles.viewLocation}>
                          <Text category='s1'>{this.state.Location}</Text>       
                        </View>
                    </View>
                  </View>

                  <View style={{alignItems:'center', paddingLeft:8, paddingTop:20, flex:1, display: this.props.clockin_status === false ? 'flex':'none'}}>
                    <Text>{this.props.status_Checkin}</Text>
                    <View style={{display: this.state.loadingCheckin === true ? 'flex' : 'none'}}>
                      <ActivityIndicator size={'large'} />
                    </View>
                    <Button
                      style={{marginHorizontal: 4, marginTop : 8, borderRadius:15, borderWidth:1, display: this.state.loadingCheckin === false ? 'flex' : 'none'}}
                      size='giant'
                      status='primary'
                      onPress={this.checkIn}>
                      CLOCK IN
                    </Button>                                     
                  </View>
                  
                  <View style={{alignItems:'center', flex:1, paddingLeft:8, paddingTop:20, display: this.props.clockin_status === true ? 'flex':'none'}}>
                    <Text>{this.props.status_Checkin}</Text>
                    <Button
                      style={styles.clockIn}
                      size='giant'
                      status='danger'
                      onPress={this.checkOut}>
                      CLOCK OUT
                    </Button>                                         
                  </View>
                </View>
                </View>

                <Text category='h5' style={{paddingLeft:23, paddingTop:10, paddingBottom:10}}>Schedule</Text>
                <View style={styles.viewCardSchedule}>
                <Card style={styles.card1} header={Header0} footer={Footer} status='primary' onPress={this.gotoApprovalPage}>
                  <Text>
                    The Maldives, 
                  </Text>
                </Card>

                <Card style={styles.card1} header={Header1} footer={Footer} status='primary'>
                  <Text>
                    The Maldives, 
                  </Text>
                </Card>

                <Card style={styles.card1} header={Header2} footer={Footer} status='basic'>
                  <Text>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem I
                  </Text>
                </Card>

                <Card style={styles.card1} header={Header3} footer={Footer} status='info'>
                  <Text>
                    The Maldives, officially the Republic of Maldives, is a small country in South Asia,
                    located in the Arabian Sea of the Indian Ocean.
                  </Text>
                </Card>

                </View>
              </ApplicationProvider>
            </ScrollView>
          </SafeAreaView>
        );
      }
  }
}

const styles = StyleSheet.create({
  card:{
   height:'20%', paddingLeft: 30, paddingRight: 15, backgroundColor:'white' 
  },
  childcard1:{
    flex:1, alignItems:'flex-start', backgroundColor:'white'
  },
  childcard2:{
   width:'100%', height:'40%', alignSelf:'center', alignItems:'center', backgroundColor:'white', paddingTop:'5%'
  },
  childcard21:{
   width:'100%', height:'20%', borderBottomColor:'#4A90E2', borderBottomWidth:1, justifyContent:'flex-end'
  },
  childcard3:{
    flexDirection:'row', justifyContent:'flex-start',
  },
  card1:{
    height: '100%',
    flex:1,
    borderRadius:20,
    marginBottom:10
  },
  viewIcon: {
    paddingTop:10,
    marginLeft:20,
	},
	viewLocation: {
  paddingLeft:15, justifyContent:'center'
  },
  locText:{
    fontSize: 15,
    textAlign:'left'
  },
  Split:{
    flex: 1,
    flexDirection: 'row',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  clockIn: {
    marginHorizontal: 4,
    marginTop : 8,
    borderRadius:15,
    borderWidth:1
  },
  container: {
    flex: 1,
    backgroundColor : 'gray',
    padding: 15
  },
  viewCardSchedule:{
    height:'30%', width:'90%', alignSelf:'center', paddingBottom:30
  },
  headerText: {
    fontSize:18,
    fontWeight:'bold'
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
  
export default connect(mapStateToPropsData, mapDispatchToPropsData)(HomeHeadDivision)