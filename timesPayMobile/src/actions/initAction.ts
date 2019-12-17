import {
  LOAD_WALLET_INIT,
  FETCH_START_INIT,
  FETCH_SUCCESS_INIT,
  FETCH_FAILED_INIT
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
