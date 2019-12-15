import { commonStateType } from '@/src/utils/commonStateType';
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
    case "fetchStart":
      return {
        ...state,
        loading: true,
        status: null,
        ratio: state.ratio
      }
      break;
    case "fetchSuccess":
      return {
        ...state,
        loading: false,
        ratio: action.payload.ratio,
        status: "success"
      }
      break;
    case "fetchSuccess":
      return {
        ...state,
        loading: false,
        ratio: state.ratio,
        status: "failed",
        errCode: action.payload.errCode
      }
      break;
    default:
      return {
        ...initState
      };
  }
}
