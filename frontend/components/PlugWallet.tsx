import React, { useEffect, useRef } from "react"
import '../assets/plugWallet.css';

export function PlugWallet() {

  const manageLogin = async() => {
    await (window as any).ic.plug.requestConnect();
    const userPrincipal = await (window as any).ic.plug.agent.getPrincipal();
    document.getElementById("statusBubble")!.style.backgroundColor = "rgba(0,255,0,0.5)";
    console.log("You've been logged in with plug!");
  }
  const plugLogin = async() => {
    const hasLoggedIn = await (window as any).ic.plug.isConnected();
    if (!hasLoggedIn) {
      await manageLogin();
    } else {
      await (window as any).ic.plug.createAgent();
      const userPrincipal = await (window as any).ic.plug.agent.getPrincipal();
      document.getElementById("statusBubble")!.style.backgroundColor = "rgba(0,255,0,0.5)";
      console.log("You've been logged in with plug!");
    }
  }

  return (
    <>
      <div className="walletContainer">
        <button onClick={plugLogin} id='plugMenu' className='plugMenu'>Plug Menu<div className='statusBubble' id='statusBubble'></div></button>
      </div>
    </>
  )
}