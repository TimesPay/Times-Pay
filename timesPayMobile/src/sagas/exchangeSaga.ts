import { call, put, takeEvery } from "redux-saga/effects";

import {
  LOAD_CONTRACT_EXCHANGE,
  GET_DATA_EXCHANGE
} from '../actions/actionTypes';
import {
  fetchStart,
  fetchSuccess,
  fetchFailed,
  loadContract,
  loadContractSuccess,
  getExchangeDataSuccess
} from '../actions/exchangeAction'

import {
  getContractInterface,
  getBalance
} from '../api/contract';
import errCode from '../utils/errCode';
import constants from '../utils/constants';

export function* watchLoadContract() {
  yield takeEvery(LOAD_CONTRACT_EXCHANGE, loadContractFlow);
}

export function* watchContractIntereaction() {
  yield takeEvery(GET_DATA_EXCHANGE, getExchangeDataFlow)
}
function* loadContractFlow(action) {
  try {
    yield put(fetchStart());
    let newContract = yield call(getContractInterface, action.payload);
    console.log("loadContractFlow contract", newContract);
    if (newContract != null) {
      console.log("load success");
      yield put(
        loadContractSuccess({
          contract: newContract
        })
      );
    } else {
      yield put(
        fetchFailed({
          errCode: errCode["loadContract.failed"]
        })
      );
    }
  } catch (e) {
    yield put(fetchFailed({
      errCode: errCode["loadContract.failed"]
    }))
  }
}

function* getExchangeDataFlow(action) {
  yield put(fetchStart());
  switch (action.payload.type) {
    case constants["balance"]:
      let balance = yield call(getBalance, {
        contract: action.payload.contract
      });
      yield put(
        getExchangeDataSuccess({
          type: constants["balance"],
          value: parseInt(balance._hex.slice(2), 16)
        })
      );
      break;
  }
}
