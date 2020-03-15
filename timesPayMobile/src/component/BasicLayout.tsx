import React, { useState, useEffect } from 'react'
import { SafeAreaView, View, Text, ScrollView, StyleSheet, Animated, Easing } from 'react-native';
import { Container, Header, Content, Body, Left, Button, Icon, Title, Right, Drawer, Card, CardItem } from 'native-base';
import globalStyle from "../utils/globalStyle";
import { Dimensions } from 'react-native';
import SettingPage from "../pages/SettingPage";

interface BasicLayoutProps {
  children: React.ReactNode | React.ReactChild | Element;
  containerStyle: any;
  title: string,
}
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { children, containerStyle, title } = props;
  const [drawerVisible, setDrawerVisible] = useState(false);
  let drawer:any;
  return (
    <SafeAreaView
      style={{
        position: "relative",
        zIndex: 3,
        elevation: 3,
        minHeight: Dimensions.get("window").height,
        minWidth: Dimensions.get("window").width,
      }}
    >
      <Header
        style={{
          backgroundColor: "rgba(0, 0, 0, 1)",
          elevation: 3,
          position: "relative",
          zIndex: 3,
        }}
      >
        <Left>
          <Button
            transparent
            onPress={() => {
              drawer._root.open()
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
        }}
      >
        <Drawer
          ref={ref=>drawer = ref}
          content={
            <SettingPage
              containerStyle={{
                ...styles.drawerContainer,
                width: drawerVisible ? Dimensions.get("screen").width * 1.01 : 0,
                opacity: drawerVisible ? 1 : 0
              }}
              handleClose={() => {
                drawer._root.close();
              }}
            />}
          tapToClose
          onClose={() => {
            setDrawerVisible(false);
          }}
          onOpen={()=>{
            setDrawerVisible(true);
          }}
          tweenDuration={600}
          tweenEasing={ drawerVisible ? "easeInBack" : "easeOutBack"}
          styles={styles.drawerCard}
        >
          <View
            style={{
              elevation: 0,
              position: "relative",
              zIndex: 0,
              minHeight: Dimensions.get("window").height,
              backgroundColor: "rgba(255, 255, 255, 1)"
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
    minWidth: Dimensions.get("screen").width,
    elevation: 1,
    position: "relative",
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.88)"
  },
  drawerContainer: {
    minHeight: Dimensions.get("window").height * 0.9,
    marginLeft: -1,
    marginTop: -50,
    backgroundColor: "rgba(0, 0, 0, 0.82)",
    elevation: 0,
    borderStyle: "solid",
    borderColor: "rgba(0, 0, 0, 1)",
    position: "absolute"
  }
})

export default BasicLayout;
