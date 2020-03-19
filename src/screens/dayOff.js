import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert, BackHandler,TouchableOpacity, Picker, TextInput, RefreshControl, SafeAreaView, ScrollView } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default class DayOff extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            fullname: '',
            startDate: new Date(),
            dateStart: '',
            endDate: new Date(),
            dateEnd: '',
            CheckInTime: '',
            CheckOutTime: '',
            photo: null,
            Location:'',
            message:'',
            status: 'Taking day off',
            headDivision: '',
            reason:'',
            substitute:'',
            show1: false,
            show2: false,
            backPressed: 0,          
        }
        this.showDatepicker1 = this.showDatepicker1.bind(this)
        this.showDatepicker2 = this.showDatepicker2.bind(this)
        this.findCoordinates = this.findCoordinates.bind(this);
        this.onBack = this.onBack.bind(this);
      }
  
      componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
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
    const username = await AsyncStorage.getItem('username');  
      const name = await AsyncStorage.getItem('name');
      const location = await AsyncStorage.getItem('location');
      this.setState({
        username : username,
        name : name,
        Location : location
      })
    };

    findCoordinates = () => {
      Geolocation.getCurrentPosition(
        position => {
          Geocoder.init('AIzaSyA5wKOId22uPu5jTKhTh0LpF3R5MRpmjyw');
          Geocoder.from(position.coords.latitude, position.coords.longitude)
            .then(json => {
              console.log('Success: Get user location');
              var addressComponent = json.results[1].address_components[0].long_name;
                this.setState({
                  Location: addressComponent
                })
                deviceStorage.saveItem("location", this.state.Location);
                console.log(addressComponent);
                this.props.addLoc(this.state.Location)     
            })
          .catch(error => console.warn('Error: Get user location'));
        },
        error => Alert.alert(error.message),
        { enableHighAccuracy: true, timeout: 50000, maximumAge: 1000 }
      );
    };

    showDatepicker1 = () => {
        this.setState({
            show1: true
        })
    };
    showDatepicker2 = () => {
      this.setState({
          show2: true
      })
    };
    render() {
        const { show1, show2 } = this.state
        return (
            <SafeAreaView style={styles.container2}>
              <ScrollView>
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
                      this.setState({headDivision: itemValue})
                    }>
                    <Picker.Item label="" value="" />
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="js" />
                  </Picker>
                </View>
                

              <View style={styles.Split}>
                <View style={styles.viewDate1}>
                    <Text
                      style={styles.TextDate}>
                        Start Date *
                    </Text> 
                    
                    <View style={styles.viewDate2}>
                      <View style={styles.viewDate3}>
                        <View style={{flex:4, justifyContent:'center',}}>
                          <Text style={{marginLeft:10, fontSize:15}}>{this.state.dateStart}</Text>
                        </View>
                        <View style={{flex:1, justifyContent:'center'}}>
                          <FontAwesome5 style={styles.iconDate} name='calendar' size={25} color='#1A446D' onPress={this.showDatepicker1}/>  
                        </View>              
                      </View>
                    </View>
                    {show1 && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.startDate}
                        mode={'date'}
                        display="calendar"
                        onChange={(event, selectedDate) => {
                            const date = selectedDate.toString()
                            this.setState({
                                startDate: selectedDate,
                                dateStart: date.substr(0, 15),
                                show1: false
                            })
                        }}    
                    />
                    )}
                </View>
                <View style={styles.viewDate1}>
                    <Text
                      style={styles.TextDate}>
                        End Date *
                    </Text>
                    <View style={styles.viewDate22}>
                      <View style={styles.viewDate3}>
                        <View style={{flex:4, justifyContent:'center',}}>
                          <Text style={{marginLeft:10, fontSize:15}}>{this.state.dateEnd}</Text>
                        </View>
                        <View style={{flex:1, justifyContent:'center'}}>
                          <FontAwesome5 style={styles.iconDate} name='calendar' size={25} color='#1A446D' onPress={this.showDatepicker2}/>  
                        </View>
                      </View>
                    </View>
                    
                    {show2 && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.endDate}
                        mode={'date'}
                        display="calendar"
                        onChange={(event, selectedDate) => {
                            const date = selectedDate.toString()
                            this.setState({
                                endDate: selectedDate,
                                dateEnd: date.substr(0, 15),
                                show2: false
                            })
                        }}    
                    />
                    )}              
                </View> 
              </View>
                <Text
                  style={styles.textSM}>
                    Substitute *
                </Text>
                <TextInput
                    multiline={true}
                    maxLength={200}
                    placeholder="" 
                    style={styles.inputText}
                    onChangeText={text => this.setState({message: text})}
                    value={this.state.message}>
                </TextInput>            

                <Text
                  style={styles.textSM}>
                    Reason *
                </Text>            
                <View style={styles.viewPicker}>            
                  <Picker
                    mode={"dropdown"}
                    selectedValue={this.state.reason}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({reason: itemValue})
                    }>
                    <Picker.Item label="" value="" />
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="js" />
                  </Picker>
                </View>     

                <TouchableOpacity onPress={() => alert('Under Development!')} style={styles.buttonSubmit}>
                    <Text style={styles.textbtnSubmit} >Submit</Text>
                </TouchableOpacity>
            </ScrollView>                 
          </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
  container2:{
    flex: 1,
    backgroundColor:'#F9FCFF',
  },
  textareaContainer: {fontSize:20, marginLeft:21, fontWeight:'600', fontFamily:'Nunito-SemiBold', color:'#505050', paddingTop:10},
   textSM:{
    marginTop: 16,
    marginBottom:10,
    paddingLeft:20,
    fontSize:16,
    fontWeight:'300', fontFamily:'Nunito-Light'
  },
  text1:{
    fontSize:16, fontWeight:'300', fontFamily:'Nunito', marginLeft:22, marginTop:10
  },
  TextDate:{
    fontWeight:'300', fontFamily:'Nunito-Light',marginLeft:22, marginBottom:3
  },
  viewPicker:{
    width:'90%', flex:1.5, borderRadius:5, borderColor:'#505050', borderWidth:1, backgroundColor:'white', alignSelf:'center'
  },
  picker:{
    height: '100%', width: '100%', borderWidth:20, borderColor:'#505050'
  },
   Split:{
     flex: 0.3,
     flexDirection: 'row',
     marginTop: 16,
   },
   inputText:{
    textAlignVertical: 'top', borderWidth: 1, borderRadius:5, width:'90%', height:'9%',backgroundColor:'white', fontSize:18, borderColor:'#505050', alignSelf:'center', paddingLeft:10, paddingRight:10
  },
  buttonSubmit:{
    marginTop:40, backgroundColor:'#1A446D', height:50, width:'90%', borderRadius:5, alignSelf:'center'
  },
  textbtnSubmit:{
    color:'white', fontSize: 20, fontWeight:'600', textAlign:'center',textAlignVertical: "center", flex:1, fontFamily:'Nunito-SemiBold', marginBottom:7 
  },
  viewDate1:{
    flex:1,
  },
  viewDate2:{
    flexDirection:'row',flex:1, marginLeft:22, width:'80%',
  },
  viewDate22:{
    flexDirection:'row',flex:1, marginLeft:18, width:'80%',
  },
  viewDate3:{
    height:'100%', width:'100%', borderColor:'#505050', borderWidth:1, borderRadius:5, flexDirection:'row', backgroundColor:'#FFFFFF'
  },
  textinputDate:{
    height:'100%', borderWidth: 1, backgroundColor:'white',borderRadius:5, fontSize:18
  },
  iconDate:{
    alignSelf:'flex-end', marginRight:7, marginBottom:10, marginTop:8
  }
});
