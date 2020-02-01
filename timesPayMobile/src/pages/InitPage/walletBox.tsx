import React, {Component} from 'react'
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity
} from 'react-native'
import {COLOR} from 'react-native-material-ui'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import WalletBalanceCounter from '../../component/WalletBalanceCounter'
import { translate } from '../../utils/I18N'


export default class WalletBox extends Component
{
	constructor(props){
		super(props)
	}

	render() {
		return(
			<View style={styles.boxContainer}>
			    <AntDesignIcon name="wallet" size={wp('20%')} style={styles.walletImage}/>

			    <View style={styles.walletDetail}>
			        <Text style={styles.walletName}>Your wallet name</Text>
							<View style={{flex: 1}}>
			          <WalletBalanceCounter endVal={123456.12345} decimalPlaces={2} prefix={' ≈ '} suffix={' HKD'}></WalletBalanceCounter>
							</View>
							<View style={styles.btnGroup}>
			            <TouchableOpacity style={styles.btn}>
			            	<Text style={styles.btnText}>{translate("str_pay")}</Text>
			            </TouchableOpacity>
			            <TouchableOpacity style={styles.btn}>
			            	<Text style={styles.btnText}>{translate("str_receive")}</Text>
			            </TouchableOpacity>
			        </View>
			    </View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	boxContainer: {
		height: "38%",
		width: "93%",
		flexDirection: "row",
		borderRadius: wp('1%'),
		display: "flex",
		justifyContent: "center",
		marginHorizontal: "3.5%",
		backgroundColor: COLOR.grey100,
		shadowColor: COLOR.grey300,
		shadowOpacity: 0.8,
		shadowRadius: wp('1%'),
		shadowOffset: {width: wp('0.5%'), height: wp('0.5%')}
	},
	walletImage: {
		flex: 1,
		transform:[{rotate: '-20deg'}],
		alignSelf: "center",
		paddingHorizontal: wp('3%'),
		marginHorizontal: wp('4%'),
		color: COLOR.black
	},
	walletDetail: {
		flex: 3,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center"
	},

	walletName: {
		fontSize: wp('4%'),
		fontFamily: "Feather",
		flex: 1,
		color: COLOR.grey600,
		top: "15%"
	},

	btnGroup: {
		flexDirection: "row",
		flex: 1,
		justifyContent: "center",
		flexWrap: "wrap"
	},
	btn: {
		backgroundColor: "#EE9577",
		flex: 1,
		padding: wp('2%'),
		borderRadius: wp('1%'),
		marginHorizontal: wp('2%'),
	},
	btnText: {
		color: "white",
		textAlign: "center",
		fontSize: wp('3%'),
		fontFamily: "FontAwesome"
	}
})
