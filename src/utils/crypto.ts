import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_ENV_SECRET_KEY;

export const encryptData = (data: string) => {
  if (!secretKey) return null;

  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decryptData = (encryptedData: string) => {
  if (!secretKey) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);

    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
};
