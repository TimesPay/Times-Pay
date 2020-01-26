import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer } from 'react-navigation'
import Init from './init'
import CreateWalletPasswordPage from './createWalletPasswordPage'
import RecoverWalletPage from '../RecoverWalletPage'

const InitPageNavigator = createStackNavigator(
  {
    Init: { screen: Init },
    CreateWalletPassword: {screen: CreateWalletPasswordPage},
    RecoverWallet: {screen: RecoverWalletPage}
  },
  {
    initialRouteName: 'Init',
    defaultNavigationOptions: {
      headerStyle: {
        borderBottomColor: "white"
      }
    }
  }
)

const InitPageContainer = createAppContainer(InitPageNavigator)

export default InitPageContainer