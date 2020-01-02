import { all } from 'redux-saga/effects';
import { watchLoadWallet, watchCreateWallet } from './initSaga';
import { watchDeposit } from './depositSaga';
import {
  watchLoadContract,
  watchContractIntereaction
} from './exchangeSaga';
import { watchPay, watchEstimate } from './paySaga';
export default function* rootSaga() {
  yield all([
    watchLoadWallet(),
    watchCreateWallet(),
    watchDeposit(),
    watchPay(),
    watchLoadContract(),
    watchContractIntereaction(),
    watchEstimate()
  ])
}
