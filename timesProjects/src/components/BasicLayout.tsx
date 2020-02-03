import React from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';

import Header from './Header';
import globalStyle from '../styles/globalStyle';
import router from '../utils/router';

interface BasicLayoutProps {
  key: string;
  children: any;
}
interface BasicLayoutState {
  loading: boolean;
}
class BasicLayout extends React.Component<BasicLayoutProps, BasicLayoutState> {
  constructor(props: BasicLayoutProps) {
    super(props);
  }
  render() {
    return (
      <main>
        <body>
          <Header />
          <Grid
            container
          >
          <Grid item xs={3}>
            <List>
              {["home", "list", "create"].map((value: string)=>(
                <ListItem>
                  <Link href={router[value].url}>
                    <ListItemText primary={router[value].name}/>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={9}>
            {this.props.children}
          </Grid>
        </Grid>
      </body>
      </main>
    )
  }
}
export default BasicLayout;
