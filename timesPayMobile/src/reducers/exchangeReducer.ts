import { ethers } from 'ethers';
import { commonStateType } from '@/src/utils/commonStateType';
import {
  FETCH_START_EXCHANGE,
  FETCH_SUCCESS_EXCHANGE,
  FETCH_FAILED_EXCHANGE,
  LOAD_CONTRACT_SUCCESS_EXCHANGE,
  GET_DATA_SUCCESS_EXCHANGE
} from '../actions/actionTypes';
import { TimesCoinType } from 'src/utils/timesCoinContract';
export interface DataType {
  balance: number,
  gasBalance: number,
  USDToHKD: number
}
export interface ExchangeStateType extends commonStateType {
  ratio: number;
  contract: TimesCoinType | null;
  data: DataType
}
const initState: ExchangeStateType = {
  loading: false,
  status: null,
  ratio: 0,
  errMsg: null,
  contract: null,
  data: {
    balance: 0,
    gasBalance: 0,
    USDToHKD: 7.85
  },
}

export default function exchangeReducer(state = initState, action) {
  switch (action.type) {
    case FETCH_START_EXCHANGE:
      return {
        ...state,
        loading: true,
        status: null,
        ratio: state.ratio,
        contract: state.contract,
        errCode: "",
        data: state.data
      };
      break;
    case FETCH_SUCCESS_EXCHANGE:
      return {
        ...state,
        loading: false,
        ratio: action.payload.ratio,
        status: "success",
        contract: state.contract,
        errCode: "",
        data: state.data
      };
      break;
    case FETCH_FAILED_EXCHANGE:
      return {
        ...state,
        loading: false,
        ratio: state.ratio,
        status: "failed",
        errCode: action.payload.errCode,
        contract: state.contract,
        data: state.data
      };
      break;
    case LOAD_CONTRACT_SUCCESS_EXCHANGE:
      return {
        ...state,
        loading: false,
        ratio: state.ratio,
        status: "success",
        errCode: "",
        contract: action.payload.contract,
        data: state.data
      }
    case GET_DATA_SUCCESS_EXCHANGE:
      let newData = Object.assign({}, state.data);
      newData[action.payload.type] = action.payload.value
      return {
        ...state,
        loading: false,
        ratio: state.ratio,
        status: "success",
        errCode: "",
        contract: state.contract,
        data: newData
      }
    default:
      return state;
  }
}
