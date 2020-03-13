import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Clipboard,
  ToastAndroid
} from 'react-native';
import React, { Component } from 'react'
import { connect } from 'react-redux';

import { translate, setI18nConfig } from '../../utils/I18N';
import { getGlobalSettingState, getInitState } from '../../reducers/selectors';
import { Dispatch } from 'redux';
import { globalSettingStateType } from '../../reducers/globalSettingReducer';
import { Card, CardItem, Container, Left, Radio, Right, Row, Col, Icon } from 'native-base';
import { getSetting, saveSetting } from '../../actions/globalSettingAction';
import LanguageMenu from '../../component/LanguageMenu';
import { InitStateType } from 'src/reducers/initReducer';

interface GlobalSettingProps {
  containerStyle: any,
  saveSetting: (payload:any) => void,
  getSetting: ()=> void,
  globalSettingReducer: globalSettingStateType,
  initialReducer: InitStateType
}
class SettingPage extends Component<GlobalSettingProps> {

  constructor(props: GlobalSettingProps) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    setI18nConfig(this.props.globalSettingReducer.language || "en-US");
    this.props.getSetting();
  }

  componentDidUpdate() {
  }

  render() {
    return (
      <Card
        style={this.props.containerStyle}
      >
        <CardItem
          header
          style={{
            display: "flex",
            alignContent: "flex-start",
            backgroundColor: "rgba(0, 0, 0, 1)",
          }}
          button
        >
          <Text
            style={{
              color: "rgba(255, 255, 255, 1)",
              position: "relative",
              alignSelf: "center",
              fontSize: 24,
              marginTop: 30
            }}
          >
            {translate("globalSetting_title", {})}
          </Text>
        </CardItem>
        <CardItem
          cardBody
          style={{
            color: "rgba(255, 255, 255, 1)",
            minWidth: Dimensions.get("window").width * 0.8,
            backgroundColor: "rgba(0, 0, 0, 1))",
          }}
        >
          <View>
            <Text
              style={{
                color: "rgba(255, 255, 255, 1)",
                position: "relative",
                alignSelf: "center",
                fontSize: 18,
                marginTop: 30
              }}
            >
              {translate("globalSetting_selectLanguage", {})}
            </Text>
            <LanguageMenu
              languageList={[
                {
                  languageCode: "en-US",
                  selected: this.props.globalSettingReducer.language == "en-US"
                }, {
                  languageCode: "zh-HK",
                  selected: this.props.globalSettingReducer.language == "zh-HK"
                }]}
                changeLanguage={(languageCode:string)=>{
                  console.log("changeLanguage", languageCode);
                  setI18nConfig(languageCode || "en-US");
                  this.props.saveSetting({
                    type: "language",
                    value: languageCode
                  })
                }}
                langCode={this.props.globalSettingReducer.language || "en-US"}
            />
          </View>
        </CardItem>
        <CardItem
          cardBody
          style={{
            color: "rgba(255, 255, 255, 1)",
            minWidth: Dimensions.get("window").width * 0.8,
            backgroundColor: "rgba(0, 0, 0, 1))",
          }}
          button
          onPress={()=>{
            Clipboard.setString(this.props.initialReducer.wallet.signingKey.mnemonic);
            ToastAndroid.showWithGravity(translate("init_backuped", {}), ToastAndroid.SHORT, ToastAndroid.CENTER);
          }}
        >
          <View
            style={{
              color: "rgba(255, 255, 255, 1)"
            }}
          >
            <Text
            style={{
              color: "rgba(255, 255, 255, 1)",
              position: "relative",
              alignSelf: "center",
              fontSize: 24,
              marginTop: 30,
              marginLeft: 10
            }}
            >
              {translate("init_backupWallet",{})}
            </Text>
          </View>
        </CardItem>
      </Card>
    )
  }
}

const mapStateToProps = (state: any) => {
  const globalSettingReducer = getGlobalSettingState(state);
  const initialReducer = getInitState(state);

  return { globalSettingReducer, initialReducer }
}
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getSetting: () => dispatch(getSetting()),
    saveSetting: (payload: any) => dispatch(saveSetting(payload))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(SettingPage)

const styles = StyleSheet.create({
})
