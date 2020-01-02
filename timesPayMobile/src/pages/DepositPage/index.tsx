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
import QRCode from 'react-native-qrcode-svg';

import { getDepositState } from '../../reducers/selectors';
import { DepositStateType } from '/src/reducers/depositReducer';
interface DepositProps {
  depositReducer: DepositStateType
};
interface DepositState extends  DepositStateType {
};

class DepositPage extends React.Component<DepositProps, DepositState> {
  static navigationOptions = (props) => {
    return {
      headTitle: () => <Text>Deposit</Text>,
      headerRight: () => (
        <Button
          onPress={() => {
            props.navigation.navigate('Initial');
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
      loading: this.props.depositReducer.loading,
      address: this.props.depositReducer.address
    }
  }
  componentDidUpdate() {
    if (this.state.address != this.props.depositReducer.address) {
      this.setState({ address: this.props.depositReducer.address });
    }
    if (this.state.loading != this.props.depositReducer.loading) {
      this.setState({ loading: this.props.depositReducer.loading });
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
          <View
            style={styles.QRCodeContainer}
            >
            <QRCode
              value={this.state.address || "N/A"}
            />
          </View>
          <View>
            <Text
              style={styles.addressText}
              ellipsizeMode="tail"
            >
              {this.state.address || "N/A"}
            </Text>
          </View>
        </ScrollView>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  const depositReducer = getDepositState(state)
  console.log("deposit", depositReducer);
  return { depositReducer };
}
const mapDispatchToProps = dispatch => {
  return {
    fetchStart: () => dispatch({ type: "fetchStart" }),
    fetchSuccess: () => dispatch({ type: "fetchSuccess" }),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DepositPage);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLOR.yellow50,
    color: COLOR.blue50
  },
  QRCodeContainer: {
    marginTop: 30,
    marginLeft: "35%",
    marginRight: "35%",
    width: "30%"
  },
  addressText: {
    marginTop: 20,
    marginLeft: "10%",
    marginRight: "10%",
    width: "80%"
  }
})
