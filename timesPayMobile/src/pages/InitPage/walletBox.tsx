import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {COLOR} from 'react-native-material-ui';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import WalletBalanceCounter from '../../component/WalletBalanceCounter';
import {translate} from '../../utils/I18N';
import {stateUpdater} from '../../utils/stateUpdater';

interface WalletBoxProps {
  balance: number;
  decimalPlaces: number;
  prefix: string;
  suffix: string;
  walletName: string;
  navigation: any;
}

export default class WalletBox extends Component<
  WalletBoxProps,
  WalletBoxProps
> {
  constructor(props: WalletBoxProps) {
    super(props);
    this.state = {
      balance: this.props.balance,
      decimalPlaces: this.props.decimalPlaces,
      prefix: this.props.prefix,
      suffix: this.props.suffix,
      walletName: this.props.walletName,
    };
  }

  render() {
    const {balance, decimalPlaces, prefix, suffix} = this.props;
    return (
      <View style={styles.boxContainer}>
        <AntDesignIcon
          name="wallet"
          size={wp('20%')}
          style={styles.walletImage}
        />
        <View style={styles.walletDetail}>
          <Text style={styles.walletName}>{this.state.walletName}</Text>
          <View style={{flex: 1}}>
            <WalletBalanceCounter
              endVal={balance}
              decimalPlaces={decimalPlaces}
              prefix={prefix}
              suffix={suffix}
            />
          </View>
          <View style={styles.btnGroup}>
            <TouchableOpacity
              style={styles.btn}
              onPress={(e: any) => {
                this.props.navigation.navigate('Pay');
              }}>
	              <Text
	                style={styles.btnText}
								>
	                {translate('str_pay')}
	              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={(e: any) => {
                this.props.navigation.navigate('Deposit');
              }}>
	              <Text
	                style={styles.btnText}
	            	>
	                {translate('str_receive')}
	              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  boxContainer: {
    height: '38%',
    width: '93%',
    flexDirection: 'row',
    borderRadius: wp('1%'),
    display: 'flex',
    justifyContent: 'center',
    marginHorizontal: '3.5%',
    backgroundColor: COLOR.grey100,
    shadowColor: COLOR.grey300,
    shadowOpacity: 0.8,
    shadowRadius: wp('1%'),
    shadowOffset: {width: wp('0.5%'), height: wp('0.5%')},
  },
  walletImage: {
    flex: 1,
    transform: [{rotate: '-20deg'}],
    alignSelf: 'center',
    paddingHorizontal: wp('3%'),
    marginHorizontal: wp('4%'),
    color: COLOR.black,
  },
  walletDetail: {
    flex: 3,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  walletName: {
    fontSize: wp('4%'),
    fontFamily: 'Feather',
    flex: 1,
    color: COLOR.grey600,
    top: '15%',
  },

  btnGroup: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btn: {
    backgroundColor: '#EE9577',
    flex: 1,
    padding: wp('2%'),
    borderRadius: wp('1%'),
    marginHorizontal: wp('2%'),
		position: "relative",
		zIndex: 5
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: wp('3%'),
    fontFamily: 'FontAwesome',
		minHeight: wp("3%"),
		minWidth: wp("3%"),
  },
});
