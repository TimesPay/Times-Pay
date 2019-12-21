import { call, put, takeEvery } from "redux-saga/effects";
import {
  PAY_START,
} from '../actions/actionTypes';

import {
  payStart,
  paySuccess,
  payFailed
} from '../actions/payAction';

export function* watchPay() {
  yield takeEvery(PAY_START, payFlow);
}

function* payFlow(payload) {
  console.log(payload);
  try{
    yield put(payStart({
      destAddress: payload
    }));
    yield put(paySuccess({
      info: "Paid"
    }));
  } catch (e) {
    yield put(payFailed({
      errCode: "insufficient fund"
    }));
  }
}
