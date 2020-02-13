import {
  SafeAreaView,
  StyleSheet,
  Alert
} from 'react-native'
import React, {Component} from 'react'
import {NavigationActions, StackActions} from 'react-navigation'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import Spinner from 'react-native-loading-spinner-overlay'
import { COLOR } from 'react-native-material-ui'

import {getEncryptedWallet} from '../../api/wallet'

export default class LoadingPage extends Component
{
  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    let wallet = await getEncryptedWallet()

    if(wallet == null){
      this.props.navigation.navigate('Auth')
    }else{
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'UnlockWallet' })
        ]
      })
      this.props.navigation.dispatch(resetAction)
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Spinner visible={true} textContent={'Loading...'} animatioon="fade"
                 textStyle={{fontSize: wp('5%')}}/>
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
    height: "100%",
    backgroundColor: COLOR.blue300,
    opacity: 0.8
  }
})
