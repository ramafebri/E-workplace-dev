import React, { Component, Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {Input} from '../components/';
import Button from '../components/';
import {Loading} from '../components/';
import axios from 'axios';
import deviceStorage from '../services/deviceStorage';

export default class Registration extends Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      password_confirmation: '',
      error: '',
      loading: false
    };
    this.registerUser = this.registerUser.bind(this);
    this.onRegistrationFail = this.onRegistrationFail.bind(this);
}

registerUser() {
  const { email, password, password_confirmation } = this.state;

  this.setState({ error: '', loading: true });
  
  // NOTE HTTP is insecure, only post to HTTPS in production apps
  
  axios.post("http://localhost:4000/api/v1/sign_up",{
    user: {
      email: email,
      password: password,
      password_confirmation: password_confirmation
    }
  },)
  .then((response) => {
     // Handle the JWT response here
     deviceStorage.saveKey("id_token", response.data.jwt);
     this.props.newJWT(response.data.jwt);
  })
  .catch((error) => {
     // Handle returned errors here
     this.onRegistrationFail();
    });
  }

  onRegistrationFail() {
    this.setState({
      error: 'Registration Failed',
      loading: false
    });
  }

  render() {
    const { email, password, password_confirmation, error, loading } = this.state;
    const { form, section, errorTextStyle } = styles;

    return (
        <Fragment>  
        <View style={form}>
          <View style={section}>
            <Input
              placeholder="user@email.com"
              label="Email"
              value={email}
              onChangeText={email => this.setState({ email })}
            />
          </View>

          <View style={section}>
            <Input
              secureTextEntry
              placeholder="password"
              label="Password"
              value={password}
              onChangeText={password => this.setState({ password })}
            />
          </View>

          <View style={section}>
            <Input
              secureTextEntry
              placeholder="confirm password"
              label="Confirm Password"
              value={password_confirmation}
              onChangeText={password_confirmation => this.setState({ password_confirmation })}
            />
          </View>

          <Text style={errorTextStyle}>
            {error}
          </Text>

          {!loading ?
            <Button>
              Register
            </Button>
            :
            <Loading size={'large'} />}

            {/* <TextLink onPress={this.props.authSwitch}>
                Already have an account? Log in!
            </TextLink> */}
        </View>
        </Fragment>
    );
  }
}

const styles = {
  form: {
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  section: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  errorTextStyle: {
    alignSelf: 'center',
    fontSize: 18,
    color: 'red'
  }
};