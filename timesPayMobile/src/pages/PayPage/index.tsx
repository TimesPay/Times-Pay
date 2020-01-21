import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Image
} from 'react-native';
import {
  Card,
  CardItem,
} from 'native-base'
import React from 'react';
import { Navigation } from 'react-native-navigation';
import { COLOR } from 'react-native-material-ui';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { translate } from '../../utils/I18N';
import { connect } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-community/async-storage';
import * as Permissions from 'expo-permissions';
import * as LocalAuthentication from 'expo-local-authentication';
import Spinner from 'react-native-loading-spinner-overlay';
// import NfcManager, { NfcEvents } from 'react-native-nfc-manager';

import {
  payStart,
  paySuccess,
  payFailed,
  payStartRequest,
  payEstimate
} from '../../actions/payAction';
import {
  getDepositState,
  getInitState,
  getPayState,
  getExchangeState
} from '../../reducers/selectors';
import { InitStateType } from '../../reducers/initReducer';
import { DepositStateType } from '../../reducers/depositReducer';
import { PayStateType } from '../../reducers/payReducer';
import { ExchangeStateType } from '../../reducers/exchangeReducer';
import errCode from '../../utils/errCode';
import { stateUpdater } from '../../utils/stateUpdater';
import globalStyle from '../../utils/globalStyle';
import fingerPrint from '../../assets/fingerPrint.png'

interface PayProps {
  depositReducer: DepositStateType,
  initReducer: InitStateType,
  payReducer: PayStateType,
  exchangeReducer: ExchangeStateType
}

interface PayPageState extends PayStateType {
  hasPermission: boolean,
  scanned: boolean,
  confirmedPay: boolean,
  paymentWayModalVisible: boolean,
  paymentMethod: "QRCode" | "NFC" | null,
  destAddress: string,
  status: string,
  authcated: boolean
}

class PayPage extends React.Component<PayProps, PayPageState> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Pay",
    };
  };
  scanner: QRCodeScanner;
  NfcManager: any;
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.payReducer.loading,
      status: this.props.payReducer.status,
      address: this.props.depositReducer.address,
      errCode: this.props.payReducer.errCode,
      wallet: this.props.initReducer.errCode,
      destAddress: this.props.payReducer.destAddress,
      estimatedCost: this.props.payReducer.estimatedCost,
      confirmedPay: false,
      hasPermission: null,
      scanned: false,
      amount: "0",
      paymentWayModalVisible: false,
      paymentMethod: null,
      destAddress: this.props.payReducer.destAddress,
      status: "",
      authcated: false
    }
    // this.NfcManager = NfcManager;
  }
  componentDidMount() {
    console.log("componentDidMount");
    this.setState({
      loading: this.props.payReducer.loading,
      status: this.props.payReducer.status,
      address: this.props.depositReducer.address,
      errCode: this.props.payReducer.errCode,
      wallet: this.props.initReducer.errCode,
      destAddress: this.props.payReducer.destAddress,
      estimatedCost: this.props.payReducer.estimatedCost,
      confirmedPay: false,
      hasPermission: null,
      scanned: false,
      amount: "0",
      paymentWayModalVisible: true,
      paymentMethod: null,
      destAddress: this.props.payReducer.destAddress,
      status: "",
      authcated: false
    })
    const getPermission = () => {
      Permissions.askAsync(Permissions.CAMERA).then(({ status }) => {
        if (status !== 'granted') {
          alert('Hey! You might want to enable notifications for my app, they are good.');
          this.setState({
            hasPermission: false
          })
        } else if (status == "granted") {
          alert("permission granted")
          this.setState({
            hasPermission: true
          })
        }
      });
      LocalAuthentication.hasHardwareAsync().then(hasHardware => {
        console.log("hasHardware", hasHardware)
        if (hasHardware) {
          LocalAuthentication.supportedAuthenticationTypesAsync().then(supportedType => {
            console.log("supportedType", supportedType);
            LocalAuthentication.authenticateAsync().then(res => {
              console.log("auth touch id", res);
              this.setState({
                status: "auth",
                authcated: res.success ? true : false
              })
            })
          })
        }
      })
      Permissions.askAsync(Permissions)
    }
    getPermission();
  }
  componentDidUpdate() {
    stateUpdater(this, "loading", "payReducer");
    stateUpdater(this, "errCode", "payReducer");
    stateUpdater(this, "destAddress", "payReducer");
    stateUpdater(this, "estimatedCost", "payReducer");
    stateUpdater(this, "destAddress", "payReducer");
    stateUpdater(this, "info", "payReducer");
  }
  onChangeText(text) {
    if (!isNaN(parseFloat(text)) && isFinite(text)) {
      this.setState({
        amount: text.toString()
      })
    }
  }
  handleOnRead(e) {
    console.log("handleOnRead", e.data);
    if (!this.state.loading && !this.props.payReducer.loading) {
      this.setState({
        scanned: true,
        loading: true
      });
      this.props.payEstimate({
        destAddress: e.data,
        contract: this.props.exchangeReducer.contract,
        amount: this.state.amount,
        wallet: this.props.initReducer.wallet
      });
    }
  }
  render() {
    const PaymentWayModal = (props) => {
      return (
        <Modal
          visible={props.paymentWayModalVisible}
        >
          <Card>
            <CardItem header>
              <Text>{translate("pay_paymentModalHeader")}</Text>
            </CardItem>
            <CardItem cardBody button
              onPress={() => this.setState({
                paymentMethod: "QRCode",
                paymentWayModalVisible: false
              })}
            >
              <Text>{translate("pay_QRCode")}</Text>
            </CardItem>
            <CardItem cardBody button
              onPress={() => {
                this.setState({
                  paymentMethod: "NFC",
                  paymentWayModalVisible: false
                });
                if (Platform.OS == "android") {
                  {/* if(this.NfcManager.isEnabled()){
                    this.NfcManager.start().then((e) => {
                      console.log("start", e);
                      this.NfcManager.getLaunchTagEvent().then((tag)=>{
                        console.log("tag", tag);
                        if(tag != null) {
                          this.NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
                            console.warn("tag set listener", tag);
                            this.NfcManager.setAlertMessageIOS('I got your tag!');
                            this.NfcManager.unregisterTagEvent().catch(() => 0);
                          });
                        }
                      })
                    })
                  } else {
                    console.log("NFC not enabled");
                  }; */}
                }
              }}
            >
              <Text>{translate("pay_NFC")}</Text>
            </CardItem>
          </Card>
        </Modal>
      )
    }
    return (
      <>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <Spinner
            visible={this.state.loading}
            textContent={'Pending'}
          />
          {/* <PaymentWayModal
            paymentWayModalVisible={this.state.paymentWayModalVisible}
          /> */}
          <Card>
            <CardItem cardBody bordered>

            </CardItem>
            <CardItem
              cardBody
              bordered
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}>
              {
                this.state.hasPermission
                  && !this.state.scanned
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
                    ref={(node) => { this.scanner = node }}
                    reactivate={false}
                    cameraProps={{
                      ratio: "1:1"
                    }}
                  />
                  : this.state.paymentMethod == "NFC"
                    ? <Text>{translate("pay_NFCDetail")}</Text>
                    : <View></View>
              }
            </CardItem>
            <CardItem
              style={styles.payAmountInput}
            >
              <Text>
                {`amount to pay: ${this.state.amount}`}
              </Text>
            </CardItem>
            <CardItem cardBody bordered>
              <TextInput
                style={{ height: 40, borderColor: 'black', borderWidth: 1 }}
                onChangeText={text => this.onChangeText(text)}
                value={this.state.amount}
                keyboardType={"decimal-pad"}
                placeholder="amount"
              />
            </CardItem>
            {
              this.state.estimatedCost == 0
                ? <View></View>
                : <CardItem
                  cardBody
                  bordered
                >
                  <Text>
                    {`estimated cost: ${this.state.estimatedCost} wei`}
                  </Text>
                </CardItem>
            }
            {
              this.state.destAddress == null
                ? <View></View>
                : <Text>Pay to :{this.state.destAddress}</Text>
            }
            {
              this.state.estimatedCost == 0
                ? <View></View>
                : <CardItem
                  cardBody
                  bordered
                  button
                  disabled={this.state.estimatedCost == 0}
                  onPress={() => {
                    this.props.pay({
                      destAddress: this.state.destAddress,
                      contract: this.props.exchangeReducer.contract,
                      amount: this.state.amount,
                      wallet: this.props.initReducer.wallet
                    })
                  }}
                  style={styles.confirmButton}
                >
                  <Text
                    style={styles.buttonText}
                  >
                    {translate("pay_confirm")}
                  </Text>
                </CardItem>
            }
            <CardItem cardBody bordered>
              {this.state.scanned && <Button
                title={'Tap to Scan Again'}
                onPress={() => {
                  this.setState({ scanned: false })
                }} />
              }
            </CardItem>
            <CardItem
              footer
            >
              {
                this.state.info != "" &&
                <Text>{translate(this.state.info)}</Text>
              }
            </CardItem>
          </Card>
          <Modal
            visible={!this.state.authcated}
          >
            <Card
              style={styles.newWalletConfirmModal}
            >
              <CardItem cardBody>
                <Image
                  source={fingerPrint}
                  style={{
                    minWidth: "100%",
                    minHeight: "50%"
                  }}
                />
              </CardItem>
              <CardItem>
                <Text>{translate("pay_auth")}</Text>
              </CardItem>
            </Card>
          </Modal>
        </ScrollView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  ...globalStyle,
  scrollView: {
    backgroundColor: COLOR.yellow50,
    color: COLOR.blue50
  },
  payAmountInput: {
    marginTop: 10
  },
  confirmButton: {
    backgroundColor: COLOR.blue800,
    height: 48
  },
  buttonText: {
    color: COLOR.white
  }
})
const mapStateToProps = (state) => {
  const depositReducer = getDepositState(state);
  const initReducer = getInitState(state);
  const payReducer = getPayState(state);
  const exchangeReducer = getExchangeState(state);
  return { depositReducer, initReducer, payReducer, exchangeReducer };
}
const mapDispatchToProps = dispatch => {
  return {
    pay: (payload) => dispatch(payStartRequest(payload)),
    paySuccess: (payload) => dispatch(paySuccess(payload)),
    payFailed: (payload) => dispatch(payFailed(payload)),
    payEstimate: (payload) => dispatch(payEstimate(payload)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(PayPage);
