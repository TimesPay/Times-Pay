import { AsyncStorage } from "react-native"

export const saveSetting = (payload: any) => {
  try {
    AsyncStorage.setItem("globalSetting", payload.settingObj);
    return true;
  } catch (e) {
    return false;
  }
}
export const restoreSetting = () => {
  return AsyncStorage.getItem("globalSetting");
}
