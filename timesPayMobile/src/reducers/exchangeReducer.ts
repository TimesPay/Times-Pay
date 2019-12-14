import { commonStateType } from '@/src/utils/commonStateType';
export interface ExchangeStateType extends commonStateType {
  ratio: number;
}
const initState: ExchangeStateType = {
  loading: false,
  ratio: 0.3
}

export default function exchangeReducer(state=initState, action) {
  switch(action.type){
    case "fetchStart":
    return {
      ...state,
      loading: true
    }
    break;
    case "fetchSuccess":
    return {
      ...state,
      loading: false,
      ratio: 1
    }
    break;
    default:
    return initState;
  }
}
