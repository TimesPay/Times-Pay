import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native'
import React, {Component} from 'react'
import {COLOR} from 'react-native-material-ui'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { setI18nConfig } from '../../utils/I18N'
import pageStyle from './style'

// #TODO: disable screenshot for this page
export default class RecoveryPhrasePage extends Component {
  constructor(props){
    super(props)
    this.state = {
      mnemonic: this.props.navigation.getParam('mnemonic_str', '').split(' ')
    }
  }

  handleOnPress = () => {
    this.props.navigation.navigate('App')
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1}}></View>
        <View style={{flex: 4}}>
          <Text style={styles.header}>YOUR RECOVERY PHRASE</Text>
          <View style={styles.phraseContainer}>
            {
              this.state.mnemonic.map((phrase, index) => {
                return (
                  <View key={index} style={styles.phraseView}>
                    <Text style={styles.phraseText}>
                      {`${index+1}. ${phrase}`}
                    </Text>
                  </View>
                )
              })
            }
          </View>
        </View>
        <View style={styles.hintTextView}>
          <AntDesignIcon name="infocirlce" size={wp('4%')} color={COLOR.amber700} />
          <Text style={styles.hintText}>
            These phrases are used to recover your wallet when you forget the wallet password.
          </Text>
        </View>
        <View style={styles.hintTextView}>
          <AntDesignIcon name="infocirlce" size={wp('4%')} color={COLOR.amber700} />
          <Text style={styles.hintText}>
            Please keep them safely and never share them with anybody!
            The order of the phrases is important!!
          </Text>
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity style={styles.confirmBtn} onPress={this.handleOnPress}>
            <Text style={styles.confirmBtnText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create(pageStyle)