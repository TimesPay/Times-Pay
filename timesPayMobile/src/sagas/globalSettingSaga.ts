import { call, put, takeEvery, select } from "redux-saga/effects";
import {
  SETTING_SAVE,
  SETTING_RESTORE
} from '../actions/actionTypes';

import {
  settingInitialize,
  settingUpdate,
  settingUpdateFailed
} from '../actions/globalSettingAction';
import { getGlobalSettingState } from "../reducers/selectors";
import { saveSetting, restoreSetting } from "../api/setting";

export function* watchSave() {
  yield takeEvery(SETTING_SAVE, saveFlow);
}

export function* watchRestore() {
  yield takeEvery(SETTING_RESTORE, restoreFlow);
}

function* saveFlow(action:any) {
  try {
    console.log("saveFlow", action);
    const settingObj = yield select(getGlobalSettingState);
    console.log("settingObj", settingObj);
    settingObj[action.payload.type] = action.payload.value;
    let setting = yield call(saveSetting, {
      settingObj: JSON.stringify(settingObj)
    })
    if(setting) {
      yield put(settingUpdate({
        type: action.payload.type,
        value:  action.payload.value
      }));
    } else {
      yield put(settingUpdateFailed({
        error: "access Failed"
      }))
    }
  } catch(e) {
    yield put(settingUpdateFailed({
      error: "access Failed"
    }))
  }
}

function* restoreFlow() {
  try {
    let setting = yield call(restoreSetting)
    if(setting) {
      yield put(settingInitialize({
        settingObj: JSON.parse(setting)
      }));
    } else {
      yield put(settingUpdateFailed({
        error: "access Failed"
      }))
    }
  } catch(e) {
    yield put(settingUpdateFailed({
      error: "access Failed"
    }))
  }
}
