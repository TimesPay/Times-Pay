import {
  FETCH_START_EXCHANGE,
  FETCH_SUCCESS_EXCHANGE,
  FETCH_FAILED_EXCHANGE
} from '../actions/actionTypes';

export const fetchStart = () => {
  return {
    type: FETCH_START_EXCHANGE
  }
}
export const fetchSuccess = (payload) => {
  return {
    type: FETCH_SUCCESS_EXCHANGE,
    payload: {
      address: payload.address
    }
  }
}
export const fetchFailed = (payload) => {
    console.log("fetchFailed", payload);
  return {
    type: FETCH_FAILED_EXCHANGE,
    payload: {
      errCode: payload.errCode
    }
  }
}
