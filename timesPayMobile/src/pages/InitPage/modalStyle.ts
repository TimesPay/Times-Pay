import { COLOR } from 'react-native-material-ui'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'

export default
{
  walletModal: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    height: "100%",
    width: "100%",
    zIndex: 1,
    backgroundColor: COLOR.grey600
  },

  modalContainer: {
    backgroundColor: "white",
    width: "90%",
    marginHorizontal: "5%",
    borderRadius: wp('2%')
  },

  modalHeaderText: {
    fontSize: wp('5%'),
    padding: wp('3%'),
    marginHorizontal: wp('2%'),
    marginVertical: wp('3%')
  },

  passwordInputBox: {
    borderWidth: 1,
    marginVertical: wp('3%'),
    marginHorizontal: wp('5%'),
    padding: wp('2%'),
    borderRadius: wp('1%'),
    fontSize: wp('4%'),
    borderColor: COLOR.grey300
  },

  passwordInputBoxFocus: {
    borderColor: COLOR.blue200,
    shadowColor: COLOR.blue200,
    shadowOpacity: 0.8,
    shadowRadius: wp('1%'),
    shadowOffset: {width: wp('0.5%'), height: wp('0.5%')}
  },

  modalButton: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  modalButtonText: {
    fontSize: wp('4%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('2%'),
    marginVertical: "2%"
  }
}