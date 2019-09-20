let SLPSDK = require('slp-sdk');
let SLP = new SLPSDK({
    restURL: "https://trest.bitcoin.com/v2/"
  });
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let CHUNK_SIZE = 10;
class network{

    static async queryAddrDetails(addrList){
        return new Promise(async function(resolve, reject) {
            while(true){
                try{
                    let details = await SLP.Address.details(addrList);
                    resolve(details)
                    return
                }catch(error){
                    console.log(error)
                }
                console.log("Retrying request in 5 seconds.")
                await sleep(5000)
            }
          });
    }

    static async queryAddrUTXOs(addrList){
        return new Promise(async function(resolve, reject){
            while(true){
                try{
                    let utxoAddrList = []
                    for(var i = 0; i < addrList.length; i+CHUNK_SIZE){
                        let addrChunk = addrList.splice(i, CHUNK_SIZE)
                        let utxoAddrChunk = await SLP.Address.utxo(addrChunk);
                        utxoAddrList = utxoAddrList.concat(utxoAddrChunk)
                    }
                    resolve(utxoAddrList)
                    return
                }catch(error){
                    console.log(error)
                }
                console.log("Retrying request in 5 seconds.")
                await sleep(5000)
            }
        });
    }

}
module.exports = network;