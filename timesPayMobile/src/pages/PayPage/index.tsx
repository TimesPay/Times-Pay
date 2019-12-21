import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  TouchableOpacity
} from 'react-native';
import React from 'react';
import { Navigation } from 'react-native-navigation';
import { COLOR } from 'react-native-material-ui';
import QRCodeScanner from 'react-native-qrcode-scanner';

import { translate } from '../../utils/I18N';
import { connect } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-community/async-storage';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { CameraKitCameraScreen, } from 'react-native-camera-kit';
import * as Permissions from 'expo-permissions';

import {
  payStart,
  paySuccess,
  payFailed,
  payStartRequest
} from '../../actions/payAction';
import { getDepositState, getInitState, getPayState } from '../../reducers/selectors';
import { InitStateType } from '../../reducers/initReducer';
import { DepositStateType } from '../../reducers/depositReducer';
import { PayStateType } from '../../reducers/payReducer';
import errCode from '../../utils/errCode';
import { stateUpdater } from '../../utils/stateUpdater'

interface PayProps {
  depositReducer: DepositStateType,
  initReducer: InitStateType,
  payReducer: PayStateType,
}

interface PayPageState extends PayStateType {
  hasPermission: boolean,
  scanned: boolean
}

class PayPage extends React.Component<PayProps, PayPageState> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Pay",
    };
  };
  scanner: QRCodeScanner;
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.payReducer.loading,
      status: this.props.payReducer.status,
      address: this.props.depositReducer.address,
      errCode: this.props.payReducer.errCode,
      wallet: this.props.initReducer.errCode,
      destAddress: this.props.payReducer.destAddress,
      hasPermission: null,
      scanned: false,
    }
  }
  componentDidMount() {
    this.setState({
      loading: this.props.payReducer.loading,
      status: this.props.payReducer.status,
      address: this.props.depositReducer.address,
      errCode: this.props.payReducer.errCode,
      wallet: this.props.initReducer.errCode,
      destAddress: this.props.payReducer.destAddress,
      hasPermission: null,
      scanned: false
    })
    const getPermission = () => {
      Permissions.askAsync(Permissions.CAMERA).then(({ status }) => {
        if (status !== 'granted') {
          alert('Hey! You might want to enable notifications for my app, they are good.');
        } else if (status == "granted") {
          alert("permission granted")
          this.setState({
            hasPermission: true
          })
        }
      });
    }
    getPermission();
  }
  componentDidUpdate() {
    // if(this.state.loading != this.props.payReducer.loading){
    //   this.setState({
    //     loading: this.props.payReducer.loading
    //   })
    // }
    // if(this.state.errCode != this.props.payReducer.errCode) {
    //   this.setState({
    //     errCode: this.props.payReducer.errCode
    //   })
    // }
    stateUpdater(this, "loading", "payReducer");
    stateUpdater(this, "errCode", "payReducer");
    stateUpdater(this, "destAddress", "payReducer");
  }
  handleOnRead(e) {
    console.log("handleOnRead", e);
    if(! this.state.loading && ! this.props.payReducer.loading) {
      this.setState({
        scanned: true,
        loading: true
      });
      console.log(e.data);
      this.props.pay({
        destAddress: e.data,
        wallet: this.props.initReducer.wallet
      });
    }
  }
  render() {
    return (
      <>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-end',
              minHeight: 500,
              maxHeight: 600,
              minWidth: 200,
              maxWidth: 250
            }}>
            {
              this.state.hasPermission && ! this.state.scanned
                ? <QRCodeScanner
                  onRead={this.state.scanned
                    ? undefined
                    : (e) => this.handleOnRead(e)
                  }
                  topContent={
                    <Text style={styles.centerText}>
                      Please scan QR-Code to Pay
                    </Text>
                  }
                  bottomContent={
                    <TouchableOpacity style={styles.buttonTouchable}>
                      <Text style={styles.buttonText}>OK. Got it!</Text>
                    </TouchableOpacity>
                  }
                  ref={(node)=> {this.scanner = node}}
                  reactivate={false}
                  reactivateTimeout={10}
                />
                : <Text>{this.props.payReducer.destAddress}</Text>
            }
            <View>
              {this.state.scanned && <Button
                title={'Tap to Scan Again'}
                onPress={() => {
                  this.setState({ scanned: false })
                }} />
              }
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLOR.yellow50,
    color: COLOR.blue50
  },

})
const mapStateToProps = (state) => {
  const depositReducer = getDepositState(state);
  const initReducer = getInitState(state);
  const payReducer = getPayState(state);
  return { depositReducer, initReducer, payReducer };
}
const mapDispatchToProps = dispatch => {
  return {
    pay: (payload) => dispatch(payStartRequest(payload)),
    paySuccess: (payload) => dispatch(paySuccess(payload)),
    payFailed: (payload) => dispatch(payFailed(payload)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(PayPage);
