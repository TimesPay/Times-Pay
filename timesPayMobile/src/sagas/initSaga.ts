import { call, put, takeEvery } from "redux-saga/effects";
import * as ACTION_TYPES from '../actions/actionTypes';
import { ethers } from 'ethers';

import { fetchStart, fetchSuccess, fetchFailed } from '../actions/initAction';
import { getEncryptedWallet, getPassPharse, getDecryptedWallet } from '../api/wallet';

export const LOAD_WALLET = "init/loadWallet";

export function* watchInit() {
  // yield takeEvery(ACTION_TYPES.FETCH_START, fetchStart)
  yield takeEvery(LOAD_WALLET, loadWallet);
}
export function* loadWallet() {
  try {
    yield put({ type: ACTION_TYPES.FETCH_START });
    let encryptedWallet = yield call(getEncryptedWallet);
    console.log("wallet res", encryptedWallet);
    if (encryptedWallet) {
      let passwd = yield call(getPassPharse);
      console.log("passPharse", passwd)
      if (passwd) {
        let newWallet = yield call(getEncryptedWallet, {
          encryptedWallet: encryptedWallet,
          passwd: passwd
        });
        console.log(newWallet);
        yield put(
          fetchSuccess({
            wallet: newWallet
          })
        );
      } else {
        yield put(
          fetchFailed({
            errCode: "loadWallet.missingPW"
          })
        );
      }
    } else {
      yield put(
        fetchFailed({
          errCode: "loadWallet.noWallet"
        })
      )
    }
  } catch (error) {
    yield put(
      fetchFailed({
        errCode: "loadWallet.noWallet"
      })
    )
  }
}
