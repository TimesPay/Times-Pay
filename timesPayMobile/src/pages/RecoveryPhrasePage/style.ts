import {COLOR} from 'react-native-material-ui'
import {widthPercentageToDP as wp} from 'react-native-responsive-screen'

export default {
  container: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    height: "100%"
  },
  phraseContainer: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    width: "90%",
    marginHorizontal: "5%"
  },
  phraseView: {
    backgroundColor: COLOR.grey200,
    marginVertical: wp('2%'),
    marginHorizontal: wp('1%'),
    borderWidth: wp('0.1%'),
    borderRadius: wp('4%')
  },
  phraseText: {
    padding: wp('2%'),
    color: COLOR.grey700
  },
  header: {
    fontSize: wp('8%'),
    paddingHorizontal: wp('5%'),
    marginVertical: wp('5%'),
    fontWeight: "bold",
    color: COLOR.amber700
  },
  hintTextView: {
    flexDirection: "row",
    alignItems: 'flex-start',
    marginHorizontal: "2.5%",
    width: "90%"
  },
  hintText: {
    marginHorizontal: wp('1%'),
    color: COLOR.grey600,
    fontSize: wp('3.5%'),
    marginVertical: wp('1%')
  },
  confirmBtn: {
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
  confirmBtnText:{
    color: "white",
    fontSize: wp('4.2%'),
    fontFamily: "FontAwesome",
    textAlign: "center",
    fontWeight: "bold"
  }
}