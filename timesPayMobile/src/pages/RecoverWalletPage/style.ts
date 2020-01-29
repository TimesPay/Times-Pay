import { COLOR } from 'react-native-material-ui'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'

export default {
  container: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    height: "100%"
  },
  header: {
    fontSize: wp('8%'),
    paddingHorizontal: wp('5%'),
    marginVertical: wp('5%'),
    fontWeight: "bold",
    color: COLOR.amber700
  },
  inputBox: {
    borderWidth: 1,
    marginVertical: wp('3%'),
    marginHorizontal: wp('5%'),
    padding: wp('2%'),
    borderRadius: wp('1%'),
    fontSize: wp('4%'),
    height: "30%",
    borderColor: COLOR.grey300
  },
  inputBoxFocus: {
    borderColor: COLOR.blue200,
    shadowColor: COLOR.blue200,
    shadowOpacity: 0.6,
    shadowRadius: wp('1%'),
    shadowOffset: {width: wp('0.5%'), height: wp('0.5%')}
  },
  hintText: {
    marginHorizontal: wp('5%'),
    color: COLOR.grey600,
    fontSize: wp('3.5%'),
    marginVertical: wp('1%')
  },
  importBtn: {
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
  importBtnText:{
    color: "white",
    fontSize: wp('4.2%'),
    fontFamily: "FontAwesome",
    textAlign: "center",
    fontWeight: "bold"
  }
}