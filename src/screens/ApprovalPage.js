import React, { Component } from 'react'
import { View, StyleSheet, SafeAreaView, FlatList, ScrollView} from 'react-native'
import axios from 'axios';
import moment from 'moment';
import PeopleCard from '../components/CardApproval'

export default class ApprovalPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          people: [],
          monthYear : moment().format('Do MMM YYYY'),
        }
        this.loadData = this.loadData.bind(this);
    }
    componentDidMount(){
      this.loadData();
    }
    loadData = async () => {     
      const headers = {
       accept: '*/*',
      };

      axios({
          method: 'GET',
          url: 'https://absensiapiendpoint.azurewebsites.net/api/WorkFromHome?Approval=aa',
          headers: headers,
        }).then((response) => { 
          console.log(response)    
          this.setState({
            people: response.data
          });
          //alert(this.state.people)
        }).catch((errorr) => {
          //alert(errorr)       
            this.setState({
              error: 'Error retrieving data',
            });
        });
    };

    render() {
        let peopleCards = this.state.people.map(person => {
            return (
                <PeopleCard key={person.idWFH} person={person} date={this.state.monthYear}/>
            )
        })
        return (
            // <View style={{height:'100%', backgroundColor:'#e5e5e5'}}>
            //     {peopleCards}
            // </View>
            <SafeAreaView style={styles.container}>
            
              <FlatList
                keyExtractor={(item) => item.idWFH}
                data={this.state.people}
                renderItem={({ item }) => <PeopleCard person={item} date={this.state.monthYear}/>}
              />
               
              
              {/* <ScrollView>
                {peopleCards}
              </ScrollView> */}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
  container:{
       flex:1,
       
  },
  viewContainer:{
      flexDirection : 'row', height:'100%',
  },
  viewText:{
      flex:3, justifyContent:'center', 
  },
  text:{
      fontWeight: 'bold', fontSize:20, marginLeft:'6%'
  },
  text1:{
      marginBottom: 10, fontWeight: 'bold', fontSize:16, marginLeft:'6%'
  },
  text2:{
    fontSize: 16, fontWeight:'bold', color: 'grey', textAlignVertical:'top', textAlign:'right', marginTop:'10%',marginRight:'8%'
  },
  text3:{
    fontSize: 16, color: 'grey', textAlignVertical:'bottom', textAlign:'right', justifyContent:'flex-end', marginTop:'45%',marginRight:'8%'
  },
})
