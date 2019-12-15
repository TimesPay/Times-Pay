import AsyncStorage from '@react-native-community/async-storage';
import commonStateType from '@/src/utils/commonStateType';

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
  switch (action.type) {
    case "fetchStart":
      return {
        ...state,
        loading: true,
        address: state.address,
        status: null,
      };
      break;
    case "fetchSuccess":
      return {
        ...state,
        loading: false,
        address: action.payload.address,
        status: "success"
      };
      break;
    case "fetchFailed":
      return {
        ...state,
        loading: false,
        address: state.address,
        status: "failed",
        errCode: action.payload.errCode
      };
      break;
    default:
      return {
        ...initState
      };
  }
}
