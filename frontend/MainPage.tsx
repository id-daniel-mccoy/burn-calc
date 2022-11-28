import React, { useState } from "react"
import * as cyclesIDL from "./interfaces/cmc/cmc";
import { PlugWallet } from "./components/PlugWallet";

export function MainPage() {

  const [timeResult, setTimeResult] = useState("");

  const calculateSecondsToBurnICP = async () => {
    const conversionRate = await getConversionRate();
    const burnRate = await getBurnRate();
    if (!burnRate) {
      alert("Please enter a burn rate");
      return;
    }
    const secondsToBurnICP = conversionRate / burnRate;
    const minutesToBurnICP = Number((secondsToBurnICP / 60).toFixed(2));
    const minutesRemainderDecimal = Number((minutesToBurnICP % 1).toFixed(2));
    const decimalToSeconds = Number((minutesRemainderDecimal * 60).toFixed(0));
    setTimeResult(minutesToBurnICP.toFixed(0) + " Minutes and " + decimalToSeconds.toFixed(0) + " Seconds.");
    console.log("Updated!");
  }

  const getBurnRate = async () => {
    const burnRateAPI:string = "https://ic-api.internetcomputer.org/api/v3/metrics/cycle-burn-rate";
    function httpGet(theUrl: string) {
      let xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.open("GET", theUrl, false); 
      xmlHttpReq.send(null);
      return xmlHttpReq.responseText;
    }
    const result = httpGet(burnRateAPI);
    const jsonResponse = JSON.parse(result);
    const finalResponse = Number(jsonResponse.cycle_burn_rate[0][1]).toFixed(0);
    return Number(finalResponse);
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
        <button onClick={calculateSecondsToBurnICP}>Calculate</button>
        <div className="results">
          <p>Total Time To Burn 1 ICP:</p>
          <p style={{ color: "lime" }}>{timeResult}</p>
        </div>
      </div>
    </div>
  )
}