import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  TextInput
} from 'react-native';
import React, { useState } from 'react';
import { COLOR, withTheme } from 'react-native-material-ui';
import { Navigation } from 'react-native-navigation';
import Modal from 'react-native-modal';
import Col, { Row } from 'react-native-col';

import { connect } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { ethers } from 'ethers';
// import keythereum from 'keythereum';

import { getDepositState, getInitState } from '../../reducers/selectors';
import { InitStateType } from '../../reducers/initReducer';
import { DepositStateType } from '../../reducers/depositReducer';
import { LOAD_WALLET } from '../../sagas/initSaga';

import duckImg from '../../assets/duck.png';

interface InitProps {
  depositReducer: DepositStateType,
  initReducer: InitStateType
};
interface InitPageState extends InitStateType {
  address: string;
  createNewWalletModalVisble: boolean;
  loadingStatus: string;
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
      createNewWalletModalVisble: false,
      loadingStatus: ""
    }
  }
  componentDidMount() {
    console.log(this.props.depositReducer.address.length);
    if (this.props.depositReducer.address.length < 1) {
      this.props.loadWallet();
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
                      this.props.fetchSuccess({
                        wallet: res,
                        address: address
                      })
                      SecureStore.setItemAsync("wallet", res).then((result) => {
                        console.log(result);
                        this.setState({
                          createNewWalletModalVisble: false,
                          loadingStatus: "new wallet created"
                        })
                      });
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
    console.log("init state", this.state);
    return (
      <>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <Image source={duckImg} style={styles.mainIcon} />
          </View>
          <View>
            <Text>
              {this.state.loadingStatus}
            </Text>
            <Button
              title="action"
              onPress={() => {
                console.log("clicked");
                this.props.navigation.navigate('Exchange');
              }}
              style={styles.actionBtn}
            >
            </Button>
          </View>
          <CreateWalletModal
            createNewWalletModalVisble={this.state.createNewWalletModalVisble}
          />
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
        </ScrollView>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  const initReducer = getInitState(state);
  console.log("init", initReducer);
  const depositReducer = getDepositState(state);
  console.log("deposit", depositReducer);
  return { depositReducer, initReducer };
}
const mapDispatchToProps = dispatch => {
  return {
    loadWallet: () => dispatch({ type: LOAD_WALLET }),
    fetchSuccess: (payload) => dispatch({ type: "fetchSuccess", payload: payload }),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(InitPage);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLOR.yellow50,
    color: COLOR.blue50,
    marginLeft: '10%'
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
    width: 200
  },

  newWallectConfirmModal: {
    backgroundColor: '#000000',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    marginLeft: "10%"
  },
});
