import {
  FETCH_START_DEPOSIT,
  FETCH_SUCCESS_DEPOSIT,
  FETCH_FAILED_DEPOSIT
} from '../actions/actionTypes';

export const fetchStart = () => {
  return {
    type: FETCH_START_DEPOSIT
  }
}
export const fetchSuccess = (payload) => {
  return {
    type: FETCH_SUCCESS_DEPOSIT,
    payload: {
      address: payload.address
    }
  }
}
export const fetchFailed = (payload) => {
  console.log("fetchFailed", payload);
  return {
    type: FETCH_FAILED_DEPOSIT,
    payload: {
      errCode: payload.errCode
    }
  }
}
