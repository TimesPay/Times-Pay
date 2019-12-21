import { call, put, takeEvery } from "redux-saga/effects";
import {
  PAY_START_REQUEST,
} from '../actions/actionTypes';

import {
  payStart,
  paySuccess,
  payFailed
} from '../actions/payAction';

import {
  sendTransaction
} from '../api/wallet'

export function* watchPay() {
  yield takeEvery(PAY_START_REQUEST, payFlow);
}

function* payFlow(action) {
  console.log("payFlow", action);
  try{
    const { destAddress, wallet } = action.payload;
    let newDestAddress = destAddress.slice(9)
    yield put(payStart({
      destAddress: newDestAddress
    }));
    let response = yield call(sendTransaction,{
      destAddress: newDestAddress,
      wallet: wallet,
      amount: "0.1"
    });
    console.log("pay response", response);
    yield put(paySuccess({
      info: "Paid"
    }));
  } catch (e) {
    console.log(e);
    yield put(payFailed({
      errCode: "insufficient fund"
    }));
  }
}
