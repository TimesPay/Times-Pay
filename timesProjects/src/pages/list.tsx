import { NextPage } from 'next';
import Link from 'next/link';
import BasicLayout from '../components/BasicLayout';
import useSWR from 'swr';
import { fetcher, defaultOption } from '../utils/fetcher';
import { Table, TableHead, TableRow, TableCell, TableContainer, TableBody, Card, Avatar, Grid, Button, Slider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import constants from '../utils/constants';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface Props {
  userAgent?: string
}

const Page: NextPage<Props> = () => {
  const { data } = useSWR('/api/projects', url => fetcher(url, {
    ...defaultOption
  }));
  const classes = useStyles()
  console.log("data", data, classes);
  return (
    <BasicLayout key="list">
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell align="left">Receiver</TableCell>
              <TableCell align="center">Raised</TableCell>
              <TableCell align="center">Target</TableCell>
              <TableCell align="center">Progress</TableCell>
              <TableCell align="left">Created At</TableCell>
              <TableCell align="left">Expired At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(data && data.content)
              ? data.content.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    <Button>
                      <Link href={`/${row._id}`}>
                        <Grid container justify="flex-start">
                          <Grid item>
                            <Avatar src={row.projectImageURL} alt={row.projectName} />
                          </Grid>
                          <Grid item>
                            {row.projectName}
                          </Grid>
                        </Grid>
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell align="left">{row.receiverName}</TableCell>
                  <TableCell align="center">{row.raisedAmount}</TableCell>
                  <TableCell align="center">{row.targetAmount}</TableCell>
                  <TableCell align="center">
                    <Grid container>
                      <Grid item xs={12}>
                        <Slider value={parseFloat(row.raisedAmount) / parseFloat(row.targetAmount)} aria-labelledby="continuous-slider"/>
                      </Grid>
                      <Grid item xs={12}>
                        {parseFloat(row.raisedAmount) / parseFloat(row.targetAmount) * 100}%
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell align="left">{moment(row.createdAt).format(constants["dateFormat"])}</TableCell>
                  <TableCell align="left">{moment(row.expiredAt).format(constants["dateFormat"])}</TableCell>
                </TableRow>
              ))
              : null
            }
          </TableBody>
        </Table>
      </TableContainer>
    </BasicLayout>
  )
}

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return {
    userAgent,
    namespacesRequired: ['common']
  }
}

export default Page;
