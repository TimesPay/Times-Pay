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
import { COLOR, withTheme } from 'react-native-material-ui';
import { connect } from 'react-redux';

import { getExchangeState } from '../../reducers/selectors';
import { ExchangeStateType } from '/src/reducers/exchangeReducer';
import BasicLayout from '../../component/BasicLayout';
import duckImg from '../../assets/duck.png';
interface ExchangeProps {
  exchangeReducer: ExchangeStateType
};
interface ExchangeState {
  loading: boolean;
  ratio: number;
};

class ExchangePage extends React.Component<InitProps, InitState> {
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
      ratio: this.props.exchangeReducer.ratio
    }
  }
  componentDidUpdate() {
    if (this.state.ratio != this.props.exchangeReducer.ratio) {
      this.setState({ ratio: this.props.exchangeReducer.ratio });
    }
    if (this.state.loading != this.props.exchangeReducer.loading) {
      this.setState({ loading: this.props.exchangeReducer.loading });
    }
  }
  render() {
    console.log("props", this.props);
    console.log("state", this.state);
    return (
      <>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View>
            <Text>{this.state.ratio}</Text>
          </View>
          <View>
            <Text>{this.state.loading ? "loading" : "loaded"}</Text>
          </View>
          <Button
            title="Calculate"
            onPress={(e: any) => {
              this.props.fetchSuccess()
            }}
          >
            {/* <Text> */}
            Calculate
              {/* </Text> */}
          </Button>
        </ScrollView>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  const exchangeReducer = getExchangeState(state)
  console.log("exchange", exchangeReducer);
  return { exchangeReducer };
}
const mapDispatchToProps = dispatch => {
  return {
    fetchStart: () => dispatch({ type: "fetchStart" }),
    fetchSuccess: () => dispatch({ type: "fetchSuccess" }),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ExchangePage);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLOR.yellow50,
    color: COLOR.blue50
  },
})
