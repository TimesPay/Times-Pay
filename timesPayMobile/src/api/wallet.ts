import * as SecureStore from 'expo-secure-store';

import AsyncStorage from '@react-native-community/async-storage';
import { ethers } from 'ethers';

export const getEncryptedWallet = () => {
  console.log("getEncryptedWallet");
  return SecureStore.getItemAsync("wallet");
}

export const getPassPharse = () => {
  // let seiHaakGeng = AsyncStorage.setItemAsync("seihaakgeng","seihaakgeng").then(res=>{
  //   console.log("set seiHaakGeng");
  //   AsyncStorage.getItemAsync("seihaakgeng").then(seiHaakGeng=>{
  //     console.log("get seiHaakGeng", seiHaakGeng);
  //   })
  // })
  // console.log("passPharse", seiHaakGeng);
  return SecureStore.getItemAsync("passPharse");
}

export const getDecryptedWallet = (payload) => {
  const { encryptedWallet, passwd } = payload;
  console.log("getDecryptedWallet", encryptedWallet, passwd);
  return new ethers.Wallet.fromEncryptedJson(encryptedWallet, passwd);
}

export const connectWalletToProvider = (payload) => {
  const { wallet } = payload;
  let provider = new ethers.getDefaultProvider("ropsten");
  return wallet.connect(provider)
}
export const sendTransaction = (payload) => {
  const { wallet, destAddress, amount } = payload;
  return wallet.sendTransaction({
    to: destAddress,
    value: ethers.utils.parseEther(amount)
  })
}
