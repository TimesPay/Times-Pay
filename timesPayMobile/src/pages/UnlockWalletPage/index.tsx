import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import React, {Component} from 'react'
import { COLOR } from 'react-native-material-ui'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import { connect } from 'react-redux'


export default class UnlockWalletPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      password: "",
      isPasswordInputBoxFocus: false
    }
  }

  render() {
    return(
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1}}></View>
        <View style={{flex: 4}}>
          <Text style={styles.header}>UNLOCK WALLET</Text>
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity>
            <Text>Unlock</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    height: "100%"
  },
  header: {
    fontSize: wp('8%'),
    paddingHorizontal: wp('5%'),
    marginVertical: wp('5%'),
    fontWeight: "bold",
    color: COLOR.amber700
  },
})