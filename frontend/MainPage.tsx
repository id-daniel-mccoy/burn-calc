import React, { useState } from "react"
import * as cyclesIDL from "./interfaces/cmc/cmc";
import { PlugWallet } from "./components/PlugWallet";

export function MainPage() {

  const [timeResult, setTimeResult] = useState("");

  const calculateSecondsToBurnICP = async () => {
    const conversionRate = await getConversionRate();
    const burnRate = Number((document.getElementById("burnRate") as HTMLInputElement).value);
    if (!burnRate) {
      alert("Please enter a burn rate");
      return;
    }
    const secondsToBurnICP = conversionRate / burnRate;
    const minutesToBurnICP = Number((secondsToBurnICP / 60).toFixed(2));
    const minutesRemainderDecimal = Number((minutesToBurnICP % 1).toFixed(2));
    const decimalToSeconds = Number((minutesRemainderDecimal * 60).toFixed(0));
    setTimeResult(minutesToBurnICP.toFixed(0) + " Minutes and " + decimalToSeconds.toFixed(0) + " Seconds.");
  }

  const getConversionRate = async () => {
    const mainnetCyclesCanister: string = "rkp4c-7iaaa-aaaaa-aaaca-cai";
    const whitelist: string[] = [mainnetCyclesCanister];
    await (window as any).ic.plug.createAgent({whitelist});
    const cyclesMintingActor = await (window as any).ic.plug.createActor({
      canisterId: mainnetCyclesCanister,
      interfaceFactory: cyclesIDL.idlFactory,
    });
    const conversionRate = await cyclesMintingActor.get_icp_xdr_conversion_rate();
    const actualRate = conversionRate.data.xdr_permyriad_per_icp.toString();
    const requiredZeros = "00000000";
    const finalRate = Number(actualRate + requiredZeros);
    return finalRate;
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Welcome!</h1>
        <PlugWallet />
      </div>
      <div className="content">
        <div className="inputContainer">
          <h6>Current Burn Rate In Cycles/s:</h6>
          <input type="number" id="burnRate" placeholder="Cycle Burn Rate" />
          <p style={{fontSize: "12px", width: "60%", margin: "10px"}}>Note: This is the current burn rate of the network. You can find this on the <a href="https://dashboard.internetcomputer.org/" target="_blank">IC Dashboard</a> website.</p>
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