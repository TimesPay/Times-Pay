import { AsyncStorage } from "react-native"

export const saveSetting = (payload: any) => {
  try {
    return AsyncStorage.setItem("globalSetting", payload.settingObj);
  } catch (e) {
    return false;
  }
}
export const restoreSetting = () => {
  return AsyncStorage.getItem("globalSetting");
}
