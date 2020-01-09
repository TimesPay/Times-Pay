import {
  LOAD_WALLET_INIT,
  FETCH_START_INIT,
  FETCH_SUCCESS_INIT,
  FETCH_FAILED_INIT,
  CREATE_WALLET_INIT
} from '../actions/actionTypes';

export const fetchStart = () => {
  return {
    type: FETCH_START_INIT
  }
}
export const fetchSuccess = (payload) => {
  return {
    type: FETCH_SUCCESS_INIT,
    payload: {
      wallet: payload.wallet
    }
  }
}
export const fetchFailed = (payload) => {
  console.log("fetchFailed", payload);
  return {
    type: FETCH_FAILED_INIT,
    payload: {
      errCode: payload.errCode
    }
  }
}

export const loadWallet = (payload) => {
  return {
    type: LOAD_WALLET_INIT,
    payload: {
      passPharse: payload.passPharse
    }
  }
}

export const createWallet = (payload) => {
  console.log("createWallet", payload);
  return {
    type: CREATE_WALLET_INIT,
    payload: {
      passPharse: payload.passPharse,
      wallet: payload.wallet
    }
  }
}
