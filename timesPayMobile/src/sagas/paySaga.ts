import { call, put, takeEvery } from "redux-saga/effects";
import {
  PAY_START_REQUEST,
  PAY_ESTIMATE
} from '../actions/actionTypes';

import {
  payStart,
  paySuccess,
  payFailed,
  payEstimateSuccess
} from '../actions/payAction';

import {
  transfer,
  estimateTransfer,
  getContractInterface
} from '../api/contract'

import { translate } from '../utils/I18N';

export function* watchPay() {
  yield takeEvery(PAY_START_REQUEST, payFlow);
}

export function* watchEstimate() {
  yield takeEvery(PAY_ESTIMATE, payEstimateFlow);
}
function* payFlow(action) {
  try{
    const { destAddress, wallet, amount } = action.payload;
    let { contract } = action.payload;
    let newDestAddress = destAddress ;
    if(contract == null) {
      contract = yield call(getContractInterface, {
        wallet: wallet
      })
    }
    if(destAddress[0] != "0"){
      newDestAddress = destAddress.slice(9)
    }
    yield put(payStart({
      destAddress: newDestAddress,
      info: "startPay"
    }));
    // let response = yield call(sendTransaction,{
    //   destAddress: newDestAddress,
    //   wallet: wallet,
    //   amount: "0.1"
    // });
    let response = yield call(transfer,{
      contract: contract,
      destAddress: newDestAddress,
      amount: amount
    })
    console.log("pay response", response);
    yield put(
      paySuccess({
        info: "Paid"
      })
  );
  } catch (e) {
    console.log(e);
    yield put(payFailed({
      errCode: "pay_insufficientFund"
    }));
  }
}

function* payEstimateFlow(action) {
  try{
    const { destAddress, amount, wallet } = action.payload;
    let { contract } = action.payload;
    if(contract == null) {
      console.log("payEstimationFlow", action.payload);
      yield put(payStart({
        destAddress: newDestAddress,
        info: "estimateCost"
      }));
      contract = yield call(getContractInterface, {
        wallet: wallet
      })
    }
    let newDestAddress = destAddress ;
    if(destAddress[0] != "0"){
      newDestAddress = destAddress.slice(9)
    }
    yield put(payStart({
      destAddress: newDestAddress,
      info: "estimateCost"
    }));
    let response = yield call(estimateTransfer,{
      contract: contract,
      destAddress: newDestAddress,
      amount: amount
  })
    console.log("payEstimate response", response);
    yield put(payEstimateSuccess({
      estimatedCost: parseInt(response._hex.slice(2), 16)
    }));
  } catch (e) {
    console.log(e);
    yield put(payFailed({
      errCode: "pay_insufficientFund"
    }));
  }
}
