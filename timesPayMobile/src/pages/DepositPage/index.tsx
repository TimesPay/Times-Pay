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
import { COLOR, withTheme } from 'react-native-material-ui';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';

import { getDepositState, getInitState } from '../../reducers/selectors';
import { DepositStateType } from '../../reducers/depositReducer';
import { InitStateType } from '../../reducers/initReducer';
import BasicLayout from '../../component/BasicLayout';

interface DepositProps {
  depositReducer: DepositStateType,
  initReducer: InitStateType
};
interface DepositState extends DepositStateType {
};

class DepositPage extends React.Component<DepositProps, DepositState> {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      loading: this.props.depositReducer.loading,
      address: this.props.initReducer.wallet!.signingKey.address
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
    console.log("DepositPage");
    return (
      <BasicLayout
        containerStyle={styles.scrollView}
        title="Deposit"
        children={
          <>
            <View
              style={{
                minHeight: Dimensions.get("window").height,
              }}
            >
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
  console.log("deposit", depositReducer);
  return { depositReducer, initReducer };
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
    zIndex: 5,
    elevation: 4,
  },
  addressText: {
    marginTop: 20,
    marginLeft: "10%",
    marginRight: "10%",
    width: "80%"
  }
})
