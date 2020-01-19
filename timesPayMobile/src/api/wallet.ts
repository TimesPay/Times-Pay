import * as SecureStore from 'expo-secure-store';

import { network } from '../config';
import { ethers } from 'ethers';

import { generateKey, encrypt, decrypt, sha256 } from '../utils/cryptograohy';

export const getEncryptedWallet = () => {
  console.log("getEncryptedWallet");
  return SecureStore.getItemAsync("wallet");
}

export const setEncryptedWallet = (payload) => {
  return SecureStore.setItemAsync("wallet", payload.wallet);
}
export const getKey = () => {
  return SecureStore.getItemAsync("key");
}

export const setKey = (payload) => {
  return SecureStore.setItemAsync("key", payload.key);
}
export const setPassPharse = async (payload) => {
  let pw = await sha256(payload.passPharse)
  console.log("setPassPharse", pw)
  return SecureStore.setItemAsync("passPharse", pw);
}
export const getPassPharse = (payload) => {
  return SecureStore.getItemAsync("passPharse");
}
export const hash = (payload) => {
  return sha256(payload)
}
export const getDecryptedWallet = (payload) => {
  const { encryptedWallet, passwd } = payload;
  return decrypt(encryptedWallet, passwd);
  // return new ethers.Wallet.fromEncryptedJson(encryptedWallet, passwd);

}
export const generateKeyByPassPharse = (payload) => {
  console.log("generateKeyByPassPharse", payload);
  return generateKey(payload.passPharse, 'salt', 65536, 256)
}
export const encryptWallet = (payload) => {
    const { wallet, key } = payload;
    return encrypt(wallet, key);
}
export const getWalletByMnemonic = (payload) => {
  return ethers.Wallet.fromMnemonic(payload.mnemonic)
}
export const connectWalletToProvider = (payload) => {
  const { wallet } = payload;
  let provider = new ethers.getDefaultProvider(network);
  return wallet.connect(provider)
}
export const sendTransaction = (payload) => {
  const { wallet, destAddress, amount } = payload;
  return wallet.sendTransaction({
    to: destAddress,
    value: ethers.utils.parseEther(amount)
  })
}
export const getBalance = (payload) => {
  const { wallet } = payload;
  return wallet.getBalance();
}
