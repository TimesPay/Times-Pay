import Link from 'next/link';
import globalStyle from '../styles/globalStyle';
import { NavType } from '../utils/types';
import { Button } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

interface HeaderProps {
  sideMenuVisible: boolean,
  openSideMenu: () => void,
}
const Header = (props: HeaderProps) => {
  const NavBtn = (props: NavType) => (
    <Link href={props.url}>
      <a
        style={globalStyle.link}
        title={props.title}
      >
        {props.title}
    </a>
    </Link>
  )
  return (
    <div
      style={globalStyle.header}
      >
      <Button onClick={props.openSideMenu}>
        { props.sideMenuVisible
          ? <ArrowBackIosIcon />
          : <ArrowForwardIosIcon/>
        }
      </Button>
    </div>
      )
}

export default Header;
