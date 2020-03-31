import { NextPage } from 'next';
import BasicLayout from '../components/BasicLayout';
// import useSWR from 'swr';
import { serverFetcher, defaultOption } from '../utils/fetcher';
import { useTranslation } from 'react-i18next';
import i18nLoader, { serverResponseToResourcesBundle } from '../i18n';

i18nLoader("en", {}, "common");
const Page: NextPage<any> = (props:any) => {
  console.log("props", props);
  const { t, i18n } = useTranslation();

  i18n.addResources(props.language, "common", serverResponseToResourcesBundle(props.translationData, props.language,"common")|| {});
  i18n.changeLanguage(props.language);
  return (
    <BasicLayout key="home">
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
  let language = inCommingURL.searchParams.get("language") ? inCommingURL.searchParams.get("language") : "en";
  let translationData = await serverFetcher('/translation?locale='+language, {
    ...defaultOption
  })
  return {
    userAgent,
    translationData,
    language
  }
}

export default Page
