import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, FlatList, BackHandler, RefreshControl, View, Text } from 'react-native'
import axios from 'axios';
import moment from 'moment';
import Loading from '../components/Loading';
import PeopleCard from '../components/CardApproval'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default class ApprovalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          monthYear : moment().format('Do MMM YYYY'),
          loadings : true,
          refreshing: false,
          people:[]
        }
        this.loadData = this.loadData.bind(this);
        this.onBack = this.onBack.bind(this);
    }
    async componentDidMount(){
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
      const headers = {
       accept: '*/*',
      };

      axios({
          method: 'GET',
          url: 'https://absensiapiendpoint.azurewebsites.net/api/absensi?Approval=pending&HeadDivision=java',
          headers: headers,
        }).then((response) => { 
          console.log(response)   
          this.setState({
            people: response.data,
            loadings: false
          });
        }).catch((errorr) => {
          console.log(errorr)       
            this.setState({
              error: 'Error retrieving data',
              loadings: false
            });
        });
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>           
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={this.state.people}
                renderItem={({ item }) =>
                    <PeopleCard person={item} date={this.state.monthYear} loadData={this.loadData}/>         
                }
                refreshControl={
                <RefreshControl refreshing={this.state.refreshing} 
                onRefresh={this.loadData}/>}
                style={{display: this.state.people.length !== 0 ? 'flex':'none'}}
              />
              <View style={[styles.view,{display: this.state.people.length === 0 ? 'flex':'none'}]}>
                <FontAwesome5 name='exclamation-triangle' size={80} color='#505050' style={{opacity:0.5}}/>
                <Text style={styles.text}>No Approval Request</Text>
              </View>
              <Loading visible={this.state.loadings === true ? true : false}/>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
  container:{
       flex:1,     
  },
  view:{
    alignSelf:'center', marginBottom:350, alignItems:'center'
  },
  text:{
    fontFamily:'Nunito-Light', fontSize:26, fontWeight:'600', color:'#505050', opacity:0.5
  }
})
