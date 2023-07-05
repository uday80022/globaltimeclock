import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment-timezone";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import "./App.css";

function App() {
  const [indianTime, setIndianTime] = useState(moment().tz("Asia/Kolkata"));
  const [inputError, setInputError] = useState(false);
  const currentTime = moment.utc(indianTime).tz("Asia/Kolkata");
  const USTime = moment.utc(indianTime).tz("America/New_York");
  const HongKongTime = moment.utc(indianTime).tz("Asia/Hong_Kong");
  const [customTime, setCustomTime] = useState("");
  const [Change, setChange] = useState(true);

  // changes the time every second with the local current indian time
  useEffect(() => {
    const timer = setInterval(() => {
      if (Change) {
        setIndianTime(moment().tz("Asia/Kolkata"));
      } else {
        setIndianTime(customTime);
      }
    }, 1000);
    return () => clearInterval(timer);
  });

  // handle function gets the custom time data from html file and send it to handleIndianTimeChange function
  const handle = (event) => {
    const hours = document.getElementById("hh").value;
    const minutes = document.getElementById("mm").value;
    const seconds = document.getElementById("ss").value;
    const day = document.getElementById("A").value;
    if (hours !== "" && minutes !== "" && seconds !== "" && day !== "") {
      const EnteredTime = hours + ":" + minutes + ":" + seconds + " " + day;
      handleIndianTimeChange(EnteredTime);
    }
  };

  // handleIndianTimeChange changes the ustime and hongkong time with respect to custom time entered.
  const handleIndianTimeChange = (EnteredTime) => {
    const customTime = moment(EnteredTime, "hh:mm:ss A", true);
    setIndianTime(customTime);
    setCustomTime(customTime);
    setChange(false);
    if (customTime.isValid()) {
      setIndianTime(customTime);
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  // handleSubmit sends the customtime to save_custom_time path in django views.file
  const handleSubmit = () => {
    fetch("http://127.0.0.1:8000/save_custom_time", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customTime: customTime.format("hh:mm:ss A") }),
    })
      .then((response) => response.json())
      // Handles errors by JSON
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>Global Time Clock</h1>
      </div>
      <div className="container-main">
        <div className="countries-time">
          <div className="country">
            <h2>Hong Kong Time</h2>
            <p className="country-time">
              <b>{HongKongTime.format("hh:mm:ss A")}</b>
            </p>
            <Clock value={HongKongTime.format("hh:mm:ss A")} />
          </div>
          <div className="country">
            <h2>Indian Time</h2>
            <p className="country-time">
              <b>{currentTime.format("hh:mm:ss A")}</b>
            </p>
            <Clock value={currentTime.format("hh:mm:ss A")} />
          </div>
          <div className="country">
            <h2>US Time</h2>
            <p className="country-time">
              <b>{USTime.format("hh:mm:ss A")}</b>
            </p>
            <Clock value={USTime.format("hh:mm:ss A")} />
          </div>
        </div>
      </div>
      <div className="custom-time">
        <div>
          <label htmlFor="hh"> Enter Custom Indian Time </label>
          <div className="input-container">
            <input
              className="custom"
              type="text"
              placeholder="hh"
              id="hh"
              onChange={handle}
            ></input>
            <input
              className="custom"
              type="text"
              placeholder="mm"
              id="mm"
              onChange={handle}
            ></input>
            <input
              className="custom"
              type="text"
              placeholder="ss"
              id="ss"
              onChange={handle}
            ></input>
            <input
              className="custom-day"
              type="text"
              placeholder="AM/PM"
              id="A"
              onChange={handle}
            ></input>
          </div>
          <button type="submit" onClick={handleSubmit}>
            submit
          </button>
        </div>
        <div>
          {inputError && (
            <p className="error-message">
              Invalid time format. Please enter time in hh:mm:ss AM/PM format.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
