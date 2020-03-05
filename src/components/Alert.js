import {Alert, BackHandler} from 'react-native';

const exitAlert = () => {
  Alert.alert(
    'Confirm exit',
    'Do you want to quit the app?'
    [
      {text: 'CANCEL',onPress: () =>{} ,style: 'cancel'},
      {text: 'OK', onPress: () => BackHandler.exitApp()}
    ]
  );
};

export {exitAlert};