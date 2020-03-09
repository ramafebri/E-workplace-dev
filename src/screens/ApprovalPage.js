import React, { Component } from 'react'
import { StyleSheet, SafeAreaView, FlatList, BackHandler, RefreshControl } from 'react-native'
import axios from 'axios';
import moment from 'moment';
import Loading from '../components/Loading';
import PeopleCard from '../components/CardApproval'

export default class ApprovalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          monthYear : moment().format('Do MMM YYYY'),
          loadings : true,
          refreshing: false,
        }
        this.loadData = this.loadData.bind(this);
        this.onBack = this.onBack.bind(this);
    }
    async componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.onBack);
      this.setState({
        people : this.props.route.params.item.data,
        loadings : false,
      })  
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
          url: 'https://absensiapiendpoint.azurewebsites.net/api/absensi',
          headers: headers,
        }).then((response) => { 
          //console.log(response)    
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
                keyExtractor={(item) => item.absenceId}
                data={this.state.people}
                renderItem={({ item }) =>
                    <PeopleCard person={item} date={this.state.monthYear}/>         
                }
                refreshControl={
                <RefreshControl refreshing={this.state.refreshing} 
                onRefresh={this.loadData}/>}
              />
              <Loading visible={this.state.loadings === true ? true : false}/>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
  container:{
       flex:1,      
  },
})
