import React, { Component } from 'react'
import { Text, View, StyleSheet, SafeAreaView, ScrollView, BackHandler, RefreshControl } from 'react-native'
import { Card } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import moment from 'moment';

export default class ClockInHistory extends Component {
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
        //this.props.addLoad(true)
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
          accept: '*/*',
         };
    
         axios({
             method: 'GET',
             url: 'https://absensiapiendpoint.azurewebsites.net/api/absensi?Username='+this.state.username+'&CheckIn='+year+'-'+month,
             headers: headers,
           }).then((response) => { 
             console.log(response)    
             this.setState({
                history: response.data
             });
             //this.props.addLoad(false)
           }).catch((errorr) => {
             console.log(errorr)       
             //this.props.addLoad(false)
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
                    <Text style={styles.TextTittle}>{this.state.monthYear}</Text>
                    <Card containerStyle={{marginBottom:10}}>
                        {
                            this.state.history.map((u, i) => {
                            return (
                            <View key={i} style={styles.history}>
                                <View style={{flex:1, marginLeft:10}}>
                                    <Text style={styles.Text}>{u.checkIn.substr(0,10)}</Text>
                                </View>
                                <View style={{flex:1, alignItems:'flex-end', marginRight:10}}>
                                    <Text style={styles.Text}>{u.checkIn.substr(11,8)+'-'+u.checkOut.substr(11,8)}</Text>
                                </View>
                            </View>
                            );
                            })
                        }
                    </Card>
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
  }
})
