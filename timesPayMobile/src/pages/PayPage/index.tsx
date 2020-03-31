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
  Image,
  Dimensions,
} from 'react-native';
import {Card, CardItem} from 'native-base';
import React from 'react';
import {COLOR} from 'react-native-material-ui';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {translate} from '../../utils/I18N';
import {connect} from 'react-redux';
import * as Permissions from 'expo-permissions';
import * as LocalAuthentication from 'expo-local-authentication';
import Spinner from 'react-native-loading-spinner-overlay';
// import NfcManager, { NfcEvents } from 'react-native-nfc-manager';

import {
  payStart,
  paySuccess,
  payFailed,
  payStartRequest,
  payEstimate,
  payReset,
} from '../../actions/payAction';
import {
  getDepositState,
  getInitState,
  getPayState,
  getExchangeState,
  getGlobalSettingState,
} from '../../reducers/selectors';
import {InitStateType} from '../../reducers/initReducer';
import {DepositStateType} from '../../reducers/depositReducer';
import {PayStateType} from '../../reducers/payReducer';
import {ExchangeStateType} from '../../reducers/exchangeReducer';
import errCode from '../../utils/errCode';
import {stateUpdater} from '../../utils/stateUpdater';
import globalStyle from '../../utils/globalStyle';
import fingerPrint from '../../assets/fingerPrint.png';
import BasicLayout from '../../component/BasicLayout';
import {getSetting} from '../../actions/globalSettingAction';
import {Dispatch} from 'redux';
import {globalSettingStateType} from '../../reducers/globalSettingReducer';

interface PayProps {
  depositReducer: DepositStateType;
  initReducer: InitStateType;
  payReducer: PayStateType;
  exchangeReducer: ExchangeStateType;
  payEstimate: (payload: any) => void;
  globalSettingReducer: globalSettingStateType;
  reset: () => void;
}

interface PayPageState extends PayStateType {
  hasPermission: boolean;
  scanned: boolean;
  confirmedPay: boolean;
  paymentWayModalVisible: boolean;
  paymentMethod: 'QRCode' | 'NFC' | null;
  destAddress: string;
  status: string;
  authcated: boolean;
}

const DEBUG = true;
class PayPage extends React.Component<PayProps, PayPageState> {
  scanner: QRCodeScanner | null = null;
  NfcManager: any;
  constructor(props: any) {
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
      amount: '0',
      paymentWayModalVisible: false,
      paymentMethod: null,
      destAddress: this.props.payReducer.destAddress,
      status: '',
      authcated: false,
    };
  }
  componentDidMount() {
    console.log('componentDidMount');
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
      amount: '0',
      paymentWayModalVisible: true,
      paymentMethod: null,
      destAddress: this.props.payReducer.destAddress,
      status: '',
      authcated: false,
    });
    const getPermission = () => {
      Permissions.askAsync(Permissions.CAMERA).then(({status}) => {
        if (status !== 'granted') {
          alert(
            'Hey! You might want to enable notifications for my app, they are good.',
          );
          this.setState({
            hasPermission: false,
          });
        } else if (status == 'granted') {
          alert('permission granted');
          this.setState({
            hasPermission: true,
          });
        }
      });
      if (!DEBUG) {
        LocalAuthentication.hasHardwareAsync().then(hasHardware => {
          console.log('hasHardware', hasHardware);
          if (hasHardware) {
            LocalAuthentication.supportedAuthenticationTypesAsync().then(
              supportedType => {
                console.log('supportedType', supportedType);
                LocalAuthentication.authenticateAsync().then(res => {
                  console.log('auth touch id', res);
                  this.setState({
                    status: 'auth',
                    authcated: res.success ? true : false,
                  });
                });
              },
            );
          }
        });
      }
      Permissions.askAsync(Permissions);
    };
    getPermission();
    this.props.navigation.addListener('didFocus', (e: any) => {
      getPermission();
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
        amount: '0',
        paymentWayModalVisible: true,
        paymentMethod: null,
        authcated: false,
      });
      if (this.scanner) {
        this.scanner.reactivate();
      }
    });
    this.props.navigation.addListener('didBlur', (e: any) => {
      this.props.reset();
      this.setState({
        loading: false,
        status: "",
        address: "",
        errCode: null,
        wallet: null,
        destAddress: "",
        estimatedCost: "",
        confirmedPay: false,
        hasPermission: null,
        scanned: true,
        amount: '0',
        paymentWayModalVisible: false,
        paymentMethod: null,
        authcated: false,
      });
    });
  }
  componentDidUpdate() {
    stateUpdater(this, 'loading', 'payReducer');
    stateUpdater(this, 'errCode', 'payReducer');
    stateUpdater(this, 'destAddress', 'payReducer');
    stateUpdater(this, 'estimatedCost', 'payReducer');
    stateUpdater(this, 'destAddress', 'payReducer');
    stateUpdater(this, 'info', 'payReducer');
    console.log('pay componentDidUpdate', this.props);
  }
  onChangeText(text) {
    if (!isNaN(parseFloat(text)) && isFinite(text)) {
      this.setState({
        amount: text.toString(),
      });
    }
  }
  handleOnRead(e) {
    if (!this.state.loading && !this.props.payReducer.loading) {
      this.setState({
        scanned: true,
        loading: true,
      });
      const dataArray = e.data.split('|');
      if (dataArray.length > 1) {
        this.setState({
          amount: dataArray[1],
        });
      }
      this.props.payEstimate({
        destAddress: dataArray[0],
        contract: this.props.exchangeReducer.contract,
        amount: (
          parseFloat(dataArray.length > 1 ? dataArray[1] : this.state.amount) *
          1000000
        ).toString(),
        wallet: this.props.initReducer.wallet,
      });
    }
  }
  render() {
    return (
      <>
        <BasicLayout
          containerStyle={styles.scrollView}
          title="Pay"
          children={
            <>
              <ScrollView
                style={{
                  minHeight: Dimensions.get('window').height,
                }}>
                <Spinner visible={this.state.loading} textContent={'Pending'} />
                <Card>
                  <CardItem cardBody bordered />
                  <CardItem
                    cardBody
                    bordered
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                    }}>
                    {(this.state.hasPermission || DEBUG) &&
                    !this.state.scanned ? (
                      <QRCodeScanner
                        onRead={
                            e => this.handleOnRead(e)
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
                        ref={node => {
                          this.scanner = node;
                        }}
                        reactivate={true}
                        reactivateTimeout={500}
                        cameraProps={{
                          ratio: '1:1',
                        }}
                      />
                    ) : this.state.paymentMethod == 'NFC' ? (
                      <Text>{translate('pay_NFCDetail')}</Text>
                    ) : (
                      <View />
                    )}
                  </CardItem>
                  <CardItem style={styles.payAmountInput}>
                    <Text>{`amount to pay: ${this.state.amount}`}</Text>
                  </CardItem>
                  {this.state.estimatedCost == 0 && !this.state.scanned ? (
                    <CardItem cardBody bordered>
                      <TextInput
                        style={{
                          height: 40,
                          borderColor: 'black',
                          borderWidth: 1,
                        }}
                        onChangeText={text => this.onChangeText(text)}
                        value={this.state.amount}
                        keyboardType={'decimal-pad'}
                        placeholder="amount"
                      />
                    </CardItem>
                  ) : (
                    <View />
                  )}
                  {this.state.estimatedCost == 0 ? (
                    <View />
                  ) : (
                    <CardItem cardBody bordered>
                      <Text>
                        {`estimated cost: ${parseFloat(
                          this.state.estimatedCost,
                        ) / 1000000} USD`}
                      </Text>
                    </CardItem>
                  )}
                  {this.state.destAddress == null ? (
                    <View />
                  ) : (
                    <Text>Pay to :{this.state.destAddress}</Text>
                  )}
                  {this.state.estimatedCost == 0 ? (
                    <View />
                  ) : (
                    <CardItem
                      cardBody
                      bordered
                      button
                      disabled={this.state.estimatedCost == 0}
                      onPress={() => {
                        this.props.pay({
                          destAddress: this.state.destAddress,
                          contract: this.props.exchangeReducer.contract,
                          amount: (
                            parseFloat(this.state.amount) * 1000000
                          ).toString(),
                          wallet: this.props.initReducer.wallet,
                        });
                      }}
                      style={styles.confirmButton}>
                      <Text style={styles.buttonText}>
                        {translate('pay_confirm')}
                      </Text>
                    </CardItem>
                  )}
                  <CardItem cardBody bordered>
                    {this.state.scanned && (
                      <Button
                        title={'Tap to Scan Again'}
                        onPress={() => {
                          this.props.reset();
                          this.setState({scanned: false});
                        }}
                      />
                    )}
                  </CardItem>
                  <CardItem footer>
                    {this.state.info != '' && (
                      <Text>{translate(this.state.info)}</Text>
                    )}
                  </CardItem>
                </Card>
                <Modal visible={!this.state.authcated && !DEBUG}>
                  <Card style={styles.newWalletConfirmModal}>
                    <CardItem cardBody>
                      <Image
                        source={fingerPrint}
                        style={{
                          minWidth: '100%',
                          minHeight: '50%',
                        }}
                      />
                    </CardItem>
                    <CardItem>
                      <Text>{translate('pay_auth')}</Text>
                    </CardItem>
                  </Card>
                </Modal>
              </ScrollView>
            </>
          }
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  ...globalStyle,
  scrollView: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignContent: 'center',
  },
  payAmountInput: {
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: COLOR.blue800,
    height: 48,
  },
  buttonText: {
    color: COLOR.white,
  },
});
const mapStateToProps = (state: any) => {
  const depositReducer = getDepositState(state);
  const initReducer = getInitState(state);
  const payReducer = getPayState(state);
  const exchangeReducer = getExchangeState(state);
  const globalSettingReducer = getGlobalSettingState(state);
  return {
    depositReducer,
    initReducer,
    payReducer,
    exchangeReducer,
    globalSettingReducer,
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    pay: (payload: any) => dispatch(payStartRequest(payload)),
    paySuccess: (payload: any) => dispatch(paySuccess(payload)),
    payFailed: (payload: any) => dispatch(payFailed(payload)),
    payEstimate: (payload: any) => dispatch(payEstimate(payload)),
    getSetting: () => dispatch(getSetting()),
    reset: () => dispatch(payReset()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PayPage);
