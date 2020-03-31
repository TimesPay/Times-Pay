import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button,
  Dimensions
} from 'react-native';
import React from 'react';
import { COLOR } from 'react-native-material-ui';
import { Card, CardItem } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import SVGImage from 'react-native-svg-image';

import { connect } from 'react-redux';

import { getExchangeState, getInitState, getGlobalSettingState } from '../../reducers/selectors';
import { ExchangeStateType } from '../../reducers/exchangeReducer';
import { InitStateType } from '../../reducers/initReducer'
import { loadContract, getExchangeData } from '../../actions/exchangeAction'
import { deepCompare } from '../../utils/deepCompare';
import { translate } from '../../utils/I18N';
import constants from '../../utils/constants';
import BasicLayout from '../../component/BasicLayout';
import walletIcon from '../../assets/wallet.png';
import { Dispatch } from 'redux';
import WalletBox from '../InitPage/walletBox';
import { getSetting } from '../../actions/globalSettingAction';

interface ExchangeProps {
  exchangeReducer: ExchangeStateType,
  initReducer: InitStateType,
  getExchangeData: (payload: any) => void,
  loadContract: (payload: any) => void,
  getSetting: ()=> void,
  navigation: any,
};

interface ExchangeState extends ExchangeStateType {
  loading: boolean;
  ratio: number;
  contract: any;
  errCode: string;
  data: any;
};

class ExchangePage extends React.Component<ExchangeProps, ExchangeState> {
  constructor(props: ExchangeProps) {
    super(props);
    console.log(this.props);
    this.state = {
      loading: this.props.exchangeReducer.loading,
      ratio: this.props.exchangeReducer.ratio,
      contract: this.props.exchangeReducer.contract,
      errCode: this.props.exchangeReducer.errCode,
      data: this.props.exchangeReducer.data,
    }
  }

  componentDidMount() {
    console.log("componentDidMount", this.props);
    this.setState({
      loading: this.props.exchangeReducer.loading,
      ratio: this.props.exchangeReducer.ratio,
      contract: this.props.exchangeReducer.contract,
      errCode: this.props.exchangeReducer.errCode,
      data: this.props.exchangeReducer.data,
    })
    this.props.loadContract({
      wallet: this.props.initReducer.wallet
    });
    this.props.navigation.addListener("didBlur", (e:any) => {
      this.props.loadContract({
        wallet: this.props.initReducer.wallet
      });
    });
  }

  componentDidUpdate() {
    if (this.state.ratio != this.props.exchangeReducer.ratio) {
      this.setState({ ratio: this.props.exchangeReducer.ratio });
    }
    if (this.state.loading != this.props.exchangeReducer.loading) {
      this.setState({ loading: this.props.exchangeReducer.loading });
    }
    if (!deepCompare(this.state.contract, this.props.exchangeReducer.contract)) {
      this.setState({
        contract: this.props.exchangeReducer.contract
      }, () => this.props.getExchangeData({
        contract: this.state.contract,
        wallet: this.props.initReducer.wallet,
        type: constants["balance"],
        payload: {}
      }))
    }
    if (!deepCompare(this.state.data, this.props.exchangeReducer.data)) {
      this.setState({
        data: this.props.exchangeReducer.data
      })
    }
  }

  render() {
    return (
      <>
        <BasicLayout
          title="Exchange"
          children={
            <ScrollView
              style={{
                minHeight: Dimensions.get("window").height,
              }}
            >
              <Spinner
                visible={this.state.loading}
                textContent={'Loading...'}
              />
              <Card
                style={{
                  position: "relative",
                  zIndex: -1,
                  elevation: -1
                }}
              >
                <CardItem
                  header
                  bordered
                  style={{
                    position: "relative",
                    zIndex: -1,
                    elevation: -1
                  }}
                >
                  <Text
                    style={styles.menuHeader}
                  >
                    {translate("exchange_dataHeader")}
                  </Text>
                </CardItem>
                <CardItem style={{
                  flex: 2,
                  position: "relative",
                  zIndex: -1,
                  elevation: -1
                }}>
                  {
                    (
                      this.state.data.balance !== null &&
                      this.state.data.balance !== undefined
                    ) &&
                    (
                      this.state.data.USDToHKD !== null &&
                      this.state.data.USDToHKD !== undefined
                    )
                      ? <WalletBox
                        balance={(this.state.data.balance / 1000000) * (this.state.data.USDToHKD)}
                        decimalPlaces={4}
                        prefix={' ≈ '}
                        suffix={' HKD'}
                        walletName="USDC"
                        navigation={this.props.navigation}
                      />
                      : <View></View>}
                </CardItem>
                <CardItem style={{
                  flex: 2,
                  position: "relative",
                  zIndex: -1,
                  elevation: -1
                }}>
                  {
                    !(this.state.data.gasBalance == null || this.state.data.gasBalance == undefined)
                      ? <WalletBox
                        balance={(this.state.data.gasBalance / 1000000000000000000)}
                        decimalPlaces={4}
                        prefix={' ≈ '}
                        suffix={' ETH'}
                        walletName="Gas"
                        navigation={this.props.navigation}
                      />
                      : <View></View>}
                </CardItem>
                <CardItem style={{
                  flex: 2,
                  position: "relative",
                  zIndex: -1,
                  elevation: -1
                }}>
                  <Text
                    style={styles.menuHeader}
                  >
                    {translate("useful_dataHeader")}
                  </Text>
                </CardItem>
                <CardItem style={{
                  flex: 2,
                  position: "relative",
                  zIndex: -1,
                  elevation: -1
                }}>
                  <Text
                    style={styles.balanceText}
                  >
                    {`1 USD = ${this.state.data.USDToHKD || 0} HKD`}
                  </Text>
                </CardItem>
                <CardItem
                  footer
                  bordered
                  button
                  onPress={() => {
                    this.props.getExchangeData({
                      contract: this.state.contract,
                      wallet: this.props.initReducer.wallet,
                      type: constants["balance"],
                      payload: {}
                    })
                  }}
                  style={styles.footerButton}
                >
                  <Text
                    style={{ color: COLOR.white }}
                  >
                    {translate("exchange_refresh")}
                  </Text>
                </CardItem>
              </Card>
            </ScrollView>
          }
          containerStyle={styles.scrollView}
        />
      </>
    );
  }
}
// <ScrollView
//   contentInsetAdjustmentBehavior="automatic"
//   style={styles.scrollView}>
//
// </ScrollView>
const mapStateToProps = (state: any) => {
  const exchangeReducer = getExchangeState(state);
  const initReducer = getInitState(state);
  const globalSettingReducer = getGlobalSettingState(state);
  console.log("exchange", exchangeReducer, initReducer);
  return { exchangeReducer, initReducer, globalSettingReducer };
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    loadContract: (payload: any) => dispatch(loadContract(payload)),
    getExchangeData: (payload: any) => dispatch(getExchangeData(payload)),
    getSetting: () => dispatch(getSetting()),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ExchangePage);

const styles = StyleSheet.create({
  scrollView: {
    display: "flex",
    minHeight: Dimensions.get("window").height,
    minWidth: Dimensions.get("window").width * 0.8,
    alignContent: "center",
    elevation: 1
  },
  menuHeader: {
    fontSize: 36,
    textAlign: "center"
  },
  footerButton: {
    backgroundColor: COLOR.blue800,
    height: 48
  },
  balanceText: {
    flex: 12,
    fontWeight: "bold",
    fontSize: wp("4.5%"),
    color: "black",
    fontFamily: "Feather",
    alignSelf: "center"
  },
})
