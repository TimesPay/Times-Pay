import * as SecureStore from 'expo-secure-store';

import { network } from '../config';
import { ethers } from 'ethers';

import { generateKey, encrypt, decrypt } from '../utils/cryptograohy';

export const getEncryptedWallet = () => {
  console.log("getEncryptedWallet");
  return SecureStore.getItemAsync("wallet");
}

export const setEncryptedWallet = (payload) => {
  return SecureStore.setItemAsync("wallet", payload.wallet);
}
export const getPassPharse = () => {
  return SecureStore.getItemAsync("key");
}

export const setPassPharse = (payload) => {
  return SecureStore.setItemAsync("key", payload.key);
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
    //AES allows 128, 192 and 256 bit of key length. In other words 16, 24 or 32 byte.
    //We will store the
    // generateKey(passPharse, 'salt', 65536, 256).then(key=>{
    //   encrypt(wallet, key).then(cipherText=>{
    //     console.log("cipherText",cipherText);
    //   })
    // });
    // return wallet.encrypt(passPharse)
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
