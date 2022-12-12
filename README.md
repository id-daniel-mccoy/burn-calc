## ICP Burn Rate Calculator v1.8

Some JS logic to calculate the network wide burn rate of ICP in minutes based off of the XDR>ICP converstion rate and the network wide cycles/s burn rate. Refreshes every 12 seconds.

A deployed on chain version can be found live here:

https://kvyr2-jyaaa-aaaam-qbaca-cai.ic0.app/

### To Launch:

```
git clone https://github.com/cp-daniel-mccoy/burn-calc.git
cd burn-calc
npm install
dfx start --clean --background
dfx deploy
```

Once deployed locally, your app should be found here:

http://127.0.0.1:8000/?canisterId=rrkah-fqaaa-aaaaa-aaaaq-cai
<br>

Planned Updates:

* Modularize into a UI component and a separate functional component for use on websites as a plugin.
* Addition of a rust canister that can act as an API and data logging canister to eventually create and serve 

Author: cp-daniel-mccoy