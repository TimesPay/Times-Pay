import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const i18nLoader = (locale: "en"|"zh" | "", resources: any, ns:string) => {
  if(resources) {
    if(resources.hasOwnProperty('content')) {
      resources = resources["content"];
    }
  }
  return i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    ns:ns,
    defaultNS: ns,
    resources: resources,
    // lng: locale,
  });

}

export default i18nLoader;

export const serverResponseToResourcesBundle = (response:any, locale: string, ns: string) => {
  let bundle = {};
  if(response) {
    // console.log("response", response, locale, ns);
    if (response["content"]) {
      bundle = response["content"][locale][ns];
    }
  }
  return bundle;
}
