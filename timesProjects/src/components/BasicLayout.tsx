import React from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';


import Header from './Header';
import globalStyle from '../styles/globalStyle';
import router from '../utils/router';
import { Card, CardContent, Divider, CardHeader, Drawer, Button } from '@material-ui/core';

interface BasicLayoutProps {
  key: string;
  children: any;
}
interface BasicLayoutState {
  loading: boolean;
  sideMenuVisible: boolean
}
class BasicLayout extends React.Component<BasicLayoutProps, BasicLayoutState> {
  constructor(props: BasicLayoutProps) {
    super(props);
    this.state = {
      loading: false,
      sideMenuVisible: false
    }
  }
  componentDidMount() {
    this.setState({
      sideMenuVisible: false
    })
  }
  render() {
    return (
      <main>
        <body>
          <Header
            sideMenuVisible={this.state.sideMenuVisible}
            openSideMenu={() => this.setState({ sideMenuVisible: !this.state.sideMenuVisible })}
          />
          <Drawer
            open={this.state.sideMenuVisible}
          >
            <List component={Card}>
              <CardHeader
                title="menu"
                avatar={<ArrowBackIosIcon />}
                onClick={() => this.setState({ sideMenuVisible: !this.state.sideMenuVisible })}
              />
              {["home", "list", "create"].map((value: string) => (
                <ListItem>
                  <CardContent>
                    <Link href={router[value].url}>
                      <ListItemText primary={router[value].name} />
                    </Link>
                    <Divider />
                  </CardContent>
                </ListItem>
              ))}
            </List>
          </Drawer>
          {this.props.children}
        </body>
      </main>
    )
  }
}
export default BasicLayout;
