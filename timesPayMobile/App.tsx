import React from 'react'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { Provider } from 'react-redux'
import { COLOR, ThemeContext, getTheme } from 'react-native-material-ui'

import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { setI18nConfig } from './src/utils/I18N'
import * as RNLocalize from 'react-native-localize'

import AppContainer from './src/pages/navigation'

import initReducer from './src/reducers/initReducer'
import exchangeReducer from './src/reducers/exchangeReducer'
import depositReducer from './src/reducers/depositReducer'
import payReducer from './src/reducers/payReducer'

import rootSaga from './src/sagas/entrySaga'

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
I18n.missingTranslation = () => null

const uiTheme = {
  palette: {
    primaryColor: COLOR.yellow50,
  },
  toolbar: {
    container: {
      height: "10%"
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
            <AppContainer />
            {/* </BasicLayout> */}
          </>
        </ThemeContext.Provider>
      </Provider>
    )
  }
}
export default App;
