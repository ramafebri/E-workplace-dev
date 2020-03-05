/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';

import configureStore from './src/store';

const store = configureStore();

const Redux = () =>
  <Provider store={store}>
    <App />
  </Provider>

//hide ignore yellow box

// import {YellowBox} from 'react-native';
// YellowBox.ignoreWarnings(['Warning: ...']);
// console.disableYellowBox = true;


AppRegistry.registerComponent(appName, () => Redux);
