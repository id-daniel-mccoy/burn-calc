import React, { useState } from "react"
import * as cyclesIDL from "./interfaces/cmc/cmc";
import { HttpAgent, Actor } from "@dfinity/agent";
import outpostBuilt from "./assets/outpost-built.png";
import github from "./assets/github.png";

function App() {

  const [timeResult, setTimeResult] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const basicAgent : HttpAgent = new HttpAgent({
    host: "https://ic0.app",
  });

  const getTime = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
    const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;
    const time = `${hours12}:${minutesFormatted}:${secondsFormatted} ${ampm}`;
    setLastUpdated(time);
  }

  const calculateSecondsToBurnICP = async () : Promise<void> => {
    const conversionRate : number = await getConversionRate();
    const burnRate : number = await getBurnRate();
    if (!burnRate) {
      alert("There was an error grabbing the burn rate, please try again later.");
      return;
    }
    // add commas to the burn rate for readability and then update the DOM
    document.getElementById('burnRate')!.innerHTML = burnRate.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Cycles/Sec";
    await getTotalICPBurned();
    const secondsToBurnICP = conversionRate / burnRate;
    const minutesToBurnICP = Number((secondsToBurnICP / 60).toFixed(2));
    const secondsRemainderDecimal = Number((secondsToBurnICP % 1).toFixed(3));
    const decimalToMilliseconds = Number((secondsRemainderDecimal * 1000).toFixed(0));
    const minutesToBurnICPFormatted = minutesToBurnICP.toString().split(".")[0];
    const secondsToBurnICPFormatted = secondsToBurnICP.toString().split(".")[0];
    setTimeResult(`${minutesToBurnICPFormatted} Minutes, ${secondsToBurnICPFormatted} Seconds, and ${decimalToMilliseconds} Milliseconds`);
    console.log("Updated!");
    getTime();
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

  const getTotalICPBurned = async () => {
    const totalIcpBurnedAPI:string = "https://ledger-api.internetcomputer.org/icp-burned/latest";
    function httpGet(theUrl: string) {
      let xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.open("GET", theUrl, false); 
      xmlHttpReq.send(null);
      return xmlHttpReq.responseText;
    }
    const result = httpGet(totalIcpBurnedAPI);
    console.log(result);
    const jsonResponse = JSON.parse(result);
    console.log(jsonResponse[1]);
    const totalIcpBurned = jsonResponse[1] / Math.pow(10, 8);
    const totalIcpBurnedRounded = totalIcpBurned.toFixed(2);
    const totalIcpBurnedFormatted = totalIcpBurnedRounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById('totalBurned')!.innerHTML = totalIcpBurnedFormatted + " ICP";
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
        <p style={{ color: "#f5f5f7", fontSize: "17px", marginTop: "40px" }}>Current Burn Rate:</p>
        <p style={{ color: "#f5f5f7", fontSize: "17px", marginTop: "0px" }} id='burnRate'/>
        <p style={{ color: "#f5f5f7", fontSize: "17px", marginTop: "40px" }}>Total ICP Burned (All-Time):</p>
        <p style={{ color: "#f5f5f7", fontSize: "17px", marginTop: "0px" }} id='totalBurned'/>
        <p style={{ color: "#f5f5f7", fontSize: "15px", marginTop: "30px" }}>Last Updated: {lastUpdated}</p>
        <div className="credits">
          <img src={github} onClick={() => window.location.href = "https://github.com/cp-daniel-mccoy/burn-calc"} />
        </div>
        <a href='https://danielmccoy.us/' target="_blank" rel="noopener noreferrer">www.danielmccoy.us</a>
      </div>
    </div>
  )
}
export default App;