import { all } from 'redux-saga/effects';
import { watchLoadWallet } from './initSaga';
import { watchDeposit } from './depositSaga';
import { watchExchange } from './exchangeSaga';
export default function* rootSaga() {
  yield all([
    watchLoadWallet(),
    watchDeposit(),
  ])
}
