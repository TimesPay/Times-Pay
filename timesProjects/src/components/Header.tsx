import Link from 'next/link';
import globalStyle from '../styles/globalStyle';
import { NavType } from '../utils/types';

const Header = () => {
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
      <NavBtn title="Home" url="/"/>
      <NavBtn title="List" url="/list"/>
    </div>
      )
}

export default Header;
