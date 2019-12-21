import { all } from 'redux-saga/effects';
import { watchLoadWallet } from './initSaga';
import { watchDeposit } from './depositSaga';
import { watchExchange } from './exchangeSaga';
import { watchPay } from './paySaga';
export default function* rootSaga() {
  yield all([
    watchLoadWallet(),
    watchDeposit(),
    watchPay()
  ])
}
