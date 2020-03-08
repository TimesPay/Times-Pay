import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import React, { Component } from 'react'
import { connect } from 'react-redux';

import { translate, setI18nConfig } from '../../utils/I18N';
import { getGlobalSettingState } from '../../reducers/selectors';
import { Dispatch } from 'redux';
import { globalSettingStateType } from '../../reducers/globalSettingReducer';
import { Card, CardItem, Container, Left, Radio, Right, Row, Col } from 'native-base';
import { getSetting, saveSetting } from '../../actions/globalSettingAction';
import LanguageMenu from '../../component/LanguageMenu';

interface GlobalSettingProps {
  globalSettingReducer: globalSettingStateType,
  containerStyle: any,
  saveSetting: (payload:any) => void,
  getSetting: ()=> void,
}
class SettingPage extends Component<GlobalSettingProps> {

  constructor(props: GlobalSettingProps) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    setI18nConfig();
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
            backgroundColor: "rgba(176, 224, 246, 1)",
          }}
        >
          <Text>
            {translate("globalSetting_title", {})}
          </Text>
        </CardItem>
        <CardItem
          cardBody
          style={{
            color: "rgba(0, 0, 0, 1)",
            minWidth: Dimensions.get("window").width * 0.8,
            backgroundColor: "rgba(176, 224, 246, 1)",
          }}
        >
          <View
            style={{
              color: "rgba(0, 0, 0, 1)"
            }}
          >
            <Text>
              {translate("globalSetting_selectLanguage", {})}
            </Text>
            <LanguageMenu
              languageList={[
                {
                  languageCode: "en-US",
                  selected: true
                }, {
                  languageCode: "zh-HK",
                  selected: false
                }]}
                changeLanguage={(languageCode:string)=>{
                  this.props.saveSetting({
                    type: "language",
                    value: languageCode
                  })
                }}
            />
          </View>
        </CardItem>
      </Card>
    )
  }
}

const mapStateToProps = (state: any) => {
  const globalSettingReducer = getGlobalSettingState(state);

  return { globalSettingReducer }
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
