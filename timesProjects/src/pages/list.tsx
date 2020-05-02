import { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import BasicLayout from '../components/BasicLayout';
import useSWR from 'swr';
import { languageFetcher } from '../utils/languageFetcher';
import { Table, TableHead, TableRow, TableCell, TableContainer, TableBody, Card, Avatar, Grid, Button, Slider, CircularProgress, TablePagination, Input, TextField } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import i18nLoader, { serverResponseToResourcesBundle } from '../i18n';
import moment from 'moment';
import constants from '../utils/constants';
import { fetcher, defaultOption } from '../utils/fetcher';

const useStyles = makeStyles({
  'spinner-root':{
    position: "absolute",
    marginLeft: "48%",
    marginTop: "48vh"
  },
  'expand-icon-row-root': {
    display: "flex !important",
    flexDirection: "row",
    justifyContent: "center",
    width: "100vw",
    position: "absolute"
  },
  'table-header-column-root': {
    width: "20%"
  }
})

interface Props {
  userAgent?: string;
  language: string;
  translationData: any;
}
i18nLoader("en", {}, "common");
const Page: NextPage<Props> = (props:Props) => {
  const classes = useStyles();
  const [ searchParam, setSearchParam ] = useState({
    sortOn: JSON.stringify({
      projName: 1
    }),
    filterOn: JSON.stringify({}),
    page: 0,
    pageSize:4
  });
  const [ shouldRefresh, refresh ] = useState(true);
  const [ projData, setProjData ] = useState([]);
  const [ filterSwitchStatus, filterSwitch ] = useState(false);
  console.log("shouldRefresh", shouldRefresh, searchParam);
  const { data, isValidating } = useSWR(shouldRefresh ? "/api/projects" : null, url=> fetcher(url, {
    ...defaultOption,
    params: searchParam
  }),{
    onSuccess: (data, key, config) => {
      console.log("fetchSuccess", data, key, config);
      refresh(false);
      if(data) {
        if(Array.isArray(data.content)) {
          setProjData(data.content);
        }
      }
    },
  });
  console.log("data", data, isValidating);
  if(data && !isValidating) {
    refresh(false);
  }
  const { t, i18n } = useTranslation();
  // console.log("languageBundle", serverResponseToResourcesBundle(props.translationData, i18n.language,"common"));
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

  const headers = [
    { name: "projName", filterType: "string" },
    { name: "receiver", filterType: "string" },
    { name: "raised", filterType: "quantity" },
    { name: "target", filterType: "quantity" },
    { name: "progress", filterType: "quantity" },
    { name: "createdAt", filterType: "date" },
    { name: "expiredAt", filterType: "date" }
  ]
  // console.log("data", props.language, t("projName"), t("receiver"), t("raised"), t("target"), t("progress"), t("createdAt"), t("expiredAt"));
  console.log("classes", classes);
  return (
    <BasicLayout
      key="list"
      i18nInstance={i18n}
    >
      {
        shouldRefresh
        ? <CircularProgress classes={{
          root: classes['spinner-root']}}/>
        : <TableContainer component={Card}>
          <Table
            stickyHeader={true}
          >
            <TableHead>
              <TableRow>
                {
                  headers.map((value:any)=>{
                    const sortOnObj = JSON.parse(searchParam['sortOn']);
                    return (
                      <TableCell
                        align="center"
                        classes={{
                          root: classes['table-header-column-root']
                        }}
                      >
                        <Button
                          onClick={()=>{
                            console.log("sortOnObj", sortOnObj);
                            setSearchParam({
                              ...searchParam,
                              sortOn: JSON.stringify({
                                [value.name]: sortOnObj[value.name]
                                ? -1 * sortOnObj[value.name]
                                : 1
                              })
                            });
                            refresh(true);
                          }}
                        >
                          {t(value.name)}
                          {
                            sortOnObj[value.name]
                            ? sortOnObj[value.name] == -1
                            ? <ArrowDropDownIcon/>
                            : <ArrowDropUpIcon/>
                            : null
                          }
                        </Button>
                      </TableCell>
                    )
                  })
                }
              </TableRow>
              {
                filterSwitchStatus
                ? <TableRow>
                {
                  headers.map((value:any)=>{
                    const filterOnObj = JSON.parse(searchParam['filterOn']);
                    return (
                      <TableCell
                      align="center"
                      >
                        {
                          value.filterType == "string"
                          ? <Input
                              onChange={(e)=>{
                                setSearchParam({
                                  ...searchParam,
                                  filterOn: JSON.stringify({
                                    ...filterOnObj,
                                    [value.name]: e.target.value
                                  })
                                })
                              }}
                              onBlur={(_)=>{
                                refresh(true);
                              }}
                              onKeyUp={(e)=>{
                                if (e.keyCode === 13) {
                                    refresh(true);
                                }
                              }}
                              value={filterOnObj[value.name] ? filterOnObj[value.name] : null}
                              placeholder={t(value.name)}
                            />
                          : value.filterType == "quantity"
                            ? <Grid container justify="space-around">
                                <Grid item xs={5}>
                                  <Input
                                    onChange={(e)=>{
                                      setSearchParam({
                                        ...searchParam,
                                        filterOn: JSON.stringify({
                                          ...filterOnObj,
                                          [`${value.name}From`]: e.target.value
                                        })
                                      })
                                    }}
                                    onBlur={(_)=>{
                                      refresh(true);
                                    }}
                                    onKeyUp={(e)=>{
                                      if (e.keyCode === 13) {
                                          refresh(true);
                                      }
                                    }}
                                    value={filterOnObj[`${value.name}From`] ? filterOnObj[`${value.name}From`] : null}
                                    placeholder={t('from')}
                                  />
                                </Grid>
                                <Grid item xs={5}>
                                  <Input
                                    onChange={(e)=>{
                                      setSearchParam({
                                        ...searchParam,
                                        filterOn: JSON.stringify({
                                          ...filterOnObj,
                                          [`${value.name}To`]: e.target.value
                                        })
                                      })
                                    }}
                                    onBlur={(_)=>{
                                      refresh(true);
                                    }}
                                    onKeyUp={(e)=>{
                                      if (e.keyCode === 13) {
                                          refresh(true);
                                      }
                                    }}
                                    value={filterOnObj[`${value.name}To`] ? filterOnObj[`${value.name}To`] : null}
                                    placeholder={t('to')}
                                  />
                                </Grid>
                              </Grid>
                            : <Grid container>
                                <Grid item>
                                  <TextField
                                    label={t('from')}
                                    type="date"
                                    value={filterOnObj[`${value.name}From`] ? filterOnObj[`${value.name}From`] : null}
                                    placeholder={moment().format("YYYY-MM-DD")}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    onChange={(e)=>{
                                      setSearchParam({
                                        ...searchParam,
                                        filterOn: JSON.stringify({
                                          ...filterOnObj,
                                          [`${value.name}From`]: e.target.value
                                        })
                                      })
                                      let date = moment(e.target.value, "YYYY-MM-DD");
                                      if(date.isValid()) {
                                        refresh(true);
                                      }
                                    }}
                                    onBlur={(_)=>{
                                      refresh(true);
                                    }}
                                  />
                                </Grid>
                                <Grid item>
                                <TextField
                                  label={t('to')}
                                  type="date"
                                  value={filterOnObj[`${value.name}To`] ? filterOnObj[`${value.name}To`] : null}
                                  placeholder={moment().format("YYYY-MM-DD")}
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  onChange={(e)=>{
                                    setSearchParam({
                                      ...searchParam,
                                      filterOn: JSON.stringify({
                                        ...filterOnObj,
                                        [`${value.name}To`]: e.target.value
                                      })
                                    })
                                    let date = moment(e.target.value, "YYYY-MM-DD");
                                    if(date.isValid()) {
                                      refresh(true);
                                    }
                                  }}
                                  onBlur={(_)=>{
                                    refresh(true);
                                  }}
                                />
                                </Grid>
                              </Grid>
                        }
                      </TableCell>
                    )
                  })
                }
                </TableRow>
                : null
              }
              <Grid container xs={12} classes={{
                root: classes['expand-icon-row-root']
              }}>
                <Button
                  onClick={(_)=>{
                    filterSwitch(!filterSwitchStatus);
                  }}
                >
                  {
                    filterSwitchStatus
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                </Button>
              </Grid>
            </TableHead>
            <TableBody>
              {
                Array.isArray(projData)
                ? projData.map((row:any) => {
                  let target = parseFloat(row.raisedAmount) / parseFloat(row.targetAmount) * 100;
                  target = parseFloat(target.toFixed(2));
                  return(
                    <TableRow key={row._id}>
                      <TableCell component="th" scope="row" align="center">
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
                      <TableCell align="center">{row.receiverName}</TableCell>
                      <TableCell align="center">{row.raisedAmount}</TableCell>
                      <TableCell align="center">{row.targetAmount}</TableCell>
                      <TableCell align="center">
                        <Grid container>
                          <Grid item xs={12}>
                            <Slider value={target} aria-labelledby="continuous-slider"/>
                          </Grid>
                          <Grid item xs={12}>
                            {target}%
                          </Grid>
                        </Grid>
                      </TableCell>
                      <TableCell align="center">{moment(row.createdAt).format(constants["dateFormat"])}</TableCell>
                      <TableCell align="center">{moment(row.expiredAt).format(constants["dateFormat"])}</TableCell>
                    </TableRow>
                  )})
                  : null
                }
            </TableBody>
            <TablePagination
              count={-1}
              onChangePage={(event: object, page: number)=>{
                setSearchParam({
                  ...searchParam,
                  page
                });
                refresh(true);
              }}
              onChangeRowsPerPage={(event: any)=>{
                console.log(event);
                setSearchParam({
                  ...searchParam,
                  pageSize: event.target.value
                });
                refresh(true);
              }}
              page={searchParam.page}
              rowsPerPage={searchParam.pageSize}
              rowsPerPageOptions={[4,5,10,20]}
            />
          </Table>
        </TableContainer>
      }

    </BasicLayout>
  )
}

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const { translationData, language } = await languageFetcher(req);
  // const productListData = await serverFetcher('/projects', {
  //   ...defaultOption
  // });
  return {
    userAgent,
    translationData,
    language,
    // productListData
  }
}

export default Page;
