import {
  PAY_START,
  PAY_SUCCESS,
  PAY_FAILED,
} from '../actions/actionTypes';
import { commonStateType } from '../utils/commonStateType';

export interface PayStateType extends commonStateType {
  destAddress: string,
  info: string,
}
const initState: PayStateType = {
  loading: false,
  status: null,
  destAddress: "",
  errCode: null,
  info: ""
}

export default function payReducer(state = initState, action) {
  console.log("payReducer", action);
  switch (action.type) {
    case PAY_START:
      return {
        ...state,
        loading: true,
        status: state.status,
        destAddress: action.payload.destAddress,
        errCode: state.errCode,
        info: state.info
      }
      break;
    case PAY_SUCCESS:
      return {
        ...state,
        loading: false,
        status: "success",
        destAddress: "",
        errCode: state.errCode,
        info: action.payload.info
      }
      break;
    case PAY_FAILED:
      return {
        ...state,
        loading: false,
        status: "failed",
        destAddress: state.destAddress,
        errCode: action.payload.errCode,
        info: state.info
      }
      break;
    default:
      return state;
  }
}
