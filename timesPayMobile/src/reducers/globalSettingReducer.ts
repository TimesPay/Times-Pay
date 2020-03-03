import {
  SETTING_INIT,
  SETTING_UPDATE,
  SETTING_UPDATE_FAILED
} from '../actions/actionTypes';
import { commonStateType } from '../utils/commonStateType';
import { AsyncStorage } from 'react-native';

export interface globalSettingStateType {
  language: "en-US"|"zh-HK" | null,
  gasAutoRefill: number | null,
}
const initState: globalSettingStateType = {
  language: null,
  gasAutoRefill: null
}

export default function globalSettingReducer(state = initState, action:any) {
  console.log("init reducer", action);
  switch (action.type) {
    case SETTING_INIT:
    return {
      ...state,
      ...action.payload.settingObj
    }
    case SETTING_UPDATE:
    return {
      ...state,
      [action.payload.type]: action.payload.value
    }
    case SETTING_UPDATE_FAILED:
    return {
      ...state,
      error: action.payload.error
    }
    default:
      return state;
  }
}
