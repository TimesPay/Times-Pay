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
import Spinner from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'
import * as SecureStore from 'expo-secure-store'

import { getInitState } from '../../reducers/selectors'
import { loadWallet } from '../../actions/initAction'
import {RESET_STORE} from '../../actions/actionTypes'
import { setI18nConfig } from '../../utils/I18N'
import pageStyle from './style'


class UnlockWalletPage extends Component {
  constructor(props){
    super(props)
    this.state = {
      password: "",
      isPasswordInputBoxFocus: false,
      loading: false
    }
    setI18nConfig()
    this.timer = null
  }

  setPassword = (text) => {
    this.setState({password: text})
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.initReducer.wallet != null) {
      this.setState({loading: false})
      this.props.navigation.navigate('App')
    }

    if(!this.state.loading && this.props.initReducer.loading) {
      this.setState({ loading: true })
    }else if(this.state.loading && !this.props.initReducer.loading){
      if(this.timer != null)clearTimeout(this.timer)
      this.timer = setTimeout(() => {this.setState({ loading: false })}, 1000)
    }

    if(this.props.initReducer.errCode != null){ // error handling
      Alert.alert("Error", "Sorry, unable to unlock the wallet.")
      this.props.reset() // prevent continuous pop up
    }
  }

  componentWillUnmount() {
    if(this.timer != null)clearTimeout(this.timer)
    // this.props.reset()
  }

  handleUnlock = () => {
    this.props.loadWallet({
      passPharse: this.state.password
    })
    this.timer = setTimeout(() => {
      this.setState({ loading: false})
      Alert.alert("Error", "Connection Timeout", {text: "OK", onPress: () => {this.props.navigation.navigate('Loading')}})
    }, 30000) // avoid loading screen not disappear
  }

  handleForgetPassword = () => {
    this.props.navigation.navigate('RecoverWallet')
  }

  handleResetWallet = () => {
    Alert.alert("WARNING", "You may lose your account and funds forever. Don't reset if you didn't make a backup.", [
      {text: "CONTINUE", onPress: () => {
        SecureStore.deleteItemAsync("wallet")
        this.props.navigation.navigate('Loading')
      }},
      {text: "CANCEL", onPress: () => {}}
    ])
  }

  isInvalid = () => {
    return this.state.password.length == 0
  }

  render() {
    return(
      <SafeAreaView style={styles.container}>
        <Spinner visible={this.state.loading} textContent={'Loading...'} animatioon="fade" color="#694FAD"
                 textStyle={{color: "#694FAD", fontSize: wp('5%')}}/>
        <View style={{flex: 1}}></View>
        <View style={{flex: 4}}>
          <Text style={styles.header}>UNLOCK WALLET</Text>
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
          <TouchableOpacity style={styles.subBtn} onPress={this.handleForgetPassword}>
            <Text style={styles.subBtnText}>FORGET PASSWORD?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.subBtn} onPress={this.handleResetWallet}>
            <Text style={{...styles.subBtnText, color: COLOR.red600}}>RESET WALLET</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity
            style={{
              ...styles.unlockBtn,
              backgroundColor: this.isInvalid()? "#E1DCEF": "#694FAD"
            }}
            onPress={this.handleUnlock}
            disabled={this.isInvalid()}>
            <Text style={styles.unlockBtnText}>Unlock</Text>
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
    loadWallet: (payload) => dispatch(loadWallet(payload)),
    reset: () => dispatch({type: RESET_STORE})
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (UnlockWalletPage)

const styles = StyleSheet.create(pageStyle)
