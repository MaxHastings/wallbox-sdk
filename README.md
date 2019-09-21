# wallbox-sdk
Wallet SDK for Bitcoin Cash

A tool for creating and managing a BCH wallet

This library is in early stages of development. It will have bugs, it will be unstable. Use at your own risk.

## Example

#### Wallet
``` javascript
let SLPSDK = require('slp-sdk');
var SLP = new SLPSDK({
  restURL: "https://trest.bitcoin.com/v2/"
});
let wallbox = require("wallbox-sdk")(SLP, "testnet");

(async () => {
  try{
    let hdNode = await wallbox.Seed.getNode()
    let Wallet = new wallbox.Wallet(hdNode);
    let address = await Wallet.getfreshAddress()

    let options = {message: "Hello BCH Blockchain!", feePerByte: 1}
    let txId = await Wallet.send(address, 100000, options)
    console.log("TX ID: " + txId)
    let balance = await Wallet.getWalletBalance()
    console.log("Balance = " + balance + " BCH")
  }catch(error){
    console.error(error);
  }
})()
```

## LICENSE [MIT](LICENSE)

