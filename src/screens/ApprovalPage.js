import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, FlatList, BackHandler, RefreshControl, View, Text } from 'react-native'
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import Loading from '../components/Loading';
import PeopleCard from '../components/CardApproval'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Url_GetDataApproval} from '../config/URL'

class ApprovalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          monthYear : moment().format('Do MMM YYYY'),
          loadings : true,
          refreshing: false,
          people:[],
          backPressed: 0,
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
      this.setState({
        backPressed : this.state.backPressed + 1
      })
  
      if(this.state.backPressed % 2 === 1){
        this.props.navigation.goBack();
        return true;
      }
    };

    loadData = async () => {   
      const headers = {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + this.props.tokenJWT 
      };

      axios({
          method: 'GET',
          url: Url_GetDataApproval + this.props.nameUser,
          headers: headers,
        }).then((response) => { 
          console.log('Success: Get approval data')   
          this.setState({
            people: response.data,
            loadings: false
          });
        }).catch((errorr) => {
          console.log('Error: Get approval data')       
            this.setState({
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
                <FontAwesome5 name='exclamation-triangle' size={80} color='#1A446D' style={{opacity:0.7}}/>
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
    fontFamily:'Nunito-SemiBold', fontSize:20, fontWeight:'600', color:'#265685'
  }
})

const mapStateToPropsData = (state) => {
  return {
    tokenJWT: state.JwtReducer.jwt,
    nameUser: state.DataReducer.username,
  }
}
const mapDispatchToPropsData = (dispatch) => {
  return {

  }
}
  
export default connect(mapStateToPropsData, mapDispatchToPropsData)(ApprovalPage)