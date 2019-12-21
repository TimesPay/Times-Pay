import {
  PAY_START,
  PAY_SUCCESS,
  PAY_FAILED,
} from '../actions/actionTypes';

export const payStart = (payload) => {
  console.log("payAction start", payload)
  return {
    type: PAY_START,
    payload: {
      destAddress: payload.destAddress
    }
  }
}

export const paySuccess = (payload) => {
  return {
    type: PAY_SUCCESS,
    payload: {
      info: payload.info
    }
  }
}

export const payFailed = (payload) => {
  return {
    type: PAY_FAILED,
    payload: {
      errCode: payload.errCode
    }
  }
}
