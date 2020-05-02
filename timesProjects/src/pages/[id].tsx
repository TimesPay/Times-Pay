import { useRouter } from 'next/router';
import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import QRCode from 'qrcode.react';

import globalStyle from '../styles/globalStyle';
import BasicLayout from '../components/BasicLayout';
import { fetcher } from '../utils/fetcher';
import { languageFetcher } from '../utils/languageFetcher';
import { useTranslation } from 'react-i18next';
import i18nLoader, { serverResponseToResourcesBundle } from '../i18n';
import { Grid, Card, CardContent, Button, Typography } from '@material-ui/core';
import { useState } from 'react';

interface DetailProps {
  userAgent?: string;
  err?: string,
  language?: string,
  translationData?: any,
}
i18nLoader("en", {}, "common");

const Page: NextPage<DetailProps> = (props: DetailProps) => {
  const router = useRouter();
  const { data } = useSWR(`/api/project/${router.query.id}`, fetcher);
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

  let raisedRatio = projectData.raisedAmount/projectData.targetAmount * 100;
  let formatedRaisedRatio = raisedRatio.toLocaleString(
    undefined, // leave undefined to use the browser's locale,
    // or use a string like 'en-US' to override it.
    { minimumFractionDigits: 2 }
  );
  return (
    <BasicLayout
      key="detail"
      i18nInstance={i18n}
    >
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
                      {t("fundTheirProj")}
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
                {`${t("receiver")}: ${projectData.receiverName}`}
              </CardContent>
            </Grid>
            <Grid item xs={12}>
              <CardContent>
                {`${t("projDesc")}: ${projectData.projectDescciption}`}
              </CardContent>
            </Grid>
            <Grid item xs={12}>
              <CardContent>
                {`${t("progress")}: ${formatedRaisedRatio}%`}
              </CardContent>
            </Grid>
            <Grid item xs={12}>
              <CardContent>
                <Link href={projectData.projectWhitePaperURL}>
                {t("downloadWhitePaper")}
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
  const { translationData, language } = await languageFetcher(req);
  return {
    userAgent,
    namespacesRequired: ['common'],
    translationData,
    language
  }
}

export default Page
