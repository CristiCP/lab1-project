import countryData from "./country.json";

interface Prop {
  country: string;
}

interface CountryCodeMap {
  [key: string]: string;
}

function CountryImage({ country }: Prop) {
  const countryMap: CountryCodeMap = countryData[0];
  var notation = "";

  if (country in countryData[0]) {
    notation = `https://flagsapi.com/${countryMap[
      country
    ].toString()}/flat/64.png`;
  }

  return (
    <div>
      <img src={notation}></img>
    </div>
  );
}

export default CountryImage;
