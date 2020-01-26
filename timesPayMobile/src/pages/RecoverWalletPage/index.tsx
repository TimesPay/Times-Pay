import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert
} from 'react-native'
import React, {Component} from 'react'
import { COLOR } from 'react-native-material-ui'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import { ethers } from 'ethers'


export default class RecoverWalletPage extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      mnemonic: "",
      isInputBoxFocus: false
    }
  }

  setMnemonic = (text) => {
    this.setState({
      mnemonic: text
    })
  }

  handleOnPress = () => {
    try{
      let recoverWallet = ethers.Wallet.fromMnemonic(this.state.mnemonic)
      this.props.navigation.navigate('CreateWalletPassword', {wallet: recoverWallet})
    }catch {
      Alert.alert("Error", "Invalid mnemonic phrase")
    }
  }

  isInvalid = () => {
    return this.state.mnemonic.length == 0
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1}}></View>
        <View style={{flex: 4}}>
          <Text style={styles.header}>RECOVER YOUR WALLET</Text>
          <TextInput
            editable
            multiline={true}
            autoCapitalize="none"
            maxLength={1000}
            blurOnSubmit={true}
            onChangeText={(text) => {this.setMnemonic(text)} }
            onFocus={() => {this.setState({isInputBoxFocus: true})}}
            onBlur={() => {this.setState({isInputBoxFocus: false})}}
            value={this.state.mnemonic}
            style={
              this.state.isInputBoxFocus?
              {...styles.inputBox, ...styles.inputBoxFocus} : styles.inputBox
            }
            clearButtonMode="unless-editing"
            textContentType="none" />
          <Text style={styles.hintText}>
              The mnemonic phrase usually consists of 12 vocabularies seperated with a space.
              The order of the vocabularies matters.
          </Text>
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={{
              ...styles.importBtn,
              backgroundColor: this.isInvalid() ? "#E1DCEF": "#694FAD"
            }}
            disabled={this.isInvalid()}
            onPress = {this.handleOnPress}>
            <Text style={styles.importBtnText}>Import</Text>
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
  inputBox: {
    borderWidth: 1,
    marginVertical: wp('3%'),
    marginHorizontal: wp('5%'),
    padding: wp('2%'),
    borderRadius: wp('1%'),
    fontSize: wp('4%'),
    height: "30%",
    borderColor: COLOR.grey300
  },
  inputBoxFocus: {
    borderColor: COLOR.blue200,
    shadowColor: COLOR.blue200,
    shadowOpacity: 0.6,
    shadowRadius: wp('1%'),
    shadowOffset: {width: wp('0.5%'), height: wp('0.5%')}
  },
  hintText: {
    marginHorizontal: wp('5%'),
    color: COLOR.grey600,
    fontSize: wp('3.5%'),
    marginVertical: wp('1%')
  },
  importBtn: {
    width: "90%",
    marginHorizontal: "5%",
    backgroundColor: "#694FAD",
    shadowColor: COLOR.grey300,
    shadowOpacity: 0.8,
    shadowOffset: {width: wp('0.5%'), height: wp('0.5%')},
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('2%'),
    marginVertical: wp('2%')
  },
  importBtnText:{
    color: "white",
    fontSize: wp('4.2%'),
    fontFamily: "FontAwesome",
    textAlign: "center",
    fontWeight: "bold"
  }
})