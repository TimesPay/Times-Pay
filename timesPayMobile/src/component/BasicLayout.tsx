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
    <SafeAreaView
      style={{
        position: "relative",
        zIndex: 10,
        elevation: 10,
        minHeight: Dimensions.get("window").height,
        minWidth: Dimensions.get("window").width * 0.8,
      }}
    >
      <Header
        style={{
          backgroundColor: "rgba(0, 0, 0, 1)",
        }}
      >
        <Left>
          <Button
            transparent
            onPress={() => {
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
      <SafeAreaView
        style={{
          ...containerStyle,
          minHeight: Dimensions.get("window").height,
          minWidth: Dimensions.get("window").width * 0.8,
          backgroundColor: "rgba(255, 255, 255, 1)"
        }}
      >
        <Drawer
          open={drawerVisible}
          content={
            <SettingPage
              containerStyle={styles.drawerContainer}
            />}
          tapToClose
          onClose={()=>setDrawerVisible(false)}
          styles={styles.drawerCard}
        >
          <View
            style={{
              elevation: 0,
              position: "relative",
              zIndex: 0,
            }}
          >
            {children}
          </View>
        </Drawer>
      </SafeAreaView>
    </SafeAreaView>
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
    marginTop: 0,
    backgroundColor: "rgba(0, 0, 0, 1)"
  }
})

export default BasicLayout;
