import {
  FETCH_START_EXCHANGE,
  FETCH_SUCCESS_EXCHANGE,
  FETCH_FAILED_EXCHANGE,
  LOAD_CONTRACT_EXCHANGE,
  LOAD_CONTRACT_SUCCESS_EXCHANGE,
  GET_DATA_EXCHANGE,
  GET_DATA_SUCCESS_EXCHANGE
} from '../actions/actionTypes';
import constants from '../utils/constants';

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

export const loadContract = (payload) => {
  console.log("loadContract", payload);
  return {
    type: LOAD_CONTRACT_EXCHANGE,
    payload: {
      wallet: payload.wallet
    }
  }
}

export const loadContractSuccess = (payload) => {
  console.log("loadContractSuccess", payload);
  return {
    type: LOAD_CONTRACT_SUCCESS_EXCHANGE,
    payload: {
      contract: payload.contract
    }
  }
}

export const getExchangeData = (payload) => {
  return {
    type: GET_DATA_EXCHANGE,
    payload: {
      contract: payload.contract,
      type: payload.type,
      payload: payload.payload
    }
  }
}

export const getExchangeDataSuccess = (payload) => {
  return {
    type: GET_DATA_SUCCESS_EXCHANGE,
    payload: {
      type: payload.type,
      value: payload.value
    }
  }
}
