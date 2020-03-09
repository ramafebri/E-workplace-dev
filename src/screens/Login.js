import React, { Component } from 'react';
import { Text, View, StyleSheet,TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import deviceStorage from '../services/deviceStorage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { addJWT,addLoading } from '../actions/JwtActions';
import Logo from '../../image/eworkplace2.svg'

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      jwtt : '',
      password: '',
      error: '',
      messageErrUsername:'',
      messageErrPassword:'',
      loading: false,
      icon:'eye-slash',
      secureText: true
    };
    this.loginUser = this.loginUser.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.iconPress = this.iconPress.bind(this)
}

static navigationOptions = { headerShown: false }

loginUser() {
  const { username, password} = this.state;

  if(username == null || username == ""){
    this.setState({
     messageErrUsername : 'username is required!'
    })
 }

 if(password == null || password == ""){
   this.setState({
    messageErrPassword : 'Password is required!'
   })
}

if((username != null && username != "" ) && ( password != null && password != "") ){
    axios({
        method: 'post',
        url: 'https://userabensiendpoint.azurewebsites.net/v1/authenticate',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json-patch+json',
        },
        data: {
          Username: username,
          Password: password,
        }
      }).then(response => {
        deviceStorage.saveItem("id_token", response.data.data);
        deviceStorage.saveItem("state", '0');
        this.setState({
          jwtt: response.data.data,
          loading: true
        })
        this.props.add(this.state.jwtt)
        this.props.navigation.push('Home');
       })
      .catch((errorr) => {
        console.log(errorr)
        this.setState({
          error: 'Username / password does not exist!',
        });
        alert(this.state.error)
      });
  }
}

  handleChangeUsername = event => {
    if(event !== ''){
        this.setState({messageErrUsername : '' });
    }
    this.setState({ 
        username: event,
    });
  };

  handleChangePassword = event => {
    if(event !== ''){
        this.setState({messageErrPassword : '' });
    }
    this.setState({ password: event });
  };

  iconPress(){
    if(this.state.icon === 'eye-slash'){
      this.setState({
        icon: 'eye',
        secureText: false
      })
    }
    else{
      this.setState({
        icon: 'eye-slash',
        secureText: true
      })
    }
  }

  render() {
    const { username, password} = this.state;

    return (
      <View style={{flex:1}}>
        <View style={{flex:1, backgroundColor:'#1A446D', paddingLeft:'5%', alignContent:'center'}}>
          <Text style={styles.logintitle}>
            Welcome!
          </Text>
          <Text style={styles.logintitle2}>
            Login to Continue
          </Text>
        </View>
        <View style={{flex:5.5, backgroundColor:'#F9FCFF',}}>
          <View style={{alignSelf:'center', marginTop:'10%'}}>
            <Logo width={230} height={60}/>
          </View>
          <View style={{marginLeft:20, marginRight:20 , marginTop:25}}>
            <View style={{height:100}}> 
              <Text style={styles.text}>Username</Text>
                  <TextInput
                      style={[styles.inputText,{borderColor: this.state.messageErrUsername !== '' ? '#EA5656':'#505050'}]}
                      onChangeText={this.handleChangeUsername}            
                      value={username}>
                  </TextInput>
              <Text style={styles.textError}>{this.state.messageErrUsername}</Text>
            </View>
            <View style={{height:100}}>     
            <Text style={[styles.text, {marginTop:5}]}>Password</Text>
              <View style={[styles.viewBorder,{borderColor: this.state.messageErrPassword !== '' ? '#EA5656':'#505050'}]}>
                <TextInput
                    style={[styles.inputTextPass]}
                    onChangeText={this.handleChangePassword}
                    secureTextEntry={this.state.secureText}
                    value={password}>
                </TextInput>
                <FontAwesome5 name={this.state.icon} size={20} color='#C1C1C1' solid onPress={this.iconPress}/>
              </View>
              <Text style={styles.textError}>{this.state.messageErrPassword}</Text>
            </View>    
            <TouchableOpacity style={{alignSelf:'flex-end', width:'40%'}}>
              <Text style={styles.text1}>forgot password ?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSubmit} onPress={this.loginUser}>
              <Text style={styles.textbtnSubmit}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    paddingTop: 60,
    backgroundColor:'#1A446D',
    height: '100%',
    width: '100%'
  },
  
  dcard: {
    flex:0.8,
    borderRadius: 15,
    width: '80%',
    justifyContent:'center',
  },
  back: {
    flex:1,
    justifyContent: 'center',
    height:"40%",
    width:"100%",
    paddingBottom:50,
    alignItems: 'center'
  },
  logintitle: {
    fontSize: 24,
    color: '#FFFFFF',
    paddingTop: '5%',
    fontFamily:'Nunito-SemiBold',
    fontWeight:'600',
  },
  logintitle2: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily:'Nunito-Light',
    fontWeight:'300',
  },
  text:{
    fontSize: 16,
    color: '#505050',
    fontFamily:'Nunito-Light',
    fontWeight:'300',
    lineHeight:19,
    marginBottom:7
  },
  text1:{
    fontSize: 16,
    color: '#1A446D',
    fontFamily:'Nunito-SemiBold',
    fontWeight:'600',
    textAlign:'right'
  },
  textError:{
    fontSize: 16,
    color: '#EA5656',
    fontFamily:'Nunito',
    fontWeight:'300',
    lineHeight:19,
  },
  viewBorder:{
    borderWidth: 1, borderRadius:5, width:'100%', flexDirection:'row', alignItems:'center'
  },
  inputText:{
  paddingLeft:10, paddingRight:10,textAlignVertical: 'top', borderWidth: 1, borderRadius:5, width:'100%', height:50,backgroundColor:'white', fontSize:18, borderColor:'#505050'
  },
  inputTextPass:{
    paddingLeft:10, paddingRight:10,textAlignVertical: 'top', borderRadius:5, width:'90%', height:50,backgroundColor:'white', fontSize:18, borderColor:'#505050'
    },
  buttonSubmit:{
    marginTop:40, backgroundColor:'#1A446D', height:'15%', width:'100%', borderRadius:5, alignSelf:'center', justifyContent:'center'
  },
  textbtnSubmit:{
    color:'white', fontSize: 20, textAlign:'center',textAlignVertical: "center",
    fontFamily:'Nunito-SemiBold',
    fontWeight:'600',
    marginBottom:6
  },   
});

const mapStateToPropsData = (state) => {
  console.log(state);
  return {
    tokenJWT: state.JwtReducer.jwt
  }
}

const mapDispatchToPropsJWT = (dispatch) => {
  return {
    add: (jwtt) => dispatch(addJWT(jwtt)),
    addLoad : (Loading) => dispatch(addLoading(Loading)),
  }
}
export default connect(mapStateToPropsData, mapDispatchToPropsJWT) (Login)