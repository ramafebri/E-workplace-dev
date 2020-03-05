
import React from 'react';
import { StyleSheet, Modal,View, ActivityIndicator } from 'react-native';

export default class Loading extends React.Component{
  render() {
  return (
    <Modal
        animationType="fade"
        visible={this.props.visible}
        transparent={true}
        >
        <View style={styles.mainOuterComponent}>
          <ActivityIndicator size={50} color={'#FFFFFF'}/>
        </View>
     </Modal>
  );
};
}

const styles = StyleSheet.create({
  mainOuterComponent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000088'
  },
});

export { Loading };