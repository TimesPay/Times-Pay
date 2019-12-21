import React from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
// import {
//   I18nManager,
//   Platform,
//   NativeRouter as Router,
//   Switch,
//   Route,
//   Link,
//   routerReducer
// } from "react-router-native";
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
// import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { setI18nConfig } from './src/utils/I18N';
import * as RNLocalize from 'react-native-localize';

import InitPage from './src/pages/InitPage';
import ExchangePage from './src/pages/ExchangePage';
import DepositPage from './src/pages/DepositPage';
import PayPage from './src/pages/PayPage';

import initReducer from './src/reducers/initReducer';
import exchangeReducer from './src/reducers/exchangeReducer';
import depositReducer from './src/reducers/depositReducer';
import payReducer from './src/reducers/payReducer';

import rootSaga from './src/sagas/entrySaga';

const sagaMiddleware = createSagaMiddleware();
let store = createStore(combineReducers({
  initReducer,
  exchangeReducer,
  depositReducer,
  payReducer
}), applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

const I18n = {};
I18n.defaultLocale = "en-US";
I18n.locale = "en-US"
I18n.missingTranslation = () => null;
// const AppNavigator = createStackNavigator({
//   Initial: {
//     screen: InitPage,
//   },
//   Exchange: {
//     screen: ExchangePage,
//   }
// })
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
    activeColor: '#f0edf6',
    inactiveColor: 'white',
    barStyle: { backgroundColor: '#694fad' },
  }
)
let Navigation = createAppContainer(MaterialBottomTabNavigator);
const uiTheme = {
  palette: {
    primaryColor: COLOR.yellow50,
  },
  toolbar: {
    container: {
      height: 50
    }
  }
}

class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    setI18nConfig();
  }

  componentDidMount() {
    RNLocalize.addEventListener("change", this.handleLocalizationChange);
  }

  componentWillUnmount() {
    RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }

  handleLocalizationChange = () => {
    setI18nConfig();
    this.forceUpdate();
  };

  render() {
    return (
      <Provider store={store}>
        <ThemeContext.Provider value={getTheme(uiTheme)}>
          <>
            {/* <BasicLayout> */}
              <Navigation />
            {/* </BasicLayout> */}
          </>
        </ThemeContext.Provider>
      </Provider>
    )
  }
}
export default App;
