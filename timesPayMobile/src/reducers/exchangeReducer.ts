import { commonStateType } from '@/src/utils/commonStateType';
import {
  FETCH_START_EXCHANGE,
  FETCH_SUCCESS_EXCHANGE,
  FETCH_FAILED_EXCHANGE
} from '../actions/actionTypes';
export interface ExchangeStateType extends commonStateType {
  ratio: number;
}
const initState: ExchangeStateType = {
  loading: false,
  status: null,
  ratio: 0.3,
  errMsg: null | undefined
}

export default function exchangeReducer(state = initState, action) {
  switch (action.type) {
    case FETCH_START_EXCHANGE:
      return {
        ...state,
        loading: true,
        status: null,
        ratio: state.ratio
      };
      break;
    case FETCH_SUCCESS_EXCHANGE:
      return {
        ...state,
        loading: false,
        ratio: action.payload.ratio,
        status: "success"
      };
      break;
    case FETCH_FAILED_EXCHANGE:
      return {
        ...state,
        loading: false,
        ratio: state.ratio,
        status: "failed",
        errCode: action.payload.errCode
      };
      break;
    default:
      return state;
  }
}
