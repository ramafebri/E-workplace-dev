import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class FormInput extends React.Component {
  render() {
    const { errorTextStyle } = styles;
    return (
      <View>
      <View style={{backgroundColor:'#E4EDF7', width: '85%', alignSelf: 'center', borderRadius: 10}}>
        <View style={styles.itemrow}>
         <TextInput 
            style={styles.container}
            placeholder='Username'
            onChangeText={this.props.onChangeTextUsername}
            value={this.props.username}
            />
            <FontAwesome style={{padding:10,alignItems: 'center'}} name="user" size={30} color="#4A90E2" />
        </View>
      </View>
          <View>
            <Text style={errorTextStyle}>
              {this.props.messageErrUsername}
            </Text>
          </View>
      <View style={{backgroundColor:'#E4EDF7', width: '85%', alignSelf: 'center', borderRadius: 10}}>
        <View style={styles.itemrow}>
         <TextInput
             secureTextEntry 
             style={styles.container}
             placeholder="Password"
             onChangeText={this.props.onChangeTextPass}
             value={this.props.password}
          />
          <FontAwesome style={{padding:10,alignItems: 'center'}} name="lock" size={30} color="#4A90E2" />      
        </View>  
      </View>
          <View>
            <Text style={errorTextStyle}>
              {this.props.messageErrPassword}
            </Text>
          </View>
         <Text style={errorTextStyle}>
             {this.props.error}
         </Text>
    </View>     
    );
  }
}

const styles = StyleSheet.create({
  container: {
      fontSize: 18,
      flex: 1,
      paddingRight: 10,
      paddingLeft: 5,
  },
  errorTextStyle: {
    alignSelf: 'flex-start',
    fontSize: 15,
    color: 'red',
    marginLeft:'10%'
  },
  itemrow:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
      item1:{
        flex: 0.5,
        paddingLeft:30, 
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: 'red'
      },
      item2:{ 
        flex: 3.2,
        alignItems: 'flex-start',
      },
});
