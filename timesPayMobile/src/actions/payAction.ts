import {
  PAY_START,
  PAY_SUCCESS,
  PAY_FAILED,
  PAY_START_REQUEST
} from '../actions/actionTypes';

export const payStartRequest = (payload) => {
  console.log("payAction payStartRequest", payload)
  return {
    type: PAY_START_REQUEST,
    payload: {
      destAddress: payload.destAddress,
      wallet: payload.wallet
    }
  }
}
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
