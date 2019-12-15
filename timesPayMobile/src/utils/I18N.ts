import i18n from "i18n-js";
import * as RNLocalize from 'react-native-localize';
import memoize from "lodash.memoize";
import { I18nManager } from 'react-native';
export const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  "en-US": () => require("../locale/en-US"),
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = { languageTag: "en-US", isRTL: false };

  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);

  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};
