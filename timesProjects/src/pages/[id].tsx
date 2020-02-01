import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import globalStyle from '../styles/globalStyle';
import BasicLayout from '../components/BasicLayout';
import { fetcher } from '../utils/fetcher';

interface DetailProps {
  userAgent?: string;
  err?: string
}

const Page: NextPage<DetailProps> = ({ userAgent, err }) => {
  const router = useRouter();
  const { data, error } = useSWR(`/api/project/${router.query.id}`, fetcher);
  return (
    <BasicLayout key="detail">
      <p>{Array.isArray(data && data.content) ? data.content[0].detail : ""}</p>
    </BasicLayout>
  )
}

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent }
}

export default Page
