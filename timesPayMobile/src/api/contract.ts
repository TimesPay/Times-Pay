import { TimesCoin } from '../utils/timesCoinContract';

export const getContractInterface = (payload) => {
  let timesCoin = new TimesCoin(payload.wallet);
  console.log("getContractInterface", payload, timesCoin);
  return timesCoin
}
export const getBalance = (payload) => {
  return payload.contract.getBalance();
}
export const transfer = (payload) => {
  return payload.contract.transfer(payload.destAddress, payload.amount);
}
export const estimateTransfer = (payload) => {
  return payload.contract.payEstimate(payload.destAddress, payload.amount);
}
