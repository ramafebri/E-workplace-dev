import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Card, Button, Icon, Text } from 'react-native-elements'

export class WorkInRemote extends Component {
    constructor(props){
        super(props);
          this.moveToWorkHome = this.moveToWorkHome.bind(this)
          this.moveToWorkClient = this.moveToWorkClient.bind(this);
          this.moveToDayOff = this.moveToDayOff.bind(this);
          this.moveToSick = this.moveToSick.bind(this)
        }
    moveToWorkHome(){
        this.props.navigation.navigate('WHome')
    }

    moveToWorkClient(){
        this.props.navigation.navigate('WClient')
    }

    moveToDayOff(){
      this.props.navigation.navigate('DayOff')
    }

    moveToSick(){
      this.props.navigation.navigate('Sick')
    }
    render() {
        return (
          <View>
              <View style={{height:'22%'}}>
                <Card containerStyle={{height:'100%'}}>
                <View style={{flexDirection : 'row'}}>
                  <View style={{flex:4}}>
                  <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize:20}}>
                    Work From Home
                  </Text>
                  <Text style={{marginBottom: 10}}>
                    Select to complete your attendance
                  </Text>
                  </View>
                  <View style={{flex:1}}>
                  <Button
                    icon={<Icon name='arrow-forward' color='#7C7C7C' type='font-awesome5' size={40} />}
                    type='clear'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,}}
                    onPress={this.moveToWorkHome}
                    />
                  </View>
                </View>    
                </Card>
              </View>

              <View style={{height:'22%', paddingTop:10}}>
                <Card containerStyle={{height:'100%'}}>
                <View style={{flexDirection : 'row'}}>
                  <View style={{flex:4}}>
                  <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize:20}}>
                    Work at Client's Office
                  </Text>
                  <Text style={{marginBottom: 10}}>
                    Select to complete your attendance
                  </Text>
                  </View>
                  <View style={{flex:1}}>
                  <Button
                    icon={<Icon name='arrow-forward' color='#7C7C7C' type='font-awesome5' size={40} />}
                    type='clear'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,}}
                    onPress={this.moveToWorkClient}
                    />
                  </View>
                </View>    
                </Card>
              </View>

              <View style={{height:'22%', paddingTop:10}}>
                <Card containerStyle={{height:'100%'}}>
                <View style={{flexDirection : 'row'}}>
                  <View style={{flex:4}}>
                  <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize:20}}>
                    Day Off
                  </Text>
                  <Text style={{marginBottom: 10}}>
                    Select to take day off and fill the form
                  </Text>
                  </View>
                  <View style={{flex:1}}>
                  <Button
                    icon={<Icon name='arrow-forward' color='#7C7C7C' type='font-awesome5' size={40} />}
                    type='clear'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,}}
                    onPress={this.moveToDayOff}
                    />
                  </View>
                </View>    
                </Card>
              </View>

              <View style={{height:'22%', paddingTop:10}}>
                <Card containerStyle={{height:'100%'}}>
                <View style={{flexDirection : 'row'}}>
                  <View style={{flex:4}}>
                  <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize:20}}>
                    Sick
                  </Text>
                  <Text style={{marginBottom: 10}}>
                    Select if you're sick to be able submit your attendance
                  </Text>
                  </View>
                  <View style={{flex:1}}>
                  <Button
                    icon={<Icon name='arrow-forward' color='#7C7C7C' type='font-awesome5' size={40} />}
                    type='clear'
                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0,}}
                    onPress={this.moveToSick}
                    />
                  </View>
                </View>    
                </Card>
              </View>
          </View>
        )
    }
}

const styles = StyleSheet.create({
  card:{
   height: '25%' 
  },
  card1:{
    height: '15%',
    marginVertical: 15,
  },
  Split:{
    flex: 1,
    flexDirection: 'row',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop : 8
  },
  footerControl: {
    marginHorizontal: 4,
    marginTop : 8
  },
});

export default (WorkInRemote)
