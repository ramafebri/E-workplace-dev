import React from 'react';
import { StyleSheet, Modal,View, Text, TouchableOpacity, Image } from 'react-native';

export default class CustomAlertComponent extends React.Component {
  render() {
    return (
        <Modal
            visible={this.props.visible}
            transparent={true}
            animationType={"fade"}>
            <View style={styles.mainOuterComponent}>
             <View style={{height:'60%', width:'80%', borderRadius:20, backgroundColor:'white'}}>
              <View style={{height:'85%'}}>
                <Text style={{textAlign:'center'}}>{this.props.details.state}</Text>
                <View>
                <Image source={require('../../image/E-WP_Logo.png')}
                    style={{alignSelf:'center', marginTop:'5%', borderRadius:30, height:'30%', width:'30%'}}
                />
                </View>
                <Text>{this.props.details.name} needs you approval. {'\n'}</Text>
                <Text>Working on : {this.props.details.projectName}</Text>
                {/* <Text>Client : {this.props.details.clientName}</Text>
                <Text>Company : {this.props.details.companyName}{'\n'}</Text> */}
                <Text>Location : {this.props.details.location}</Text>
               </View> 
                <View style={{flexDirection:'row', justifyContent:'center', height:'15%', alignSelf:'baseline', borderRadius:20}}>
                    <TouchableOpacity style={{flex:1, backgroundColor:'red', alignItems:'center', borderRadius:20}} onPress={this.props.decline}>
                        <Text style={{textAlign:'center',textAlignVertical: "center", flex:1 }}>Decline</Text>
                    </TouchableOpacity>  
                    <TouchableOpacity style={{flex:1, backgroundColor:'green', alignItems:'center', borderRadius:20}} onPress={this.props.approve}>
                        <Text style={{textAlign:'center',textAlignVertical: "center", flex:1 }}>Approve</Text>
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
});