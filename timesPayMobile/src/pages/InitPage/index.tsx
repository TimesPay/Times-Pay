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
import deepEqual from 'deep-equal';

import { connect } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-community/async-storage';
import { ethers } from 'ethers';
import { COLOR } from 'react-native-material-ui';
import {
  Card,
  Button,
  CardItem
} from 'native-base'
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
import { getDecryptedWallet } from '../../api/wallet';
import { createWallet } from '../../actions/initAction';

import duckImg from '../../assets/duck.png';

interface InitProps {
  depositReducer: DepositStateType,
  initReducer: InitStateType
};
interface InitPageState extends InitStateType {
  address: string;
  createNewWalletModalVisble: boolean;
  loadingStatus: string;
  wallet: string;
  backupPassPharse: string;
  recoverWalletModalVisible: boolean;
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
      loadingStatus: "",
      wallet: null,
      backupPassPharse: ""
    }
  }

  componentDidMount() {
    setI18nConfig();
    console.log(this.props.depositReducer.address.length);
    this.props.loadWallet();
    this.setState({
      loading: this.props.initReducer.loading,
      status: this.props.initReducer.status,
      address: this.props.depositReducer.address,
      errCode: this.props.initReducer.errCode,
      createNewWalletModalVisble: false,
      recoverWalletModalVisible: false,
      loadingStatus: "",
      wallet: null,
      backupPassPharse: ""
    })
  }

  componentDidUpdate() {
    console.log("componentDidUpdate", this.props, this.state);
    if (this.props.initReducer.wallet != null) {
      if (!deepCompare(this.props.initReducer.wallet, this.state.wallet)) {
        this.setState({
          wallet: this.props.initReducer.wallet,
          createNewWalletModalVisble: false,
          recoverWalletModalVisible: false
        })
        this.props.setAddress({
          address: this.props.initReducer.wallet.signingKey.address
        });
      }
    }
    if (this.props.initReducer.errCode == errCode["loadWallet.noWallet"]) {
      if (this.state.errCode == null ||
        this.state.errCode == undefined) {
        console.log("initPage errCode state=null", this.props.initReducer.errCode);
        this.setState({
          createNewWalletModalVisble: true,
          errCode: this.props.initReducer.errCode
        });
      } else {
        if (this.props.initReducer.errCode.valueOf() != this.state.errCode.valueOf()) {
          console.log("initPage errCode state!=null", this.props.initReducer.errCode);
          this.setState({
            createNewWalletModalVisble: true,
            errCode: this.props.initReducer.errCode
          });
        }
      }
    } else {
      console.log("default", this.props.initReducer.errCode)
      if (this.props.initReducer.errCode != null) {
        this.setState({
          errCode: this.props.initReducer.errCode,
          createNewWalletModalVisble: false,
          recoverWalletModalVisible: false
        })
      }
    }
    if (this.state.loading != this.props.initReducer.loading) {
      this.setState({ loading: this.props.initReducer.loading });
    }
  }

  render() {
    const CreateWalletModal = (props) => {
      const [passPharse, setPassPharse] = useState("");
      console.log("props.createNewWalletModalVisble", props.createNewWalletModalVisble);
      return (
        <View>
          <Modal
            visible={props.createNewWalletModalVisble}
            transparent={true}
          >
            <Card
              style={styles.newWallectConfirmModal}
              visible={props.createNewWalletModalVisble}
            >
              <Col>
                <CardItem header bordered>
                  <Text>Do you want to create a new wallet?</Text>
                </CardItem>
                <Row>
                  <CardItem cocardBody bordered>
                    <TextInput
                      editable
                      maxLength={40}
                      onChangeText={(text) => {
                        setPassPharse(text);
                      }}
                      value={passPharse}
                      placeholder="password"
                      style={styles.passwordInputBox}
                      clearButtonMode="unless-editing"
                      secureTextEntry={true}
                      textContentType="newPassword"
                    />
                  </CardItem>
                </Row>
                <Row
                  type="flex"
                  justifyContent="space-between"
                >
                  <Col.BL>
                    <CardItem
                      cardBody
                      button
                      Primary
                      disabled={passPharse.length == 0}
                      onPress={() => {
                        console.log("clicked");
                        let newWallet = new ethers.Wallet.createRandom();
                        let address = newWallet.address;
                        console.log("newWallet", newWallet);
                        newWallet = newWallet.encrypt(passPharse).then((res) => {
                          console.log("encrypted");
                          console.log(res);
                          SecureStore.setItemAsync("wallet", JSON.stringify(res)).then((res) => {
                            console.log(res);
                            this.setState({
                              createNewWalletModalVisble: false,
                              loadingStatus: "new wallet created"
                            })
                          });
                          this.props.setAddress({
                            address: address
                          })
                          SecureStore.setItemAsync("passPharse", passPharse);
                        });
                      }}
                    >
                      <Text>YES</Text>
                    </CardItem>
                  </Col.BL>
                  <Col.BR>
                    <CardItem
                      Primary
                      button
                      cardBody
                      onPress={() => {
                        this.setState({
                          createNewWalletModalVisble: false
                        })
                      }}
                    >
                      <Text>No</Text>
                    </CardItem>
                  </Col.BR>
                </Row>
                <Row>
                  <CardItem
                    footer
                    bordered
                    button
                    onPress={() => {
                      this.setState({
                        recoverWalletModalVisible: true,
                        createNewWalletModalVisble: false
                      })
                    }}
                  >
                    <Text>{translate("init_recover")}</Text>
                  </CardItem>
                </Row>
              </Col>
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
          <Modal
            visible={props.recoverWalletModalVisible}
            transparent={true}
          >
            <Card>
              <CardItem header>
                <Text>{translate("init_recover")}</Text>
              </CardItem>
              <CardItem cardBody bordered>
                <Row>
                  <Col.L>
                    <Text>
                      {`${translate("init_secret")}: `}
                    </Text>
                  </Col.L>
                  <Col.R>
                    <TextInput
                      placeholder="secret"
                      style={styles.passwordInputBox}
                      clearButtonMode="unless-editing"
                      onChangeText={(text: string) => {
                        setRecoverSecret(text);
                      }}
                    >
                    </TextInput>
                  </Col.R>
                </Row>
              </CardItem>
              <CardItem cardBody bordered>
                <Row>
                  <Col.L>
                    <Text>
                      {`${translate("init_password")}: `}
                    </Text>
                  </Col.L>
                  <Col.R>
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
                  </Col.R>
                </Row>
              </CardItem>
              <CardItem
                foorfooter
                button
                disabled={recoverSecret == ""}
                onPress={() => {
                  let newWallet = new ethers.Wallet.fromMnemonic(recoverSecret)
                  console.log("wallet", newWallet);
                  this.props.createWallet({
                    wallet: newWallet,
                    passPharse: passPharse
                  })
                }
              }
            >
                <Text>{translate("init_startRecover")}</Text>
              </CardItem>
            </Card>
          </Modal>
        </View >
      )
  }
  return(
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
    <CreateWalletModal
      createNewWalletModalVisble={this.state.createNewWalletModalVisble}
    />
    <RecoverWalletModal
      recoverWalletModalVisible={this.state.recoverWalletModalVisible}
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
    loadWallet: () => dispatch({ type: LOAD_WALLET_INIT }),
    createWallet: (payload) => dispatch(createWallet(payload)),
    setAddress: (payload) => dispatch({ type: SET_ADDRESS_DEPOSIT, payload: payload }),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(InitPage);

const styles = StyleSheet.create({
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
  engine: {
    position: 'absolute',
    right: 0,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLOR.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: COLOR.black,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: COLOR.red600,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },

  mainIcon: {
    height: 200,
    width: 200,
    backgroundColor: "rgba(0, 0, 0, 0)",
    alignContent: "center",
    marginLeft: "20%"
  },

  actionBtn: {
    width: 200,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: COLOR.blue800
  },

  newWallectConfirmModal: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    marginLeft: "10%",
    marginRight: "10%",
    maxHeight: 200,
    marginTop: "50%",
    zIndex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap"
  },
  passwordInputBox: {
    borderWidth: 1,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    marginTop: 10,
    position: "relative"
  },
  button: {
    backgroundColor: COLOR.blue800,
    height: 48
  },
  buttonText: {
    color: COLOR.white
  },
})
