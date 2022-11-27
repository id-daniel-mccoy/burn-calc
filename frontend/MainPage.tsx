import React, { useEffect, useState } from "react"

export function MainPage() {

  // create a state variable to store the result
  const [secResult, setSecResult] = useState("");
  const [minResult, setMinResult] = useState("");

  const calculateSecondsToBurnICP = async () => {
    const conversionRate = Number((document.getElementById("conversionRate") as HTMLInputElement).value);
    const burnRate = Number((document.getElementById("burnRate") as HTMLInputElement).value);
    const secondsToBurnICP = conversionRate / burnRate;
    setSecResult(secondsToBurnICP.toFixed(2).toString());
    const minutesToBurnICP = Number((secondsToBurnICP / 60).toFixed(2));
    const minutesRemainderDecimal = Number((minutesToBurnICP % 1).toFixed(2));
    console.log(minutesRemainderDecimal);
    const decimalToSeconds = Number((minutesRemainderDecimal * 60).toFixed(2));
    console.log("The IC is burning 1 ICP every " + minutesToBurnICP.toFixed(0) + " minutes and " + decimalToSeconds.toFixed(0) + " seconds.");
    console.log(decimalToSeconds.toFixed(0));
    setMinResult(minutesToBurnICP.toFixed(2).toString());
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Welcome!</h1>
      </div>
      <div className="content">
        <div className="inputContainer">
          <h6>Current Amount Of Cycles Per ICP:</h6>
          <input type="number" id="conversionRate" placeholder="Cycles Per ICP" />
        </div>
        <div className="inputContainer">
          <h6>Current Burn Rate In Cycles/s:</h6>
          <input type="number" id="burnRate" placeholder="Cycle Burn Rate" />
        </div>
        <button onClick={calculateSecondsToBurnICP}>Calculate</button>
        <div className="results">
          <p>Total Seconds To Burn 1 ICP:</p>
          <p>{secResult}</p>
        </div>
        <div className="results">
          <p>Total Minutes To Burn 1 ICP:</p>
          <p>{minResult}</p>
        </div>
      </div>
    </div>
  )
}