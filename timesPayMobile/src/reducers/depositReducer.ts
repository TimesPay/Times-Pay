import commonStateType from '../utils/commonStateType';
import {
  FETCH_START_DEPOSIT,
  FETCH_SUCCESS_DEPOSIT,
  FETCH_FAILED_DEPOSIT,
  SET_ADDRESS_DEPOSIT
} from '../actions/actionTypes';

export interface DepositStateType extends commonStateType {
  address: string;
}

const initState: DepositStateType = {
  loading: false,
  address: "",
  status: null,
  errMsg: null | undefined,
}

export default function depositReducer(state = initState, action) {
  console.log("depositReducer", action);
  switch (action.type) {
    case FETCH_START_DEPOSIT:
      return {
        ...state,
        loading: true,
        address: state.address,
        status: null,
      };
      break;
    case SET_ADDRESS_DEPOSIT:
      return {
        ...state,
        loading: false,
        address: action.payload.address,
        status: "success"
      };
      break;
    case FETCH_FAILED_DEPOSIT:
      return {
        ...state,
        loading: false,
        address: state.address,
        status: "failed",
        errCode: action.payload.errCode
      };
      break;
    default:
      return state;
  }
}
