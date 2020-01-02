import { call, put, takeEvery } from "redux-saga/effects";

import {
  LOAD_WALLET_INIT,
  CREATE_WALLET_INIT
} from '../actions/actionTypes';

import {
  fetchStart,
  fetchSuccess,
  fetchFailed,
  createWallet,
} from '../actions/initAction';

import {
  getEncryptedWallet,
  getPassPharse,
  getDecryptedWallet,
  connectWalletToProvider,
  setPassPharse,
  setEncryptedWallet,
  encryptWallet,
  generateKeyByPassPharse,
  getWalletByMnemonic
} from '../api/wallet';
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
        let mnemonic = yield call(getDecryptedWallet, {
          encryptedWallet: JSON.parse(encryptedWallet),
          passwd: passwd
        });
        let newWallet = yield call(getWalletByMnemonic,{
          mnemonic: mnemonic
        })
        newWallet = yield call(connectWalletToProvider, {
          wallet: newWallet
        })
        console.log("newWallet", newWallet);
        yield put(
          fetchSuccess({
            wallet: newWallet
          })
        );
      } else {
        yield put(
          fetchFailed({
            errCode: errCode["loadWallet.noWallet"]
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

export function* watchCreateWallet() {
  yield takeEvery(CREATE_WALLET_INIT, createWalletFlow);
}

function* createWalletFlow(action) {
  try {
    yield put(fetchStart());
    const { passPharse, wallet } = action.payload;

    let key = yield call(generateKeyByPassPharse,{
      passPharse:passPharse
    })
    let encryptedWallet = yield call(encryptWallet,
      {
        wallet: wallet.mnemonic,
        key: key
      });
      console.log("createWalletFlow, key", action, key);
    let passPharseStatus = yield call(setPassPharse,
      {
        key: key
      });
      console.log("createWalletFlow, save PW", action, key, passPharse, encryptedWallet);
    let walletStatus = yield call(setEncryptedWallet,
      {
        wallet: JSON.stringify(encryptedWallet)
      });
    console.log("createWalletFlow", key, wallet, encryptedWallet);
    let newWallet = yield call(connectWalletToProvider, {
      wallet: wallet
    });
    yield put(
      fetchSuccess({
        wallet: newWallet
      })
    );
  } catch (error) {
    console.log("init saga", error);
    yield put(
      fetchFailed({
        errCode: errCode["loadWallet.noWallet"]
      })
    )
  }
}
