import {
  LOAD_WALLET_INIT,
  FETCH_START_INIT,
  FETCH_SUCCESS_INIT,
  FETCH_FAILED_INIT,
  RESET_STORE
} from '../actions/actionTypes';
import { commonStateType } from '../utils/commonStateType';

export interface InitStateType extends commonStateType {
  wallet: string | null,
}
const initState: InitStateType = {
  loading: false,
  status: null,
  wallet: null,
  errCode: null,
}

export default function initReducer(state = initState, action) {
  console.log("init reducer", action);
  switch (action.type) {
    case FETCH_START_INIT:
      return {
        ...state,
        loading: true,
        status: state.status,
        wallet: state.wallet,
        errCode: null
      }
      break;
    case FETCH_SUCCESS_INIT:
      return {
        ...state,
        loading: false,
        status: "success",
        wallet: action.payload.wallet,
        errCode: null
      }
      break;
    case FETCH_FAILED_INIT:
      return {
        ...state,
        loading: false,
        status: "failed",
        wallet: state.wallet,
        errCode: action.payload.errCode
      }
      break;
    case RESET_STORE:
      return {
        ...initState,
        wallet: state.wallet,
      }
    default:
      return state;
  }
}
