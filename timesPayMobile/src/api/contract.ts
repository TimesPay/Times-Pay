import { TimesCoin } from '../utils/timesCoinContract';
import { ethers } from 'ethers';

export const getContractInterface = (payload: { wallet: ethers.Wallet }) => {
  let timesCoin = new TimesCoin(payload.wallet);
  return timesCoin
}
export const getBalance = (payload: { contract: TimesCoin }) => {
  return payload.contract.getBalance();
}
export const transfer = (payload: { contract: TimesCoin, destAddress: string, amount: number }) => {
  return payload.contract.transfer(payload.destAddress, payload.amount);
}
export const estimateTransfer = (payload: { contract: TimesCoin, destAddress: string, amount: number }) => {
  return payload.contract.payEstimate(payload.destAddress, payload.amount);
}

export const getApproval = (payload: { contract: TimesCoin, amount: number | ethers.utils.BigNumber }) => {
  const { contract, amount } = payload;
  return contract.approve(amount);
}
export const getAllowance = (payload: { contract: TimesCoin }) => {
  const { contract } = payload;
  return contract.allowance();
}
