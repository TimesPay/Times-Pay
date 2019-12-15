import * as ACTION_TYPES from './actionTypes';
export const fetchStart = () => {
  return {
    type: ACTION_TYPES.FETCH_START
  }
}
export const fetchSuccess = (payload) => {
  return {
    type: ACTION_TYPES.FETCH_SUCCESS,
    payload: {
      wallet: payload.wallet
    }
  }
}
export const fetchFailed = (payload) => {
  return {
    type: ACTION_TYPES.FETCH_FAILED,
    payload: {
      errCode: payload.errCode
    }
  }
}
