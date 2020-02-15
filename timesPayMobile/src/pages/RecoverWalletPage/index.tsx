import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Animated
} from 'react-native'
import React, {Component} from 'react'
import { COLOR } from 'react-native-material-ui'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import { ethers } from 'ethers'
import {NavigationActions, StackActions} from 'react-navigation'

import {getWalletByMnemonic} from '../../api/wallet'
import pageStyle from './style'

export default class RecoverWalletPage extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      mnemonic: "",
      isInputBoxFocus: false,
      opacity: new Animated.Value(1)
    }
  }

  onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start()
  }

  setMnemonic = (text) => {
    this.setState({
      mnemonic: text
    })
  }

  handleOnPress = () => {
   try{
      let recoverWallet = getWalletByMnemonic({mnemonic: this.state.mnemonic})
      // do not modify it !!
      this.onLoad()
      setTimeout(() => {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'WalletPassword', params: {wallet: recoverWallet} })
          ]
        })
        this.props.navigation.dispatch(resetAction)
      }, 300)
    }catch {
      Alert.alert("Error", "Invalid mnemonic phrase")
    }
  }

  isInvalid = () => {
    return this.state.mnemonic.length == 0
  }

  render() {
    return (
      <Animated.View style={{opacity: this.state.opacity}}>
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
              <Text style={styles.importBtnText}>Recover</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create(pageStyle)
