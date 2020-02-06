import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import QRCode from 'qrcode.react';

import globalStyle from '../styles/globalStyle';
import BasicLayout from '../components/BasicLayout';
import { fetcher } from '../utils/fetcher';
import { Grid, Card, CardMedia, CardContent, Button, Typography } from '@material-ui/core';
import { useState } from 'react';

interface DetailProps {
  userAgent?: string;
  err?: string
}

const Page: NextPage<DetailProps> = ({ userAgent, err }) => {
  const router = useRouter();
  const { data, error } = useSWR(`/api/project/${router.query.id}`, fetcher);
  const [fundCardVisible, setFundCardVisible] = useState(false);
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
        {!fundCardVisible && (
          <Card style={{ ...globalStyle.centerContent, marginTop: 40 }}>
            <Grid item xs={12}>
              <CardContent>
                <Grid container justify="space-between">
                  <Grid item>
                    {projectData.projectName}
                  </Grid>
                  <Grid item>
                    <Button onClick={() => setFundCardVisible(!fundCardVisible)}>
                      Fund their project
                    </Button>
                  </Grid>
                </Grid>
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
                  Click here to download white paper
                </Link>
              </CardContent>
            </Grid>
          </Card>
        )}
        {fundCardVisible && (
          <Card
            style={{ ...globalStyle.centerContent, marginTop: 40 }}
          >
            <Grid item xs={12}>
              <CardContent>
                <QRCode
                  value={projectData.receiverWallet.address}
                  style={{ marginLeft: "35%", width: "30%", height: "30%" }}
                />
              </CardContent>
            </Grid>
            <Grid item xs={12}>
              <CardContent>
                <Typography>
                  <p>
                    Instruction:
                  </p>
                  <p>
                    1. Scan the barcode using USDC enabled App
                    </p>
                  <p>
                    2. Input amount
                    </p>
                  <p>
                    3. Send the payment
                    </p>
                  <p>
                    4. wait for a while
                    </p>
                  <p>
                    5. Done!
                    </p>
                </Typography>
              </CardContent>
            </Grid>
            <Grid item xs={12}>
              <CardContent>
                <Grid item>
                  <Button onClick={() => setFundCardVisible(!fundCardVisible)}>
                    Back
                  </Button>
                </Grid>
              </CardContent>
            </Grid>
          </Card>)}
      </Grid>
    </BasicLayout>
  )
}

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent }
}

export default Page
