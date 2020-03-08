import React, { useState } from 'react'
import { SafeAreaView, View, Text, ScrollView, StyleSheet } from 'react-native';
import { Container, Header, Content, Body, Left, Button, Icon, Title, Right, Drawer, Card, CardItem } from 'native-base';
import globalStyle from "../utils/globalStyle";
import { Dimensions } from 'react-native';
import SettingPage from "../pages/SettingPage";

interface BasicLayoutProps {
  children: React.ReactNode | React.ReactChild | Element;
  containerStyle: any;
  title: string
}
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { children, containerStyle, title } = props;
  const [drawerVisible, setDrawerVisible] = useState(false);
  console.log("BasicLayout", drawerVisible);
  return (
    <ScrollView
      style={{
        ...containerStyle,
        minHeight: Dimensions.get("window").height,
        minWidth: Dimensions.get("window").width * 0.8,
      }}
    >
      <Header>
        <Left>
          <Button
            transparent
            onPress={() => {
              console.log("clicked");
              setDrawerVisible(!drawerVisible);
            }}
          >
            <Icon name='menu' />
          </Button>
        </Left>
        <Body>
          <Title>{title}</Title>
        </Body>
      </Header>
      <Drawer
        open={drawerVisible}
        content={
          <SettingPage
              containerStyle={styles.drawerContainer}
          />}
        styles={styles.drawerCard}
      >
      </Drawer>
        <View
          style={{
            elevation: -1,
            position: "relative",
            zIndex: -1,
          }}
        >
          {children}
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  ...globalStyle,
  drawerCard: {
    minHeight: Dimensions.get("window").height,
    minWidth: Dimensions.get("window").width * 0.8,
    elevation: 5,
    position: "relative",
    zIndex: 2,
  },
  drawerContainer: {
    minHeight: Dimensions.get("window").height,
    minWidth: Dimensions.get("window").width * 0.8,
    backgroundColor: "rgba(176, 224, 246, 1)",
    display: "flex",
    flexDirection: "column",
    marginLeft: 0,
    marginTop: 0
  }
})

export default BasicLayout;
