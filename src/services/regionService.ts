import axios from 'axios';
import { encryptData, decryptData } from '../utils/crypto';

export async function getCountryCode() {
  const cachedCountryCode = sessionStorage.getItem('country_code');

  if (cachedCountryCode) {
    const countryCode = decryptData(cachedCountryCode);

    if (countryCode) {
      return countryCode;
    }
  }

  try {
    const response = await axios.get<{ country: string }>(
      'https://ipinfo.io/json',
    );
    const countryCode = response.data.country;
    const encrypted = encryptData(countryCode);

    if (!countryCode || !encrypted) return null;

    sessionStorage.setItem('country_code', encrypted);

    return countryCode;
  } catch {
    return null;
  }
}
