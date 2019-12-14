import AsyncStorage from '@react-native-community/async-storage';
import commonStateType from '@/src/utils/commonStateType';

export interface DepositStateType extends commonStateType {
  address: string;
}

const initState: DepositStateType = {
  loading: false,
  address: "",
  status: null,
}

export default function depositReducer(state = initState, action) {
  switch (action.type) {
    case "fetchStart":
      return {
        ...state,
        loading: true,
        address: "",
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
        address: "",
        status: "failed"
      };
      break;
    default:
      return {
        ...initState
      };
  }
}
