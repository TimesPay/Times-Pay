import { ethers, Wallet } from 'ethers'
export interface InitStateType extends commonStateType {
  wallet: string | null,
}
const initState: InitStateType = {
  loading: false,
  status: null,
  wallet: null
}

export default function initReducer(state = initState, action) {
  switch (action.type) {
    case "fetchStart":
      return {
        ...state,
        loading: true,
        status: null,
        wallet: null
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
        wallet: null
      }
      break;
    default:
      return initState;
  }
}
