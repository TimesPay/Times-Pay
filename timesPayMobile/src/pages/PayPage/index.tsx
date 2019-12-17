import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button
} from 'react-native';
import React from 'react';
import { Navigation } from 'react-native-navigation';
// import QRCodeScanner from 'react-native-qrcode-scanner';

import { translate } from '../../utils/I18N';
import { connect } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-community/async-storage';

import { getDepositState, getInitState, getPayState } from '../../reducers/selectors';
import { InitStateType } from '../../reducers/initReducer';
import { DepositStateType } from '../../reducers/depositReducer';
import { PayStateType } from '../../reducers/payReducer';
import errCode from '../../utils/errCode';

interface PayProps {
  depositReducer: DepositStateType,
  initReducer: InitStateType,
  payReducer: PayStateType,
}

interface PayPageState extends PayStateType {
}

class PayPage extends React.Component<PayProps, PayPageState> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Initial",
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.payReducer.loading,
      status: this.props.payReducer.status,
      address: this.props.depositReducer.address,
      errCode: this.props.payReducer.errCode,
      wallet: this.props.initReducer.errCode,
      destAddress: this.props.payReducer.destAddress
    }
  }
  componentDidMount() {
    this.setState({
      loading: this.props.payReducer.loading,
      status: this.props.payReducer.status,
      address: this.props.depositReducer.address,
      errCode: this.props.payReducer.errCode,
      wallet: this.props.initReducer.errCode,
      destAddress: this.props.payReducer.destAddress
    })
  }
  render() {
    return (
      <>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View>
            {/* <QRCodeScanner
              onRead={(e) => console.log(e)}
              flashMode={QRCodeScanner.Constants.FlashMode.torch}
              topContent={
                <Text style={styles.centerText}>
                </Text>
              }
              bottomContent={
                <TouchableOpacity style={styles.buttonTouchable}>
                  <Text style={styles.buttonText}>OK. Got it!</Text>
                </TouchableOpacity>
              }
            /> */}
          </View>
          <View>
            <Text>{this.state.address || "N/A"}</Text>
          </View>
        </ScrollView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLOR.yellow50,
    color: COLOR.blue50,
    marginLeft: '10%'
  },
})
const mapStateToProps = (state) => {
  const depositReducer = getDepositState(state)
  const initReducer = getInitState(state);
  const payReducer = getPayState(state);
  console.log("deposit", depositReducer);
  return { depositReducer, initReducer, payReducer };
}
const mapDispatchToProps = dispatch => {
  return {
    fetchStart: () => dispatch({ type: "fetchStart" }),
    fetchSuccess: () => dispatch({ type: "fetchSuccess" }),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(PayPage);
