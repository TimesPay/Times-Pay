export interface InitStateType extends commonStateType {
  wallet: string | null,
}
const initState: InitStateType = {
  loading: false,
  status: null,
  wallet: null,
  errMsg: null | undefined,
}

export default function initReducer(state = initState, action) {
  switch (action.type) {
    case "fetchStart":
      return {
        ...state,
        loading: true,
        status: state.status,
        wallet: state.wallet
      }
      break;
    case "fetchSuccess":
      return {
        ...state,
        loading: false,
        status: "success",
        wallet: action.payload.wallet
      }
      break;
    case "fetchFailed":
      return {
        ...state,
        loading: false,
        status: "failed",
        wallet: state.wallet,
        errCode: action.payload.errCode
      }
      break;
    default:
      return {
        ...initState
      };
  }
}
