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
  console.log("transfer", payload.contract);
  return payload.contract.transfer(payload.destAddress, payload.amount);
}
