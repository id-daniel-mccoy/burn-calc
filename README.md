## ICP Burn Rate Calculator v1.4

Simple logic written in JS to convert the internet computer's cycle burn rate per second into ICP burn rate per minute.

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

* Modularize into a UI component and a separate functional component.
* Addition of a rust canister that eventually can act as an API for returning various statistics in a simple to parse object.
* Additonal calculators/converters in both UI and non UI formats.

Author: cp-daniel-mccoy