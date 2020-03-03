import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch'
import { Transition } from 'react-native-reanimated'
import { View } from 'react-native'
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIconsIcon from 'react-native-vector-icons/MaterialIcons';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'

import RegisterPage from './RegisterPage'
import WalletPasswordPage from './WalletPasswordPage'
import RecoverWalletPage from './RecoverWalletPage'
import RecoveryPhrasePage from './RecoveryPhrasePage'
import UnlockWalletPage from './UnlockWalletPage'
import LoadingPage from './LoadingPage'

// import InitPage from './InitPage'
import ExchangePage from './ExchangePage'
import DepositPage from './DepositPage'
import PayPage from './PayPage'
import SettingPage from './SettingPage'



const AuthStack = createStackNavigator(
  {
    Register: { screen: RegisterPage },
    WalletPassword: {screen: WalletPasswordPage},
    RecoverWallet: {screen: RecoverWalletPage},
    UnlockWallet: {screen: UnlockWalletPage}
  },
  {
    initialRouteName: 'Register',
    defaultNavigationOptions: {
      headerStyle: {
        borderBottomColor: "white"
      }
    }
  }
)

const MaterialBottomTabNavigator = createMaterialBottomTabNavigator(
  {
    // Initial: {
    //   screen: InitPage,
    // },
    Exchange: {
      screen: ExchangePage,
      navigationOptions:{
        tabBarLabel:'Exchange',
        tabBarIcon: ({ tintColor }) => (
            <View>
              <MaterialCommunityIconsIcon
                name="swap-horizontal"
                size={24}
                color={"white"}
              />
            </View>),
        }
    },
    Deposit: {
      screen: DepositPage,
      navigationOptions:{
        tabBarLabel:'Deposit',
        tabBarIcon: ({ tintColor }) => (
            <View>
              <MaterialIconsIcon
                name="input"
                size={24}
                color={"white"}
              />
            </View>),
        }
    },
    Pay: {
      screen: PayPage,
      navigationOptions:{
        tabBarLabel:'Pay',
        tabBarIcon: ({ tintColor }) => (
            <View>
              <MaterialIconsIcon
                name="payment"
                size={24}
                color={"white"}
              />
            </View>),
        }
    },
    Setting: {
      screen: SettingPage,
      navigationOptions:{
        tabBarLabel:'Setting',
        tabBarIcon: ({ tintColor }) => (
            <View>
            </View>),
        }
    }
  },
  {
    initialRouteName: 'Exchange',
    activeTintColor: '#FFFFFF',
    inactiveTintColor: '#27E01B',
    barStyle: { backgroundColor: '#000000' },
  }
)

const AppNavigator = createAnimatedSwitchNavigator(
  {
    Loading: {screen: LoadingPage},
    Auth: {screen: AuthStack},
    RecoveryPhrase: {screen: RecoveryPhrasePage},
    App: {screen: MaterialBottomTabNavigator}
  },
  {
    initialRouteName: 'Loading',
    transition: (
      <Transition.Together>
        <Transition.Out
          type="slide-left"
          durationMs={300}
          interpolation="easeIn"
        />
        <Transition.In type="fade" durationMs={200} />
      </Transition.Together>
    ),
  }
)

export default createAppContainer(AppNavigator)
