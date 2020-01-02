import {
  PAY_START,
  PAY_SUCCESS,
  PAY_FAILED,
  PAY_START_REQUEST,
  PAY_ESTIMATE,
  PAY_ESTIMATE_SUCCESS
} from '../actions/actionTypes';

export const payStartRequest = (payload) => {
  console.log("payAction payStartRequest", payload)
  return {
    type: PAY_START_REQUEST,
    payload: {
      destAddress: payload.destAddress,
      contract: payload.contract,
      amount: payload.amount
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

export const payEstimate = (payload) => {
  return {
    type: PAY_ESTIMATE,
    payload: {
      destAddress: payload.destAddress,
      contract: payload.contract,
      amount: payload.amount
    }
  }
}
export const payEstimateSuccess = (payload) => {
  return {
    type: PAY_ESTIMATE_SUCCESS,
    payload: {
      estimatedCost: payload.estimatedCost
    }
  }
}
