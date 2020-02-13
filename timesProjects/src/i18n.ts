/*
  Do not copy/paste this file. It is used internally
  to manage end-to-end test suites.
*/

import NextI18Next from 'next-i18next';
import getConfig from "next/config";

const getLocaleSubpath = () => {
  const config = getConfig();
  if(config){
    return config.publicRuntimeConfig.localeSubpaths;
  } else {
    return "all";
  }
}
const localeSubpathVariations = {
  none: {},
  foreign: {
    zh: "zh"
  },
  all: {
    en: "en",
    zh: "zh"
  },
}

const NextI18NextInstance = new NextI18Next({
  otherLanguages: ["zh"],
  localeSubpaths: localeSubpathVariations[getLocaleSubpath()],
  defaultLanguage: "en",
  localePath: "public/static/locales",
  serverLanguageDetection: false,
  ns: ["common"],
  defaultNS: "common",
})
export default NextI18NextInstance

export const {
  appWithTranslation,
  withTranslation,
} = NextI18NextInstance
