import i18n from "i18n-js";
import * as RNLocalize from 'react-native-localize';
import memoize from "lodash.memoize";
import { I18nManager } from 'react-native';
export const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  "en-US": () => require("../locale/en-US.ts"),
  "zh-HK": () => require("../locale/zh-HK.ts"),
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = (languageCode:string) => {
  // fallback if no available language fits
  const fallback = { languageTag: languageCode, isRTL: false };

  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;
  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  console.log("languageTag", languageTag);
  // set i18n-js config
  i18n.translations = {
    ["en-US"]: translationGetters["en-US"]()["default"],
    ["zh-HK"]: translationGetters["zh-HK"]()["default"]
  };
  console.log("i18n.translations", i18n.translations);
  i18n.locale = languageTag;
};
