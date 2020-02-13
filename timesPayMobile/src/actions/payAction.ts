import {
  PAY_START,
  PAY_SUCCESS,
  PAY_FAILED,
  PAY_START_REQUEST,
  PAY_ESTIMATE,
  PAY_ESTIMATE_SUCCESS
} from '../actions/actionTypes';

export const payStartRequest = (payload:any) => {
  console.log("payAction payStartRequest", payload)
  return {
    type: PAY_START_REQUEST,
    payload: {
      destAddress: payload.destAddress,
      contract: payload.contract,
      amount: payload.amount,
      wallet: payload.wallet
    }
  }
}
export const payStart = (payload:any) => {
  console.log("payAction start", payload)
  return {
    type: PAY_START,
    payload: {
      destAddress: payload.destAddress,
      info: payload.info
    }
  }
}

export const paySuccess = (payload:any) => {
  return {
    type: PAY_SUCCESS,
    payload: {
      info: payload.info
    }
  }
}

export const payFailed = (payload:any) => {
  return {
    type: PAY_FAILED,
    payload: {
      errCode: payload.errCode
    }
  }
}

export const payEstimate = (payload:any) => {
  return {
    type: PAY_ESTIMATE,
    payload: {
      destAddress: payload.destAddress,
      contract: payload.contract,
      amount: payload.amount,
      wallet: payload.wallet
    }
  }
}
export const payEstimateSuccess = (payload:any) => {
  return {
    type: PAY_ESTIMATE_SUCCESS,
    payload: {
      estimatedCost: payload.estimatedCost,
      status: payload.status || "success"
    }
  }
}
