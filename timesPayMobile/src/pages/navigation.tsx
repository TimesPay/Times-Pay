import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch'
import { Transition } from 'react-native-reanimated'

import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'

import RegisterPage from './RegisterPage'
import WalletPasswordPage from './WalletPasswordPage'
import RecoverWalletPage from './RecoverWalletPage'
import RecoveryPhrasePage from './RecoveryPhrasePage'
import UnlockWalletPage from './UnlockWalletPage'
import LoadingPage from './LoadingPage'

import InitPage from './InitPage'
import ExchangePage from './ExchangePage'
import DepositPage from './DepositPage'
import PayPage from './PayPage'

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
    Initial: {
      screen: InitPage,
    },
    Exchange: {
      screen: ExchangePage,
    },
    Deposit: {
      screen: DepositPage,
    },
    Pay: {
      screen: PayPage
    }
  },
  {
    initialRouteName: 'Initial',
    activeColor: '#F0EDF6',
    inactiveColor: 'white',
    barStyle: { backgroundColor: '#694FAD' },
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
