import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native'
import React, {Component} from 'react'
import { COLOR } from 'react-native-material-ui'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import { ethers } from 'ethers'
import { connect } from 'react-redux'
import Spinner from 'react-native-loading-spinner-overlay'

import { getInitState } from '../../reducers/selectors'
import { createWallet } from '../../actions/initAction'
import {RESET_STORE} from '../../actions/actionTypes'
import { setI18nConfig } from '../../utils/I18N'
import pageStyle from './style'


class WalletPasswordPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: "",
      confirmPassword: "",
      isPasswordInputBoxFocus: false,
      isConfirmPasswordInputBoxFocus: false,
      loading: false
    }
    this.wallet = this.props.navigation.getParam('wallet', {})
    setI18nConfig()
    this.props.reset()
    this.timer = null
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.initReducer.wallet != null) {
      this.setState({loading: false})
      this.props.navigation.navigate('RecoveryPhrase', {mnemonic_str: this.props.initReducer.wallet.signingKey.mnemonic})
    }

    if(!this.state.loading && this.props.initReducer.loading) {
      this.setState({ loading: true })
    }else if(this.state.loading && !this.props.initReducer.loading){
      if(this.timer != null)clearTimeout(this.timer)
      this.timer = setTimeout(() => {this.setState({ loading: false })}, 1000)
    }

    if(this.props.initReducer.errCode != null){ // error handling
      Alert.alert("Error", "Sorry, unknown error occured.", [
        {text: "OK", onPress: () => {
          this.props.navigation.navigate('Loading')
        }}
      ])
      this.props.reset()
    }
  }

  componentWillUnmount() {
    if(this.timer != null)clearTimeout(this.timer)
    this.props.reset()
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
      passPharse: this.state.password
    })

    this.timer = setTimeout(() => {
      this.setState({ loading: false})
      Alert.alert("Error", "Connection Timeout", {text: "OK", onPress: () => {this.props.navigation.navigate('Loading')}})
    }, 30000) // avoid loading screen not disappear
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
        <Spinner visible={this.state.loading} textContent={'Loading...'} animatioon="fade" color="#694FAD" 
                 textStyle={{color: "#694FAD", fontSize: wp('5%')}}/>
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
    createWallet: (payload) => dispatch(createWallet(payload)),
    reset: () => dispatch({type: RESET_STORE})
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (WalletPasswordPage)

const styles = StyleSheet.create(pageStyle)