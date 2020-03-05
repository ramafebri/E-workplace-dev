import { Alert,BackHandler } from "react-native";

const handleAndroidBackButton = () => {
  BackHandler.addEventListener('hardwareBackPress', 
  exitAlert()
  );
};
/**
 * Removes the event listener in order not to add a new one
 * every time the view component re-mounts
 */
const removeAndroidBackButtonHandler = () => {
  BackHandler.removeEventListener('hardwareBackPress', () => {});
}

const exitAlert = () => {
  Alert.alert(
    'Confirm exit',
    'Do you want to quit the app?'
    [
      {text: 'CANCEL',onPress: () =>{} ,style: 'cancel'},
      {text: 'OK', onPress: () => BackHandler.exitApp()}
    ]
  );
  return true
};

export {handleAndroidBackButton, removeAndroidBackButtonHandler};