import {
  SETTING_INIT,
  SETTING_UPDATE,
  SETTING_UPDATE_FAILED,
  SETTING_RESTORE,
  SETTING_SAVE
} from '../actions/actionTypes';

export const settingInitialize = (payload: any) => {
  return {
    type: SETTING_INIT,
    payload: {
      settingObj: payload.settingObj
    }
  }
}

export const settingUpdate = (payload: any) => {
  return {
    type: SETTING_UPDATE,
    payload: {
      type: payload.type,
      value: payload.value
    }
  }
}

export const settingUpdateFailed = (payload: any) => {
  return {
    type: SETTING_UPDATE_FAILED,
    payload: {
      error: payload.error
    }
  }
}

export const getSetting = () => {
  return {
    type: SETTING_RESTORE
  }
}

export const saveSetting = (payload: any) => {
  return {
    type: SETTING_SAVE,
    payload: {
      type: payload.type,
      value: payload.value
    }
  }
}
