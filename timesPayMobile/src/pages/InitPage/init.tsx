import {
  SafeAreaView,
  View,
  Text,
	StatusBar,
	StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'
import React, { Component } from 'react'
import { COLOR } from 'react-native-material-ui'
import Carousel from '../../component/Carousel'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'


const images = [
  "https://images.unsplash.com/photo-1508138221679-760a23a2285b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1485550409059-9afb054cada4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=701&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
  "https://images.unsplash.com/photo-1429087969512-1e85aab2683d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
  "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
];

export default class Init extends Component {
	constructor(props){
		super(props)
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Carousel images={images} />
				<TouchableOpacity
				    onPress = {() => {this.props.navigation.navigate('CreateWalletPassword')}}
				    style={styles.newWalletBtn}>
					<Text style={styles.newWalletBtnText}>Create a new wallet</Text>
				</TouchableOpacity>
				<TouchableOpacity
				    onPress = {() => {this.props.navigation.navigate('RecoverWallet')}}
				    style={styles.recoverWalletBtn}>
					<Text style={styles.recoverWalletBtnText}>I already have a wallet</Text>
				</TouchableOpacity>
			</SafeAreaView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		display: "flex",
		alignContent: "center",
		backgroundColor: "white"
	},
	newWalletBtn: {
		width: "90%",
		marginHorizontal: "5%",
		backgroundColor: "#694FAD",
		shadowColor: COLOR.grey300,
		shadowOpacity: 0.8,
		shadowOffset: {width: wp('0.5%'), height: wp('0.5%')},
		paddingHorizontal: wp('3%'),
		paddingVertical: wp('2%'),
		marginVertical: wp('2%')
	},
	newWalletBtnText: {
		color: "white",
		fontSize: wp('4.2%'),
		fontFamily: "FontAwesome",
		textAlign: "center",
		fontWeight: "bold"
	},
	recoverWalletBtn: {
		width: "90%",
		marginHorizontal: "5%",
		paddingHorizontal: wp('3%'),
		paddingVertical: wp('2%'),
		marginVertical: wp('2%')
	},
	recoverWalletBtnText:{
		color: "#694FAD",
		fontSize: wp('4.2%'),
		fontFamily: "FontAwesome",
		textAlign: "center",
		fontWeight: "bold"
	}
})