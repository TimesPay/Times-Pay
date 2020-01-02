import {
  NativeModules,
  Platform
} from 'react-native';
var AES = NativeModules.Aes;
export const generateKey = (pw, salt, cost, length) => {
  return AES.pbkdf2(pw, salt, cost, length)
};
export const encrypt = (text, key) => {
  console.log("encrypt", text, key);
  return AES.randomKey(16).then(iv => {
    console.log("randomKey", iv);
    return AES.encrypt(text, key, iv).then(cipher => ({
      cipher,
      iv,
    }))
  })
}
export const decrypt = (encryptedData, key) => AES.decrypt(encryptedData.cipher, key, encryptedData.iv)
