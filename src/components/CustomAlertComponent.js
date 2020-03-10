import React from 'react';
import { StyleSheet, Modal,View, Text, TouchableOpacity, Image } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Person from '../../image/person.svg'

export default class CustomAlertComponent extends React.Component {
  render() {
    return (
        <Modal
            visible={this.props.visible}
            transparent={true}
            animationType={"fade"}>
            <View style={styles.mainOuterComponent}>
             <View style={[styles.viewalert,{height: this.props.details.state === 'Work at client office' ? 400:350}]}>
              <View style={styles.view1}>
                <Text style={styles.text}>{this.props.details.state}</Text>
                <View style={styles.viewPhoto}>
                  <View style={{display: this.props.details.photo === null ? 'flex' : 'none',marginTop:100}}>
                    <Person width={70} height={70}/>
                    </View>
                  <Image style={{width: 100, height: 100, borderRadius:100/2}} source={{uri:this.props.details.photo}}/>                  
                </View>
                <Text style={[styles.text1, {paddingTop:10}]}>{this.props.details.name} <Text style={styles.text2}>needs you approval</Text></Text>
                <Text style={styles.text1}>Working on : <Text style={styles.text2}>{this.props.details.projectName}</Text></Text>
                <View style={{display: this.props.details.state === 'Work at client office' ? 'flex':'none'}}>
                  <Text style={styles.text1}>Client : <Text style={styles.text2}>{this.props.details.clientName}</Text></Text>
                  <Text style={styles.text1}>Company : <Text style={styles.text2}>{this.props.details.companyName}{'\n'}</Text></Text>
                </View>
                <View style={{display: this.props.details.state !== 'Work at client office' ? 'flex':'none'}}>
                  <Text style={styles.text1}>Notes : <Text style={styles.text2}>{this.props.details.note}</Text></Text>
                </View>

                <View style={{height:20, flexDirection:'row', marginTop:10}}>
                  <View style={{width:20, height:'100%', flex:1}}>
                    <FontAwesome5 name='map-marker-alt' size={16} color='#1A446D' style={{marginTop:2, marginLeft:50}}/>
                  </View>
                  <View style={{width:250, height:'100%', justifyContent:'center', flex:3}}>
                    <Text style={styles.textLocation}>{this.props.details.location}</Text>
                  </View>              
                </View>

              </View> 
                <View style={styles.viewButton}>
                    <TouchableOpacity style={styles.button} onPress={this.props.decline}>
                        <Text style={styles.textDecline}>Decline</Text>
                    </TouchableOpacity>  
                    <TouchableOpacity style={styles.button1} onPress={this.props.approve}>
                        <Text style={styles.textApprove}>Approve</Text>
                    </TouchableOpacity>
                </View>
             </View>
            </View>
        </Modal>
    );
  }
}

const styles = StyleSheet.create({
  mainOuterComponent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000088'
  },
  viewalert:{
    width:320, borderRadius:10, backgroundColor:'white'
  },
  view1:{
    height:'80%', alignItems:'center',
  },
  text:{
    fontFamily:'Nunito-Bold', fontSize:20, color:'#505050', fontWeight:'600',textAlignVertical:'center', paddingTop:10
  },
  text1:{
    fontFamily:'Nunito-Bold', fontSize:16, color:'#505050', fontWeight:'600', textAlignVertical:'center', textAlign:'center'
  },
  textLocation:{
    fontFamily:'Nunito-Light', fontSize:16, color:'#1A446D', fontWeight:'300', textAlignVertical:'center', paddingBottom:3
  },
  viewPhoto:{
    backgroundColor:'#d4d4d4', width:100, height:100, alignSelf:'center', borderRadius:100/2, justifyContent:'center', alignItems:'center', marginTop:15 
  },
  button:{
    backgroundColor:'#DB4A4A', alignItems:'center', borderRadius:5, width:125, height:50, marginRight:20, justifyContent:'center'
  },
  textDecline:{
    color:'#FFFFFF', fontFamily:'Nunito-Bold', fontSize:18, lineHeight:25, marginBottom:5
  },
  button1:{
    backgroundColor:'#26BF64', alignItems:'center', borderRadius:5, width:125, height:50, justifyContent:'center'
  },
  textApprove:{
    color:'#FFFFFF', fontFamily:'Nunito-Bold', fontSize:18, lineHeight:25, marginBottom:5
  },
  text2:{
    marginBottom: 10, fontFamily:'Nunito-Light', fontSize:16, color:'#505050', fontWeight:'300', marginLeft:'6%'
},
viewButton:{
  flexDirection:'row', justifyContent:'center', borderRadius:20, alignSelf:'center', width:'100%', marginTop:10
},
});