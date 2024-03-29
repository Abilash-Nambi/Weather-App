import React, { useEffect, useState } from "react";
import { Wrapper } from "./weather.module";
import { FcSearch } from "react-icons/fc";
import { WiHumidity } from "react-icons/wi";
import { SiWindicss } from "react-icons/si";
import {
  BsFillSunFill,
  BsCloudyFill,
  BsFillCloudRainFill,
  BsCloudFog2Fill,
} from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from "axios";

const DisplayWeather = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  console.log("🚀 + DisplayWeather + location:", data);
  const api_key = "95735257a2ca15de542e7fd0232db634";
  const api_Endpoint = `https://api.openweathermap.org/data/2.5/`;

  useEffect(() => {
    getLocation();
  }, []);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    const Latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetchData(Latitude, longitude);
  }
  const fetchData = async (Latitude, longitude) => {
    try {
      const response = await axios.get(
        `${api_Endpoint}weather?lat=${Latitude}&lon=${longitude}&appid=${api_key}&units=metric`
      );
      setData(response.data);
      setIsLoading(false);
      console.log("🚀 + fetchData + response:", response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    if (searchCity.trim() === "  ") {
      return;
    }
    try {
      const response = await axios.get(
        `${api_Endpoint}weather?q=${searchCity}&appid=${api_key}&units=metric`
      );
      console.log("🚀 + handleSearch + response:", response.data);
      setData(response.data);
    } catch (error) {
      console.log("🚀 + handleSearch + error:", error);
    }
  };

  const iconChanger = (weather) => {
    let iconElement;
    let iconColor = "";

    switch (weather) {
      case "Rain":
        iconElement = <BsFillCloudRainFill />;
        iconColor = "#272829";
        break;

      case "Clear":
        iconElement = <BsFillSunFill />;
        iconColor = "#FFC436";
        break;
      case "Clouds":
        iconElement = <BsCloudyFill />;
        iconColor = "#102C57";
        break;

      case "Mist":
        iconElement = <BsCloudFog2Fill />;
        iconColor = "#279EFF";
        break;

      default:
        iconElement = <TiWeatherPartlySunny />;
        iconColor = "#7B2869";
    }

    return (
      <span className="icon" style={{ color: iconColor }}>
        {iconElement}
      </span>
    );
  };

  return (
    <Wrapper>
      <div className="container">
        <div className="searchArea">
          <input
            type="text"
            placeholder="Enter a city"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />

          <div className="searchCircle">
            <FcSearch className="searchIcon" onClick={handleSearch} />
          </div>
        </div>
        {!isLoading ? (
          <>
            <div className="weatherArea">
              <h1>{data?.name}</h1>
              <span>{data?.sys?.country}</span>
              <div className="icon">
                {iconChanger(data?.weather && data?.weather[0]?.main)}
              </div>
              <h1>{data?.main?.temp.toFixed(0)}</h1>
              <h2 style={{ margin: "0" }}>
                {data?.weather && data?.weather[0]?.main}
              </h2>
            </div>
            <div className="bottomInfoArea">
              <div className="humidityLevel">
                <WiHumidity className="humidIcon" />
                <div className="humidInfo">
                  <h1>{data?.main?.humidity}%</h1>
                  <p>Humidity</p>
                </div>
              </div>
              <div className="wind">
                <SiWindicss className="windIcon" />
                <div className="humidInfo">
                  <h1>{data?.wind?.speed} km/h</h1>
                  <p>Wind speed</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="loading">
              <RiLoaderFill className="loadingIcon" />
              <p>Loading</p>
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default DisplayWeather;
