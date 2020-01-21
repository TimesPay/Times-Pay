import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Clipboard
} from 'react-native';
// import Modal from 'react-native-modal';
import React, { useState } from 'react';
import { Navigation } from 'react-native-navigation';
import Col, { Row } from 'react-native-col';
import { translate } from '../../utils/I18N';

import { connect } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-community/async-storage';
import { ethers } from 'ethers';
import { COLOR } from 'react-native-material-ui';
import {
  Card,
  Button,
  CardItem,
} from 'native-base'
import { TouchableHighlight } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';

import { getDepositState, getInitState } from '../../reducers/selectors';
import { InitStateType } from '../../reducers/initReducer';
import { DepositStateType } from '../../reducers/depositReducer';
import {
  LOAD_WALLET_INIT,
  SET_ADDRESS_DEPOSIT
} from '../../actions/actionTypes';
import errCode from '../../utils/errCode'
import { deepCompare } from '../../utils/deepCompare';
import { setI18nConfig } from '../../utils/I18N';
import { generateKey, encrypt, decrypt } from '../../utils/cryptograohy';
import { getDecryptedWallet } from '../../api/wallet';
import {
  createWallet,
  loadWallet
} from '../../actions/initAction';
import globalStyle from '../../utils/globalStyle'
import duckImg from '../../assets/duck.png';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface InitProps {
  depositReducer: DepositStateType,
  initReducer: InitStateType
};
interface InitPageState extends InitStateType {
  address: string;
  loadingStatus: string;
  wallet: string;
  backupPassPharse: string;
  createNewWalletModalVisble: boolean;
  recoverWalletModalVisible: boolean;
  passwordPromptVisible: boolean;
  registeredPromptVisible: boolean;
  warningText: string;
};

class InitPage extends React.Component<InitProps, InitPageState> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Initial",
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: this.props.depositReducer.loading,
      status: this.props.depositReducer.status,
      address: this.props.depositReducer.address,
      errCode: this.props.initReducer.errCode,
      createNewWalletModalVisble: false,
      recoverWalletModalVisible: false,
      passwordPromptVisible: false,
      registeredPromptVisible: false,
      loadingStatus: "",
      wallet: null,
      backupPassPharse: "",
      warningText: ""
    }
  }

  componentDidMount() {
    setI18nConfig();
    console.log(this.props.depositReducer.address.length);
    this.setState({
      loading: this.props.initReducer.loading,
      status: this.props.initReducer.status,
      address: this.props.depositReducer.address,
      errCode: this.props.initReducer.errCode,
      createNewWalletModalVisble: false,
      recoverWalletModalVisible: false,
      passwordPromptVisible: false,
      registeredPromptVisible: true,
      loadingStatus: "",
      wallet: null,
      backupPassPharse: ""
    })
  }

  componentDidUpdate() {
    if (this.props.initReducer.wallet != null) {
      if (!deepCompare(this.props.initReducer.wallet, this.state.wallet)) {
        this.setState({
          wallet: this.props.initReducer.wallet,
          createNewWalletModalVisble: false,
          recoverWalletModalVisible: false,
          passwordPromptVisible: false
        })
        this.props.setAddress({
          address: this.props.initReducer.wallet.signingKey.address
        });
      }
    }
    console.log("componentDidMount", this.props.initReducer.errCode);
    if (this.props.initReducer.errCode == errCode["loadWallet.noWallet"]) {
      if (this.state.errCode == null ||
        this.state.errCode == undefined) {
        this.setState({
          createNewWalletModalVisble: true,
          errCode: this.props.initReducer.errCode
        });
      }
    } else if (this.props.initReducer.errCode == errCode["loadWallet.incorrectPW"]) {
      if (this.state.errCode != this.props.initReducer.errCode) {
        this.setState({
          passwordPromptVisible: true,
          errCode: this.props.initReducer.errCode
        });
      }
    } else {
      if (this.props.initReducer.errCode != null) {
        if (this.state.errCode != this.props.initReducer.errCode) {
          this.setState({
            errCode: this.props.initReducer.errCode
          })
        }
      }
    }
    if (this.state.loading != (this.props.initReducer.loading || this.props.depositReducer.loading)) {
      this.setState({ loading: (this.props.initReducer.loading || this.props.depositReducer.loading) });
    }
  }

  render() {
    const CreateWalletModal = (props) => {
      const [passPharse, setPassPharse] = useState("");
      return (
        <View>
          <Modal visible={props.createNewWalletModalVisble}
            animationType="slide"
            transparent={true}>

            <Card style={{...styles.newWalletConfirmModal, zIndex: 1}}>
              <CardItem header>
                <Text style={{ fontSize: 20, paddingVertical: 15 }}>Do you want to create a new wallet?</Text>
              </CardItem>

              <CardItem cardBody>
                <TextInput
                  editable
                  maxLength={40}
                  onChangeText={(text) => {
                    setPassPharse(text);
                  }}
                  value={passPharse}
                  placeholder="Password"
                  style={styles.passwordInputBox}
                  clearButtonMode="unless-editing"
                  secureTextEntry={true}
                  textContentType="newPassword"
                />
              </CardItem>

              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <TouchableHighlight
                    style={styles.modalButton}
                    underlayColor={COLOR.grey100}
                    activeOpacity={0.3}
                    disabled={passPharse.length == 0}
                  >
                    <Text
                      style={{ ...styles.modalButtonText, color: COLOR.lightGreen600 }}
                      onPress={() => {
                        console.log("clicked");
                        let newWallet = new ethers.Wallet.createRandom();
                        console.log("wallet", newWallet);
                        this.props.createWallet({
                          wallet: newWallet,
                          passPharse: passPharse
                        });
                      }}
                    >
                      {translate("init_yes")}
                    </Text>
                  </TouchableHighlight>
                </View>

                <View style={{ flex: 1 }}>
                  <TouchableHighlight
                    style={styles.modalButton}
                    underlayColor={COLOR.grey100}
                    activeOpacity={0.3}
                  >
                    <Text
                      style={{ ...styles.modalButtonText, color: COLOR.red600 }}
                      onPress={() => {
                        this.setState({
                          createNewWalletModalVisble: false
                        })
                      }}
                    >
                      {translate("init_no")}
                    </Text>
                  </TouchableHighlight>
                </View>
              </View>

              <TouchableHighlight
                style={{ ...styles.modalButton }}
                underlayColor={COLOR.grey100}
                activeOpacity={0.3}
              >
                <Text
                  style={{ ...styles.modalButtonText, color: COLOR.blue600 }}
                  onPress={() => {
                    this.setState({
                      recoverWalletModalVisible: true,
                      createNewWalletModalVisble: false
                    })
                  }}
                >{translate("init_recover")}</Text>
              </TouchableHighlight>
            </Card>
          </Modal>
        </View>
      )
    }

    const RecoverWalletModal = (props) => {
      const [recoverSecret, setRecoverSecret] = useState("");
      const [passPharse, setPassPharse] = useState("");
      return (
        <View>
          <Modal visible={props.recoverWalletModalVisible}
            animationType="slide"
            transparent={true}
          >
            <Card style={{...styles.newWalletConfirmModal, zIndex: 2}}>
              <CardItem header>
                <Text style={{ fontSize: 20, paddingVertical: 15 }}>{translate("init_recover")}</Text>
              </CardItem>

              <CardItem cardBody>
                <View style={{ flexDirection: "row", marginVertical: 10, marginHorizontal: 5 }}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={{ fontSize: 16, textAlign: "right" }}>
                      {`${translate("init_secret")}: `}
                    </Text>
                  </View>
                  <View style={{ flex: 4 }}>
                    <TextInput
                      placeholder="Secret"
                      clearButtonMode="unless-editing"
                      style={styles.recoverWalletModalInputBox}
                      onChangeText={(text: string) => {
                        setRecoverSecret(text);
                      }}
                    >
                    </TextInput>
                  </View>
                </View>
              </CardItem>

              <CardItem cardBody>
                <View style={{ flexDirection: "row", marginVertical: 10, marginHorizontal: 5 }}>
                  <View style={{ flex: 1, justifyContent: "center" }}>
                    <Text style={{ fontSize: 16, textAlign: "right" }}>
                      {`${translate("init_password")}: `}
                    </Text>
                  </View>
                  <View style={{ flex: 4 }}>
                    <TextInput
                      editable
                      maxLength={40}
                      value={passPharse}
                      onChangeText={(text: string) => {
                        setPassPharse(text);
                      }}
                      placeholder="Password"
                      style={styles.recoverWalletModalInputBox}
                      clearButtonMode="unless-editing"
                      secureTextEntry={true}
                      textContentType="newPassword"
                    >
                    </TextInput>
                  </View>
                </View>
              </CardItem>
              {
                this.state.warningText != "" &&
                <Text
                  style={{color: COLOR.red600 }}
                >
                  {translate(this.state.warningText)}
                </Text>
              }
              <TouchableHighlight
                style={{ ...styles.modalButton }}
                underlayColor={COLOR.grey100}
                activeOpacity={0.3}
                disabled={recoverSecret == ""}
              >
                <Text
                  style={{
                    ...styles.modalButtonText,
                    color: COLOR.blue600,
                    marginLeft: "40%"
                  }}
                  onPress={() => {
                    let newWallet = null;
                    try{
                      newWallet = new ethers.Wallet.fromMnemonic(recoverSecret.trim())
                    } catch (e) {
                      this.setState({
                        warningText: "createWallet_invalidSecret"
                      })
                    }
                    if(newWallet != null) {
                      this.props.createWallet({
                        wallet: newWallet,
                        passPharse: passPharse
                      })
                    }
                  }}
                >
                  {translate("init_startRecover")}
                </Text>
              </TouchableHighlight>
              <Spinner
                visible={this.state.loading}
                textContent={'Loading...'}
              />
            </Card>
          </Modal>
        </View >
      )
    }

    const PasswordInputModal = (props) => {
      const [passPharse, setPassPharse] = useState("");
      return (
        <View>
          <Modal
            visible={props.passwordPromptVisible}
            transparent={true}
          >
            <Card
              style={{...styles.newWalletConfirmModal, zIndex: 3}}
            >
              <CardItem header>
                <Text>
                  {translate("init_passwordTitle")}
                </Text>
              </CardItem>
              <CardItem cardBody>
                <TextInput
                  onChangeText={(text: string) => {
                    setPassPharse(text);
                  }}
                  placeholder="password"
                  style={styles.passwordInputBox}
                  clearButtonMode="unless-editing"
                  secureTextEntry={true}
                  textContentType="newPassword"
                >
                </TextInput>
              </CardItem>
              <CardItem
                footer
                button
                onPress={() => {
                  this.setState({ passwordPromptVisible: false });
                  this.props.loadWallet({ passPharse: passPharse });
                  setPassPharse("")
                }}
                style={{ ...styles.modalButton }}
              >
                <Text
                  style={{ ...styles.modalButtonText, color: COLOR.blue600 }}
                >
                  {translate("init_unlockWallet")}
                </Text>
              </CardItem>
            </Card>
          </Modal>
        </View>
      )
    }
    const RegisteredModal = (props) => {
      return (
        <View>
          <Modal
            visible={props.registeredPromptVisible}
            transparent={true}
          >
            <Card
              style={{...styles.newWalletConfirmModal, zIndex: 4}}
            >
              <CardItem header>
                <Text>
                  {translate("init_registered")}
                </Text>
              </CardItem>
              <CardItem
                cardBody
                button
                onPress={() => {
                  this.setState({
                    passwordPromptVisible: true,
                    registeredPromptVisible: false
                  })
                }}
                style={{ ...styles.modalButton }}
              >
                <Text
                  style={{ ...styles.modalButtonText, color: COLOR.green600, marginLeft: "40%" }}
                  >
                  {translate("init_yes")}
                </Text>
              </CardItem>
              <CardItem
                cardBody
                button
                onPress={() => {
                  this.setState({
                    createNewWalletModalVisble: true,
                    registeredPromptVisible: false
                  });
                }}
                style={{ ...styles.modalButton }}
              >
                <Text
                  style={{ ...styles.modalButtonText, color: COLOR.blue600, marginLeft: "40%" }}
                >
                  {translate("init_no")}
                </Text>
              </CardItem>
            </Card>
          </Modal>
        </View>
      )
    }

    return (
      <>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={this.state.createNewWalletModalVisble ? styles.maskView : styles.scrollView}
        >
          <Spinner
            visible={this.state.loading}
            textContent={'Loading...'}
          />
          <Card>
            <CardItem header bordered>
              <Image source={duckImg} style={styles.mainIcon} />
            </CardItem>
            <CardItem cardBody bordered>
              <Text
                style={styles.statusText}
              >
                {`${translate("init_status")}: ${this.state.loadingStatus}`}
              </Text>
            </CardItem>
            <CardItem cardBody bordered>
              <Text>{translate("init_menu")}</Text>
            </CardItem>
            <CardItem
              cardBody
              bordered
              button
              onPress={() => {
                SecureStore.deleteItemAsync("wallet");
                SecureStore.deleteItemAsync("passPharse");
                this.setState({
                  loadingStatus: translate("init_delete")
                })
              }}
              style={styles.button}
            >
              <Text
                adjustsFontSizeToFit
                style={styles.buttonText}
              >
                {translate("init_reset")}
              </Text>
            </CardItem>
            <CardItem
              cardBody
              bordered
              button
              onPress={() => {
                this.setState({
                  backupPassPharse: this.state.wallet.signingKey.mnemonic
                })
              }}
              style={styles.button}

            >
              <Text
                adjustsFontSizeToFit
                style={styles.buttonText}
              >
                {translate("init_backupWallet")}
              </Text>
            </CardItem>
            <Text
              visible={this.state.backupPassPharse != ""}
              onPress={async () => {
                await Clipboard.setString(this.state.backupPassPharse)
                this.setState({
                  loadingStatus: translate("init_backuped")
                })
              }}
              adjustsFontSizeToFit
            >
              {this.state.backupPassPharse}
            </Text>
          </Card>

          <RecoverWalletModal
            recoverWalletModalVisible={this.state.recoverWalletModalVisible}
          />
          <PasswordInputModal
            passwordPromptVisible={this.state.passwordPromptVisible}
          />
          <CreateWalletModal
            createNewWalletModalVisble={this.state.createNewWalletModalVisble}
          />
          <RegisteredModal
            registeredPromptVisible={this.state.registeredPromptVisible}
          />
        </ScrollView>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  const initReducer = getInitState(state);
  const depositReducer = getDepositState(state);
  return { depositReducer, initReducer };
}
const mapDispatchToProps = dispatch => {
  return {
    loadWallet: (payload) => dispatch(loadWallet(payload)),
    createWallet: (payload) => dispatch(createWallet(payload)),
    setAddress: (payload) => dispatch({ type: SET_ADDRESS_DEPOSIT, payload: payload }),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(InitPage);

const styles = StyleSheet.create({
  ...globalStyle,
  scrollView: {
    backgroundColor: COLOR.yellow50,
    color: COLOR.blue50,
    position: "relative",
    zIndex: 0,
    minWidth: "100%",
    minHeight: "100%"
  },
  maskView: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 0,
    position: "relative",
    minWidth: "100%",
    minHeight: "100%"
  },

  mainIcon: {
    height: 200,
    width: 200,
    backgroundColor: "rgba(0, 0, 0, 0)",
    alignContent: "center",
    marginLeft: "20%"
  },

  passwordInputBox: {
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    marginVertical: 15,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    justifyContent: "center",
    alignContent: "center",
    borderColor: COLOR.grey300
  },
  recoverWalletModalInputBox: {
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 16,
    borderColor: COLOR.grey300,
    padding: 10,
    marginHorizontal: 10
  }
})
