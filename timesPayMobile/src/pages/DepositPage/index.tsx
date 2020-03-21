import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  Dimensions,
  Clipboard,
  ToastAndroid,
  Modal,
  TextInput
} from 'react-native';
import React from 'react';
import { COLOR } from 'react-native-material-ui';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';

import { getDepositState, getInitState, getGlobalSettingState } from '../../reducers/selectors';
import { DepositStateType } from '../../reducers/depositReducer';
import { InitStateType } from '../../reducers/initReducer';
import BasicLayout from '../../component/BasicLayout';
import { globalSettingStateType } from '../../reducers/globalSettingReducer';
import { getSetting } from '../../actions/globalSettingAction';
import { translate } from '../../utils/I18N';

interface DepositProps {
  depositReducer: DepositStateType,
  initReducer: InitStateType,
  getSetting: () => void,
  globalSettingReducer: globalSettingStateType,
};
interface DepositState extends DepositStateType {
  modalVisible: boolean,
  amount: string | number | null,
};

class DepositPage extends React.Component<DepositProps, DepositState> {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      loading: this.props.depositReducer.loading,
      address: this.props.initReducer.wallet!.signingKey.address,
      modalVisible: true,
      amount: null
    }
  }
  componentDidMount() {
    this.setState({
      modalVisible: true
    })
  }
  componentDidUpdate() {
    if (this.state.loading != this.props.depositReducer.loading) {
      this.setState({ loading: this.props.depositReducer.loading });
    }
  }
  render() {
    console.log("DepositPage");
    return (
      <BasicLayout
        containerStyle={styles.scrollView}
        title="Deposit"
        children={
          <>
            <View
              style={this.state.modalVisible ? styles.maskedView : styles.normalView}
            >
              <View
                style={styles.QRCodeContainer}
              >
                <QRCode
                  value={`${this.state.address}|${this.state.amount}` || "N/A"}
                />
              </View>
              <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                }}
              >
                <View style={styles.amountModal}>
                  <View>
                    <Text
                      style={{
                        color: "rgba(255, 255, 255, 1)",
                        position: "relative",
                        alignSelf: "center",
                        fontSize: 24,
                        marginTop: 30
                      }}
                    >
                      {translate("deposit_amount", {})}
                    </Text>
                  </View>
                  <View>
                    <TextInput
                      onChangeText={text => this.setState({
                        amount: text
                      })}
                      onEndEditing={e => this.setState({
                        modalVisible: false
                      })}
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: "rgba(255, 255, 255, 1)",
                        color: "rgba(255, 255, 255, 1)",
                        marginTop: 30
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        color: "rgba(255, 255, 255, 1)",
                        position: "relative",
                        alignSelf: "center",
                        fontSize: 24,
                        marginTop: 30
                      }}
                      onPress={() => this.setState({
                        modalVisible: false
                      })}
                    >
                      finsihed
                    </Text>
                  </View>
                </View>
              </Modal>
              <View>
                {
                  this.state.address
                    ? <Text
                      style={styles.addressText}
                      ellipsizeMode="tail"
                      onPress={() => {
                        Clipboard.setString(this.state.address);
                        ToastAndroid.showWithGravity(translate("deposit_addressCopied", {}), ToastAndroid.SHORT, ToastAndroid.CENTER)
                      }}
                    >
                      {this.state.address}
                    </Text>
                    : <View></View>
                }
              </View>
              <View
                style={styles.otherPaymentButton}
              >
                <Button onPress={() => {
                  this.setState({
                    amount: 0,
                    modalVisible: true
                  })
                }}
                  title={translate("deposit_otherPayment", {})}
                >
                  <Text>{translate("deposit_otherPayment", {})}</Text>
                </Button>
              </View>
              <View
                style={styles.otherPaymentButton}
              >
              <Text>{translate("deposit_instructionOne", {})}</Text>
              <Text>{translate("deposit_instructionTwo", {})}</Text>
              </View>
            </View>
          </>
        }
      />
    );
  }
}
const mapStateToProps = (state) => {
  const depositReducer = getDepositState(state);
  const initReducer = getInitState(state);
  const globalSettingReducer = getGlobalSettingState(state);
  console.log("deposit", depositReducer);
  return { depositReducer, initReducer, globalSettingReducer };
}
const mapDispatchToProps = dispatch => {
  return {
    fetchStart: () => dispatch({ type: "fetchStart" }),
    fetchSuccess: () => dispatch({ type: "fetchSuccess" }),
    getSetting: () => dispatch(getSetting()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DepositPage);

const styles = StyleSheet.create({
  scrollView: {
    display: "flex",
    alignContent: "center",
    minHeight: Dimensions.get("window").height,
    minWidth: Dimensions.get("window").width * 0.8,
    elevation: 1
  },
  QRCodeContainer: {
    marginTop: "30%",
    marginLeft: "35%",
    marginRight: "35%",
    width: "30%",
    position: "relative",
    zIndex: 0,
    elevation: 0,
  },
  addressText: {
    marginTop: 20,
    marginLeft: "10%",
    marginRight: "10%",
    width: "80%"
  },
  otherPaymentButton: {
    marginTop: "10%"
  },
  amountModal: {
    height: Dimensions.get("screen").height * 0.36,
    marginTop: "37%",
    backgroundColor: "rgba(0, 0, 0, 1)",
    color: "white",
    position: "relative",
    zIndex: 2,
    elevation: 2
  },
  maskedView: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "relative",
    zIndex: 1,
    elevation: 1,
    minHeight: Dimensions.get("window").height,
  },
  normalView: {
    minHeight: Dimensions.get("window").height,
  }
})
