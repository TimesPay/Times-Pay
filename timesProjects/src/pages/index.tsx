import { NextPage } from 'next';
import BasicLayout from '../components/BasicLayout';
import NextI18Next, { withTranslation } from '../i18n' // We replace next/link with the one provide by next-i18next, this helps with locale subpaths

const Page: NextPage<any> = ({t}) => {
  console.log(NextI18Next);
  return (
    <BasicLayout key="home">
      <p>{t(["welcome"],{
        defaultValue: "diu zai"
      })}</p>
    </BasicLayout>
  )
}

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  NextI18Next.i18n.changeLanguage("en");
  return {
    userAgent,
    namespacesRequired: ['common']
  }
}

export default withTranslation('common')(Page)
