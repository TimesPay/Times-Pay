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
import { ethers } from 'ethers'
import { connect } from 'react-redux'

import { getInitState } from '../../reducers/selectors'
import { createWallet } from '../../actions/initAction'


class CreateWalletPasswordPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: "",
      confirmPassword: "",
      isPasswordInputBoxFocus: false,
      isConfirmPasswordInputBoxFocus: false
    }
    this.wallet = this.props.navigation.getParam('wallet', {})
  }

	setPassword = (text) => {
    this.setState({
      password: text
    })
  }

  setConfirmPassword = (text) => {
    this.setState({
      confirmPassword: text
    })
  }

  handleOnPress = () => {
    if(!this.isRecoverWallet()) {
      this.wallet = new ethers.Wallet.createRandom()
    }
    this.props.createWallet({
      wallet: this.wallet,
      passPharse: this.password
    })
  }

  isInvalid = () => {
    return this.state.password != this.state.confirmPassword ||
           this.state.confirmPassword.length==0
  }

  isRecoverWallet = () => {
    return Object.keys(this.wallet).length > 0
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1}}></View>
        <View style={{flex: 4}}>
          <Text style={styles.header}>
            { this.isRecoverWallet() ? 'RESET WALLET PASSWORD' : 'PICK A WALLET PASSWORD' }
          </Text>
          <TextInput
              editable
              keyboardType="default"
              maxLength={40}
              onChangeText={(text) => this.setPassword(text)}
              onFocus={() => {this.setState({isPasswordInputBoxFocus: true})} }
              onBlur={() => {this.setState({isPasswordInputBoxFocus: false})} }
              value={this.state.password}
              placeholder="Password"
              style={
                this.state.isPasswordInputBoxFocus ?
                {...styles.passwordInputBox, ...styles.passwordInputBoxFocus} : styles.passwordInputBox
              }
              clearButtonMode="unless-editing"
              secureTextEntry={true}
              textContentType="newPassword" />
          <TextInput
              editable
              keyboardType="default"              
              maxLength={40}
              onChangeText={(text) => this.setConfirmPassword(text)}
              onFocus={() => {this.setState({isConfirmPasswordInputBoxFocus: true})} }
              onBlur={() => {this.setState({isConfirmPasswordInputBoxFocus: false})}}
              value={this.state.confirmPassword}
              placeholder="Confirm Password"
              style={
                this.state.isConfirmPasswordInputBoxFocus ?
                {...styles.passwordInputBox, ...styles.passwordInputBoxFocus} : styles.passwordInputBox
              }
              clearButtonMode="unless-editing"
              secureTextEntry={true}
              textContentType="newPassword" />
          <Text style={styles.hintText}>This password is used to protect your wallet or confirm payment.</Text>
          <Text style={styles.hintText}>Best passwords are long and contain letters, numbers and special characters.</Text>
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity
              style={{
                ...styles.confirmBtn,
                backgroundColor: this.isInvalid()? "#E1DCEF": "#694FAD"
              }}
              onPress={this.handleOnPress}
              disabled={this.isInvalid()}>
            <Text style={styles.confirmBtnText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => {
  const initReducer = getInitState(state)
  return { initReducer }
}

const mapDispatchToProps = dispatch => {
  return {
    createWallet: (payload) => dispatch(createWallet(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (CreateWalletPasswordPage)

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
  passwordInputBox: {
    borderWidth: 1,
    marginVertical: wp('3%'),
    marginHorizontal: wp('5%'),
    padding: wp('2%'),
    borderRadius: wp('1%'),
    fontSize: wp('4%'),
    borderColor: COLOR.grey300
  },
  passwordInputBoxFocus: {
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
  confirmBtn: {
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
	confirmBtnText:{
		color: "white",
		fontSize: wp('4.2%'),
		fontFamily: "FontAwesome",
		textAlign: "center",
		fontWeight: "bold"
	}
})