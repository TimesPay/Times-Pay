import {
  FETCH_START_PAY,
  FETCH_SUCCESS_PAY,
  FETCH_FAILED_PAY
} from '../actions/actionTypes';
import { commonStateType } from '../utils/commonStateType';

export interface PayStateType extends commonStateType {
  destAddress: string
}
const initState: PayStateType = {
  loading: false,
  status: null,
  destAddress: "",
  errCode: null,
}

export default function payReducer(state = initState, action) {
  switch (action.type) {
    case FETCH_START_PAY:
      return {
        ...state,
        loading: true,
        status: state.status,
        destAddress: state.destAddress,
        errCode: state.errCode
      }
      break;
    case FETCH_SUCCESS_PAY:
      return {
        ...state,
        loading: false,
        status: "success",
        destAddress: action.payload.destAddress,
        errCode: state.errCode
      }
      break;
    case FETCH_FAILED_PAY:
      return {
        ...state,
        loading: false,
        status: "failed",
        destAddress: state.destAddress,
        errCode: action.payload.errCode
      }
      break;
    default:
      return state;
  }
}
