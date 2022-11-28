import React, { useState } from "react"

export function MainPage() {

  const [timeResult, setTimeResult] = useState("");

  const calculateSecondsToBurnICP = async () => {
    const conversionRate = Number((document.getElementById("conversionRate") as HTMLInputElement).value);
    const burnRate = Number((document.getElementById("burnRate") as HTMLInputElement).value);
    const secondsToBurnICP = conversionRate / burnRate;
    const minutesToBurnICP = Number((secondsToBurnICP / 60).toFixed(2));
    const minutesRemainderDecimal = Number((minutesToBurnICP % 1).toFixed(2));
    const decimalToSeconds = Number((minutesRemainderDecimal * 60).toFixed(0));
    setTimeResult(minutesToBurnICP.toFixed(0) + " Minutes and " + decimalToSeconds.toFixed(0) + " Seconds.");
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
          <p>Total Time To Burn 1 ICP:</p>
          <p style={{ color: "lime" }}>{timeResult}</p>
        </div>
      </div>
    </div>
  )
}