import * as SecureStore from 'expo-secure-store';

import { network } from '../config';
import AsyncStorage from '@react-native-community/async-storage';
import { ethers } from 'ethers';

export const getEncryptedWallet = () => {
  console.log("getEncryptedWallet");
  return SecureStore.getItemAsync("wallet");
}

export const setEncryptedWallet = (payload) => {
  return SecureStore.setItemAsync("wallet", payload.wallet);
}
export const getPassPharse = () => {
  return SecureStore.getItemAsync("passPharse");
}

export const setPassPharse = (payload) => {
  return SecureStore.setItemAsync("passPharse", payload.passPharse);
}
export const getDecryptedWallet = (payload) => {
  const { encryptedWallet, passwd } = payload;
  return new ethers.Wallet.fromEncryptedJson(encryptedWallet, passwd);
}

export const encryptWallet = (payload) => {
    const { wallet, passPharse } = payload;
    return wallet.encrypt(passPharse)
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
