import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import React, { Component } from 'react'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import { connect } from 'react-redux';
import { ethers } from 'ethers';
import { COLOR } from 'react-native-material-ui'
import Spinner from 'react-native-loading-spinner-overlay'
import FeatherIcon from 'react-native-vector-icons/Feather'

import { translate, setI18nConfig } from '../../utils/I18N'
import { getInitState } from '../../reducers/selectors'
import { loadWallet } from '../../actions/initAction'
import WalletBox from './walletBox'

class InitPage extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Init",
      header: "Times-Pay"
    }
  }
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    setI18nConfig()
  }

  componentDidUpdate() {
  }

  // #TODO fetch wallet balance
  // #TODO add fix top menu bar
  // #TODO add navigation drawer
  render() {
    return (
      <>
        <Spinner visible={this.state.loading} textContent={'Loading...'} animatioon="fade" textStyle={{fontSize: wp('5%')}}/>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity>
              <FeatherIcon name="menu" size={wp('8%')} style={styles.menuBtn} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerText}>Times-Pay</Text>
            </View>
          </View>
          <View style={{flex: 2}}>
            <WalletBox></WalletBox>
          </View>

          <ScrollView contentInsetAdjustmentBehavior="automatic">
          </ScrollView>
        </SafeAreaView>
      </>
    )
  }
}

const mapStateToProps = (state) => {
  const initReducer = getInitState(state)
  return { initReducer }
}
const mapDispatchToProps = dispatch => {
  return {
    loadWallet: (payload) => dispatch(loadWallet(payload))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(InitPage)

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center"
  },
  header: {
    flexDirection: "row",
    height: "10%",
    justifyContent: "center"
  },
  menuBtn: {
    padding: wp('3%'),
  },
  headerText: {
    fontSize: wp('6%'),
    paddingVertical: wp('3%'),
    textAlign: "center"
  }
})
