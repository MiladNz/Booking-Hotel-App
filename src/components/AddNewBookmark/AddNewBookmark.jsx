import { useNavigate } from "react-router-dom";
import useUrlLocation from "../../hooks/useUrlLocation";
import { useEffect, useState, useSyncExternalStore } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import ReactCountryFlag from "react-country-flag";
const BASE_GEOCODING_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function AddNewBookmark() {
  const [lat, lng] = useUrlLocation();
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState(" ");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState("");
  const [geoCodingError, setGeoCodingError] = useState(null);

  useEffect(() => {
    if (!lat || !lng) return;

    async function fetchLocationData() {
      setIsLoadingGeoCoding(true);
      setGeoCodingError(null);
      try {
        const { data } = await axios.get(
          `${BASE_GEOCODING_URL}?latitude=${lat}&longitude=${lng}`
        );

        if (!data.countryCode) throw new Error("this location is not a city!");
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        // setCountryCode(getFlagEmoji(data.countryCode));
        setCountryCode(data.countryCode);
      } catch (error) {
        setGeoCodingError(error.message);
      } finally {
        setIsLoadingGeoCoding(false);
      }
    }
    fetchLocationData();
  }, [lat, lng]);

  if (isLoadingGeoCoding) return <Loader />;
  if (geoCodingError) return <p>{geoCodingError}</p>;
  return (
    <div>
      <h2>Bookmark New Location</h2>
      <form action="" className="form">
        <div className="formControl">
          <label htmlFor="cityName">City Name</label>
          <input
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            type="text"
            name="cityName"
            id="cityName"
          />
        </div>
        <div className="formControl">
          <label htmlFor="country">Country</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            type="text"
            name="country"
            id="country"
          />
          <ReactCountryFlag className="flag" svg countryCode={countryCode} />
          {/* <span className="flag">{countryCode}</span> */}
        </div>
        <div className="buttons">
          <button
            className="btn btn--back"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}>
            &larr; Back
          </button>
          <button className="btn btn--primary">Add</button>
        </div>
      </form>
    </div>
  );
}

export default AddNewBookmark;
