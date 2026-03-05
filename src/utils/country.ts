let regionNameList = new Intl.DisplayNames(['en'], { type: 'region' });

export function getCountryName(countryCode: string) {
  return regionNameList.of(countryCode.toUpperCase());
}

export function getCountryIcon(countryCode: string) {
  return `https://hatscripts.github.io/circle-flags/flags/${countryCode.toLowerCase()}.svg`;
}
