import { NextPage } from 'next';
import BasicLayout from '../components/BasicLayout';
// import useSWR from 'swr';
import { languageFetcher } from '../utils/languageFetcher';
import { useTranslation } from 'react-i18next';
import i18nLoader, { serverResponseToResourcesBundle } from '../i18n';

i18nLoader("en", {}, "common");
const Page: NextPage<any> = (props:any) => {
  console.log("props", props);
  const { t, i18n } = useTranslation();
  for(let lang in props.translationData.languages) {
    if (!i18n.hasResourceBundle(props.translationData.languages[lang], "common")) {
    console.log(props.translationData.languages[lang]);
    i18n.addResourceBundle(props.translationData.languages[lang], "common", serverResponseToResourcesBundle(props.translationData, props.translationData.languages[lang],"common")|| {}, true, true);
    }
  }
  if (i18n.language != props.language) {
    if(props.language) {
      i18n.changeLanguage(props.language);
    }
  }
  return (
    <BasicLayout
      key="home"
      i18nInstance={i18n}
    >
      <p>
        {t('welcome')}
      </p>
    </BasicLayout>
  )
}

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  let inCommingURL = new URL(req.url, `http://${req.headers.host}`)
  console.log("getInitialProps", inCommingURL.searchParams.get("language"));
  const { translationData, language } = await languageFetcher(req);
  return {
    userAgent,
    translationData,
    language
  }
}

export default Page
