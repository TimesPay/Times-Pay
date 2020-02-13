import * as SecureStore from 'expo-secure-store';

import { network } from '../config';
import { ethers } from 'ethers';

import { generateKey, encrypt, decrypt, sha256 } from '../utils/cryptograohy';

export const getEncryptedWallet = async () => {
  console.log("getEncryptedWallet")
  return await SecureStore.getItemAsync("wallet")
}

export const setEncryptedWallet = (payload:any) => {
  return SecureStore.setItemAsync("wallet", payload.wallet);
}
export const getKey = () => {
  return SecureStore.getItemAsync("key");
}

export const setKey = (payload:any) => {
  return SecureStore.setItemAsync("key", payload.key);
}
export const setPassPharse = async (payload:any) => {
  let pw = await sha256(payload.passPharse)
  return SecureStore.setItemAsync("passPharse", pw);
}
export const getPassPharse = (payload:any) => {
  return SecureStore.getItemAsync("passPharse");
}
export const hash = (payload:any) => {
  return sha256(payload)
}
export const getDecryptedWallet = (payload:any) => {
  const { encryptedWallet, passwd } = payload;
  return decrypt(encryptedWallet, passwd);

}
export const generateKeyByPassPharse = (payload:any) => {
  return generateKey(payload.passPharse, 'salt', 65536, 256)
}
export const encryptWallet = (payload:any) => {
    const { wallet, key } = payload;
    return encrypt(wallet, key);
}
export const getWalletByMnemonic = (payload:any) => {
  return ethers.Wallet.fromMnemonic(payload.mnemonic)
}
export const connectWalletToProvider = (payload:any) => {
  const { wallet } = payload;
  let provider = new ethers.getDefaultProvider(network);
  return wallet.connect(provider)
}
export const sendTransaction = (payload:any) => {
  const { wallet, destAddress, amount } = payload;
  return wallet.sendTransaction({
    to: destAddress,
    value: ethers.utils.parseEther(amount)
  })
}
export const getGasBalance = (payload:any) => {
  const { wallet } = payload;
  return wallet.getBalance();
}
