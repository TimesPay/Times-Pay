import { call, put, takeEvery } from "redux-saga/effects";

import {
  LOAD_WALLET_INIT
} from '../actions/actionTypes';

import {
  fetchStart,
  fetchSuccess,
  fetchFailed
} from '../actions/initAction';

import { getEncryptedWallet, getPassPharse, getDecryptedWallet } from '../api/wallet';
import errCode from '../utils/errCode';

export function* watchLoadWallet() {
  yield takeEvery(LOAD_WALLET_INIT, loadWalletFlow);
}
function* loadWalletFlow() {
  try {
    yield put(fetchStart());
    console.log("load wallet")
    let encryptedWallet = yield call(getEncryptedWallet);
    let passwd = yield call(getPassPharse);
    console.log("passwd", passwd);
    console.log("encryptedWallet", encryptedWallet)
    if (encryptedWallet) {
      if (passwd) {
        let newWallet = yield call(getDecryptedWallet, {
          encryptedWallet: JSON.parse(encryptedWallet),
          passwd: passwd
        });
        console.log("newWallet", newWallet);
        yield put(
          fetchSuccess({
            wallet: newWallet
          })
        );
      } else {
        yield put(
          fetchFailed({
            errCode: errCode["loadWallet.missingPW"]
          })
        );
      }
    } else {
      console.log("init saga", errCode);
      yield put(
        fetchFailed({
          errCode: errCode["loadWallet.noWallet"]
        })
      )
    }
  } catch (error) {
    console.log("init saga", error);
    yield put(
      fetchFailed({
        errCode: errCode["loadWallet.noWallet"]
      })
    )
  }
}
