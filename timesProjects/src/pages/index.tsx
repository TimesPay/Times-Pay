import { NextPage } from 'next';
import Link from 'next/link';
import globalStyle from '../styles/globalStyle';
import BasicLayout from '../components/BasicLayout';

interface IndexProps {
  userAgent?: string;
  err?: string
}

const Page: NextPage<IndexProps> = ({ userAgent, err }) => {
  return (
    <BasicLayout key="home">
      <p>Homepage</p>
    </BasicLayout>
  )
}

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent }
}

export default Page
