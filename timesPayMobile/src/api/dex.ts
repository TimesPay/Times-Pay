import { ethers } from "ethers";
import { DEX } from "../utils/dex";
import { contractAddr } from "../config";


export const getDEXInterface = (payload: { wallet: ethers.Wallet }) => {
  const { wallet } = payload;
  return new DEX(wallet);
}

export const swap = (payload: { DEXInterface: DEX, amount: number }) => {
  const { DEXInterface, amount } = payload;
  return DEXInterface.swap(amount);
}
