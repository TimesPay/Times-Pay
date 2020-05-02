import Link from '@material-ui/core/Link';
import globalStyle from '../styles/globalStyle';
import { Button, makeStyles, Grid, Typography, Select, MenuItem } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles({
  ...globalStyle,
  colorPrimary: {
    color: "rgba(255, 255, 255, 1)"
  },
  headerText: {
    color: "rgba(255, 255, 255, 1)",
    marginTop: 4,
    marginLeft: 10
  },
  languageSelector: {
    color: "rgb(255, 255, 255)"
  }
})
interface HeaderProps {
  sideMenuVisible: boolean,
  openSideMenu: () => void,
  i18nInstance: any,
}
const Header = (props: HeaderProps) => {
  const classes = useStyles();
  return (
    <div
      className={classes.header}
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        alignContent="space-between"
      >
        <Grid item lg={4}>
          <Grid container>
            <Grid item>
              <Link href="/" underline="none">
                <Typography color="primary" className={classes.headerText}>
                {props.i18nInstance.t("letGetFunds")}
              </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Button onClick={props.openSideMenu}>
                {props.sideMenuVisible
                  ? <ArrowBackIosIcon color="primary" classes={classes} />
                  : <ArrowForwardIosIcon color="primary" classes={classes} />
                }
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item lg={2}>
          <Select
            className={classes.languageSelector}
            onChange={(e:any)=>{
              if(typeof(localStorage) !== "undefined"){
                 localStorage.setItem("language", e.target.value);
                 if(!location.href.includes("language=")) {
                   location.href = location.href + `?language=${e.target.value}`;
                 } else {
                   location.href = location.href.replace(/language=[a-z]{2}/g, `language=${e.target.value}`);
                 }
              }
            }}
            defaultValue={ typeof(localStorage) !== "undefined" ? localStorage.getItem("language") || "en" : "en"}
          >
            <MenuItem value={"en"}>{props.i18nInstance.t("en")}</MenuItem>
            <MenuItem value={"zh"}>{props.i18nInstance.t("zh")}</MenuItem>
          </Select>
        </Grid>
      </Grid>
    </div>
  )
}

export default Header;
