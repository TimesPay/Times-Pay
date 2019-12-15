import * from actionTypes;
export const fetchStart = () => {
  return {
    type: FETCH_START
  }
}
export const fetchSuccess = (payload) => {
  return {
    type: FETCH_SUCCESS,
    payload: {
      address: payload.address
    }
  }
}
export const fetchFailed = (payload) => {
  return {
    type: FETCH_FAILED,
    payload: {
      errCode: payload.errCode
    }
  }
}
