import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import React, { Component } from 'react'
import { connect } from 'react-redux';

import { translate, setI18nConfig } from '../../utils/I18N';
import { getGlobalSettingState } from '../../reducers/selectors';
import { Dispatch } from 'redux';
import { globalSettingStateType } from '../../reducers/globalSettingReducer';
import { Card, CardItem, Container } from 'native-base';
import { getSetting, saveSetting } from '../../actions/globalSettingAction';
import BasicLayout from '../../component/BasicLayout';

interface GlobalSettingProps {
  globalSettingReducer: globalSettingStateType
}
class SettingPage extends Component<GlobalSettingProps> {

  constructor(props: GlobalSettingProps) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    setI18nConfig()
  }

  componentDidUpdate() {
  }

  render() {
    console.log("render global setting", this.props, BasicLayout);
    return (
      <BasicLayout
        children={
          <Card>
            <CardItem
              header
            >
              <Text>
                {translate("globalSetting_title", {})}
              </Text>
            </CardItem>
            <CardItem
              cardBody
            >
              <Text>
                {translate("globalSetting_title", {})}
              </Text>
            </CardItem>
          </Card>
        }
      />
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
