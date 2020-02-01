import { NextPage } from 'next';
import Link from 'next/link';
import BasicLayout from '../components/BasicLayout';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import { fetcher, defaultOption } from '../utils/fetcher';
interface Props {
  userAgent?: string
}

const Page: NextPage<Props> = (props: Props) => {
  const { data, error } = useSWR('/api/projects', url=>fetcher(url,{
    ...defaultOption
  }));
  console.log("data", data);
  return (
    <BasicLayout key="list">
      content
    </BasicLayout>
  )
}

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
  return { userAgent }
}

export default Page;
