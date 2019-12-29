import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button
} from 'react-native';
import React from 'react';
import { COLOR } from 'react-native-material-ui';
import { Card, CardItem } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

import { connect } from 'react-redux';

import { getExchangeState, getInitState } from '../../reducers/selectors';
import { ExchangeStateType } from '/src/reducers/exchangeReducer';
import { InitStateType } from '../../reducers/initReducer'
import { loadContract, getExchangeData } from '../../actions/exchangeAction'
import { deepCompare } from '../../utils/deepCompare';
import { translate } from '../../utils/I18N';
import constants from '../../utils/constants';
import BasicLayout from '../../component/BasicLayout';
import duckImg from '../../assets/duck.png';

interface ExchangeProps {
  exchangeReducer: ExchangeStateType,
  initReducer: InitStateType,
};

interface ExchangeState extends ExchangeStateType {
  loading: boolean;
  ratio: number;
};

class ExchangePage extends React.Component<ExchangeProps, ExchangeState> {
  static navigationOptions = (props) => {
    return {
      headTitle: () => <Text>Exchange</Text>,
      headerRight: () => (
        <Button
          onPress={() => {
            props.navigation.navigate('Initial');
            console.log(props);
          }}
          title="Info"
          color="#000"
        />
      ),
    }
  };
  constructor(props) {
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
      data: this.props.exchangeReducer.data
    })
    this.props.loadContract({
      wallet: this.props.initReducer.wallet
    });
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
    if (this.state.ratio != this.props.exchangeReducer.ratio) {
      this.setState({ ratio: this.props.exchangeReducer.ratio });
    }
    if (this.state.loading != this.props.exchangeReducer.loading) {
      this.setState({ loading: this.props.exchangeReducer.loading });
    }
    if (!deepCompare(this.state.contract, this.props.exchangeReducer.contract)) {
      this.setState({
        contract: this.props.exchangeReducer.contract
      })
    }
    if (!deepCompare(this.state.data, this.props.exchangeReducer.data)) {
      this.setState({
        data: this.props.exchangeReducer.data
      })
    }
  }

  render() {
    console.log("exchange page state", this.state);
    return (
      <>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Spinner
            visible={this.state.loading}
            textContent={'Loading...'}
          />
          <Card>
            <CardItem
              header
              bordered
            >
              <Text
                style={styles.menuHeader}
              >
                {translate("exchange_dataHeader")}
              </Text>
            </CardItem>
            <CardItem
              cardBody
              bordered
            >
              <Text>
                {`${translate("exchange_balance")}: ${
                  this.state.data.balance != null
                    ? this.state.data.balance
                    : 0
                  }`}</Text>
            </CardItem>
            <CardItem
              footer
              bordered
              button
              onPress={() => {
                this.props.getExchangeData({
                  contract: this.state.contract,
                  type: constants["balance"],
                  payload: {}
                })
              }}
              style={styles.footerButton}
            >
              <Text
                style={{color: COLOR.white}}
                >
                {translate("exchange_refresh")}
              </Text>
            </CardItem>
          </Card>
        </ScrollView>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  const exchangeReducer = getExchangeState(state);
  const initReducer = getInitState(state);
  console.log("exchange", exchangeReducer, initReducer);
  return { exchangeReducer, initReducer };
}
const mapDispatchToProps = dispatch => {
  return {
    loadContract: (payload) => dispatch(loadContract(payload)),
    getExchangeData: (payload) => dispatch(getExchangeData(payload)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ExchangePage);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLOR.yellow50,
    color: COLOR.blue50
  },
  menuHeader: {
    fontSize: 36,
    textAlign: "center"
  },
  footerButton: {
    backgroundColor: COLOR.blue800,
    height: 48
  }
})
