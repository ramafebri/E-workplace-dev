import React, { Component } from 'react'
import { Text, View, StyleSheet, SafeAreaView, ScrollView, BackHandler, RefreshControl } from 'react-native'
import { Card } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import moment from 'moment';
import {Url_Clockin} from '../config/URL';
import { connect } from 'react-redux';

class ClockInHistory extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            monthYear : moment().format('MMMM YYYY'),
            refreshing : false,
            history:[]
          }
          this.loadData = this.loadData.bind(this);
          this.onBack = this.onBack.bind(this);
      }
    
      async componentDidMount(){
        this.loadData();
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
      }

      componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
      }

      onBack = () => {
        this.props.navigation.goBack();
        return true;
      };
    
      async loadData(){
        const username = await AsyncStorage.getItem('username');
        const month = moment().format('MM');
        const year = new Date().getFullYear();
    
        this.setState({
          username : username,
        })
    
        const headers = {
          'accept': 'application/json',
          'Authorization': 'Bearer ' + this.props.tokenJWT
         };
    
         axios({
             method: 'GET',
             url: Url_Clockin+'?Username='+this.state.username+'&CheckIn='+year+'-'+month,
             headers: headers,
           }).then((response) => { 
             console.log(response)    
             this.setState({
                history: response.data
             });
           }).catch((errorr) => {
             console.log(errorr)       
          });
      }

    render() {
        return (
            <SafeAreaView style={{flex:1}}>
                <ScrollView
                alwaysBounceVertical={true} 
                refreshControl={
                  <RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadData} />
                }>
                  <View style={{display: this.state.history.length !== 0 ? 'flex':'none'}}>
                    <Text style={styles.TextTittle}>{this.state.monthYear}</Text>
                    <Card containerStyle={{marginBottom:10}}>
                        {
                            this.state.history.map((u, i) => {
                              const clockin = moment(u.CheckIn).add(7, 'hours').format('YYYY-MM-DD hh:mm:ss A');
                              const clockout = moment(u.CheckOut).add(7, 'hours').format('YYYY-MM-DD hh:mm:ss A');
                            return (
                            <View key={i} style={styles.history}>
                                <View style={{flex:1, marginLeft:10}}>
                                    <Text style={styles.Text}>{u.CheckIn.substr(8,2)+' / '+u.CheckIn.substr(5,2) +' / '+u.CheckIn.substr(0,4)}</Text>
                                </View>
                                <View style={{flex:1, alignItems:'flex-end', marginRight:10}}>
                                    <Text style={styles.Text}>{clockin.substr(11,5)+' '+clockin.substr(20,15) +'-'+clockout.substr(11,5)+' '+clockout.substr(20,15)}</Text>
                                </View>
                            </View>
                            );
                            })
                        }
                    </Card>
                  </View>
                  <View style={{display: this.state.history.length === 0 ? 'flex':'none', alignItems:'center', marginTop:250}}>
                    <FontAwesome5 name='exclamation-triangle' size={80} color='#1A446D' style={{opacity:0.7}}/>    
                    <Text style={[styles.TextStatus]}>No History</Text>
                  </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
  history:{
      height:40, borderBottomColor:'#505050', borderBottomWidth:0.5, justifyContent:'center', flexDirection:'row'
  },
  Text:{
      fontFamily:'Nunito-SemiBold', fontSize:16, fontWeight:'600', color:'#505050'
  },
  TextTittle:{
      fontFamily:'Nunito-SemiBold', fontSize:20, fontWeight:'600', color:'#4A90E2', marginLeft:20  
  },
  TextStatus:{
    fontFamily:'Nunito-SemiBold', fontSize: 20, fontWeight:'600', color:'#265685', textAlign:'center'
  }
})

const mapStateToPropsData = (state) => {
  //console.log(state);
  return {
    tokenJWT: state.JwtReducer.jwt,
  }
}
const mapDispatchToPropsData = (dispatch) => {
  return {

  }
}
  
export default connect(mapStateToPropsData, mapDispatchToPropsData)(ClockInHistory)