import * as SecureStore from 'expo-secure-store';

export const getEncryptedWallet = () => {
  return SecureStore.getItemAsync("wallet");
}

export const getPassPharse = () => {
  return SecureStore.getItemAsync("passPharse")
}

export const getDecryptedWallet = (payload) => {
  const { encryptedWallet, passwd } = payload;
  return new ethers.Wallet.fromEncryptedJson(encryptedWallet, passwd);
}
