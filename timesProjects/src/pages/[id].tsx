import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import globalStyle from '../styles/globalStyle';
import BasicLayout from '../components/BasicLayout';
import { fetcher } from '../utils/fetcher';
import { Grid, Card, CardMedia, CardContent } from '@material-ui/core';

interface DetailProps {
  userAgent?: string;
  err?: string
}

const Page: NextPage<DetailProps> = ({ userAgent, err }) => {
  const router = useRouter();
  const { data, error } = useSWR(`/api/project/${router.query.id}`, fetcher);
  console.log("data", data);
  let projectData = {
    _id: "",
    receiverWallet: {
      _id: "",
      address: "",
      balance: 0
    },
    receiverName: "",
    projectName: "",
    projectDescciption: "",
    projectImageURL: "",
    projectWhitePaperURL: "",
    targetAmount: 0,
    raisedAmount: 0,
    expiredAt: ""
  };
  if (Array.isArray(data && data.content)) {
    if (data.content.length > 0) {
      projectData = Object.assign({}, data.content[0]);
    }
  }
  return (
    <BasicLayout key="detail">
      <Grid container>
        <Card style={{ ...globalStyle.centerContent, marginTop: 40 }}>
          <Grid item xs={12}>
            <CardContent>
              {projectData.projectName}
            </CardContent>
          </Grid>
          <Grid item xs={12}>
            <img src={projectData.projectImageURL} width={"100%"} />
          </Grid>
          <Grid item xs={12}>
            <CardContent>
              {projectData.receiverName}
            </CardContent>
          </Grid>
          <Grid item xs={12}>
            <CardContent>
              {projectData.projectDescciption}
            </CardContent>
          </Grid>
          <Grid item xs={12}>
            <CardContent>
              {projectData.targetAmount}
            </CardContent>
          </Grid>
          <Grid item xs={12}>
            <CardContent>
              {projectData.raisedAmount}
            </CardContent>
          </Grid>
          <Grid item xs={12}>
            <CardContent>
              <Link href={projectData.projectWhitePaperURL}>
              {projectData.projectWhitePaperURL}
              </Link>
            </CardContent>
          </Grid>
        </Card>
      </Grid>
    </BasicLayout>
  )
}

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent }
}

export default Page
