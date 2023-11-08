import React, { useState } from "react"
import * as cyclesIDL from "./interfaces/cmc/cmc";
import { HttpAgent, Actor } from "@dfinity/agent";
import outpostBuilt from "./assets/outpost-built.png";
import github from "./assets/github.png";

function App() {

  const [timeResult, setTimeResult] = useState("");

  const basicAgent : HttpAgent = new HttpAgent({
    host: "https://ic0.app",
  });

  const calculateSecondsToBurnICP = async () : Promise<void> => {
    const conversionRate : number = await getConversionRate();
    const burnRate : number = await getBurnRate();
    if (!burnRate) {
      alert("Please enter a burn rate");
      return;
    }
    const secondsToBurnICP = conversionRate / burnRate;
    const minutesToBurnICP = Number((secondsToBurnICP / 60).toFixed(2));
    const minutesRemainderDecimal = Number((minutesToBurnICP % 1).toFixed(2));
    const decimalToSeconds = Number((minutesRemainderDecimal * 60).toFixed(0));
    const minutesToBurnICPFormatted = minutesToBurnICP.toString().split(".")[0];
    setTimeResult(Number((minutesToBurnICPFormatted)) + " Minutes and " + decimalToSeconds.toFixed(0) + " Seconds");
    console.log("Updated!");
  }

  const getBurnRate = async () : Promise<number> => {
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

  const getConversionRate = async () : Promise<number> => {
    const mainnetCyclesCanister: string = "rkp4c-7iaaa-aaaaa-aaaca-cai";
    const cyclesMintingActor = Actor.createActor(cyclesIDL.idlFactory, {
      agent: basicAgent,
      canisterId: mainnetCyclesCanister,
    });
    const conversionRate: any = await cyclesMintingActor.get_icp_xdr_conversion_rate();
    const actualRate = conversionRate.data.xdr_permyriad_per_icp.toString();
    const requiredZeros = "00000000";
    const finalRate = Number(actualRate + requiredZeros);
    return finalRate;
  }

  React.useEffect(() => {
    calculateSecondsToBurnICP();
    const interval = setInterval(() => {
      calculateSecondsToBurnICP();
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const notice: string = "(Based On ICP>XDR)";

  return (
    <div className="App">
      <div className="stats">
        <h6>TOTAL TIME TO BURN 1 ICP</h6>
        <p style={{ color: "#fc609d" }}>{timeResult}</p>
        <p style={{ color: "#f5f5f7", fontSize: "17px" }}>{notice}</p>
        <div className="credits">
          <img src={github} onClick={() => window.location.href = "https://github.com/cp-daniel-mccoy/burn-calc"} />
        </div>
      </div>
    </div>
  )
}
export default App;