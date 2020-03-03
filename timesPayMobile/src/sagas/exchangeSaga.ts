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
  getBalance,
  getApproval,
  getAllowance
} from '../api/contract';
// import {
//   getBalance
// } from '../api/wallet';
import errCode from '../utils/errCode';
import constants from '../utils/constants';
import { getGasBalance } from '../api/wallet';
import { getDEXInterface, swap } from '../api/dex';
import { ethers, utils } from "ethers";
import { fetchCurrencyData } from "../api/currency";

export function* watchLoadContract() {
  yield takeEvery(LOAD_CONTRACT_EXCHANGE, loadContractFlow);
}

export function* watchContractIntereaction() {
  yield takeEvery(GET_DATA_EXCHANGE, getExchangeDataFlow)
}
function* loadContractFlow(action:any) {
  try {
    yield put(fetchStart());
    let newContract = yield call(getContractInterface, action.payload);
    if (newContract != null) {
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

function* getExchangeDataFlow(action:any) {
  yield put(fetchStart());
  switch (action.payload.type) {
    case constants["balance"]:
      let balance = yield call(getBalance, {
        contract: action.payload.contract,
      });
      let gasBalance = yield call(getGasBalance, {
        wallet: action.payload.wallet
      });
      let USDToHKD = yield call(fetchCurrencyData,{
        from: "USD",
        to: "HKD"
      });
      USDToHKD = USDToHKD["rates"]["HKD"];
      if(!gasBalance.gt(utils.bigNumberify("1000000000000000"))) {
        try{
          let allowance = yield call(getAllowance,{
            contract: action.payload.contract
          })
          console.log("allowance", allowance);
          if (! allowance.gt(utils.bigNumberify("100000000000000000000"))) {
            let approved = yield call(getApproval,{
              contract: action.payload.contract,
              amount: utils.bigNumberify("100000000000000000000")
            });
            console.log("approved", approved);
          }
          let dex = yield call(getDEXInterface,{
            wallet: action.payload.wallet
          });
          let swapRes = yield call(swap,{
            DEXInterface: dex,
            amount: 1000000
          });
        } catch (e) {
          console.log("dex error", e);
        }
      }
      yield put(
        getExchangeDataSuccess({
          type: constants["balance"],
          value: parseInt(balance._hex.slice(2), 16)
        })
      );
      yield put(
        getExchangeDataSuccess({
          type: constants["gasBalance"],
          value: parseInt(gasBalance._hex.slice(2), 16)
        })
      );
      yield put(
        getExchangeDataSuccess({
          type: constants["USDToHKD"],
          value: USDToHKD
        })
      );
      break;
  }
}
