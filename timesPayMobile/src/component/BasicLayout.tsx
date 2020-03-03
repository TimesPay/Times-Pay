import React, { useState } from 'react'
import { SafeAreaView, View, Text, ScrollView } from 'react-native';
import { Container, Header, Content, Body, Left, Button, Icon, Title, Right, Drawer, Card, CardItem } from 'native-base';


interface BasicLayoutProps {
  children: React.ReactNode | React.ReactChild | Element;
  containerStyle: any;
  title: string
}
const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { children, containerStyle, title } = props;
  console.log("BasicLayout", children);
  let drawer:any;
  return (
    <ScrollView
      style={containerStyle}
    >
      <Header>
        <Left>
          <Button
            transparent
            onPress={()=>drawer._root.open() }
          >
            <Icon name='menu' />
          </Button>
        </Left>
        <Body>
          <Title>{title}</Title>
        </Body>
      </Header>
      <Drawer
        ref={(ref) => { drawer = ref;}}
        onClose={()=>drawer._root.close()}
        tapToClose
        content={
          <Card>
            <CardItem>
              <Text>Hi</Text>
            </CardItem>
          </Card>
        }
      >
      </Drawer>
      {children}
    </ScrollView>
  )
}

export default BasicLayout;
