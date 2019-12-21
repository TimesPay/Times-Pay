import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  TextInput,
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import { Navigation } from 'react-native-navigation';
import Modal from 'react-native-modal';
import Col, { Row } from 'react-native-col';
import { translate } from '../../utils/I18N';
import deepEqual from 'deep-equal';

import { connect } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-community/async-storage';
import { ethers } from 'ethers';
import { COLOR, ThemeContext, getTheme, withTheme } from 'react-native-material-ui';
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
import { getDecryptedWallet } from '../../api/wallet';
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
      loadingStatus: "",
      wallet: null
    }
  }

  componentDidMount() {
    console.log(this.props.depositReducer.address.length);
    this.props.loadWallet();
    this.setState({
      loading: this.props.initReducer.loading,
      status: this.props.initReducer.status,
      address: this.props.depositReducer.address,
      errCode: this.props.initReducer.errCode,
      createNewWalletModalVisble: false,
      loadingStatus: "",
      wallet: null
    })
  }

  componentDidUpdate() {
    if (this.props.initReducer.wallet != null) {
      console.log(
        "componentDidUpdate",
        deepCompare(this.props.initReducer.wallet, this.state.wallet));
      if (!deepCompare(this.props.initReducer.wallet, this.state.wallet)) {
        console.log("this.props.initReducer.wallet", this.props.initReducer.wallet, this.state.wallet);
        this.setState({
          wallet: this.props.initReducer.wallet,
          createNewWalletModalVisble: false
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
          createNewWalletModalVisble: false
        })
      }
    }
    if (this.state.loading != this.props.initReducer.loading) {
      this.setState({ loading: this.props.initReducer.loading });
    }
  }

  render() {
    const CreateWalletModal = (props) => {
      const [passPharse, setPassPharse] = useState("")
      return (
        <View
          style={styles.newWallectConfirmModal}
        >
          <Modal isVisible={props.createNewWalletModalVisble}>
            <View>
              <Text>Do you want to create a new wallet?</Text>
            </View>
            <View>
              <TextInput
                editable
                maxLength={40}
                onChangeText={(text) => {
                  setPassPharse(text);
                }}
                value={passPharse}
              />
            </View>
            <Row>
              <Col.L>
                <Button
                  title="Yes"
                  disabled={passPharse.length == 0}
                  onPress={() => {
                    console.log("clicked");
                    let newWallet = new ethers.Wallet.createRandom();
                    let address = newWallet.address;
                    console.log("address", address);
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
                </Button>
              </Col.L>
              <Col.R>
                <Button
                  title="No"
                  onPress={() => {
                    this.setState({
                      createNewWalletModalVisble: false
                    })
                  }}
                >
                </Button>
              </Col.R>
            </Row>
          </Modal>
        </View>
      )
    }
    return (
      <>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Spinner
            visible={this.state.loading}
            textContent={'Loading...'}
          />
          <View style={styles.body}>
            <Image source={duckImg} style={styles.mainIcon} />
          </View>
          <View>
            <Text>
              {this.state.loadingStatus}
            </Text>
            <TouchableOpacity
              title="action"
              onPress={() => {
                console.log("clicked");
                this.props.navigation.navigate('Exchange');
              }}
              style={styles.actionBtn}
            >
            </TouchableOpacity>
          </View>
          <Button
            title="reset address"
            onPress={() => {
              SecureStore.deleteItemAsync("wallet");
              SecureStore.deleteItemAsync("passPharse");
              this.setState({
                loadingStatus: "address deleted"
              })
            }}
          >
          </Button>
          <CreateWalletModal
            createNewWalletModalVisble={this.state.createNewWalletModalVisble}
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
    setAddress: (payload) => dispatch({ type: SET_ADDRESS_DEPOSIT, payload: payload }),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withTheme(InitPage));

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLOR.yellow50,
    color: COLOR.blue50,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: COLOR.white
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
    width: 200
  },

  actionBtn: {
    width: 200,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: COLOR.blue800
  },

  newWallectConfirmModal: {
    backgroundColor: 'rgba(100,100,0,1)',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    marginLeft: "10%",
    backfaceVisibility: "hidden"
  },
})
