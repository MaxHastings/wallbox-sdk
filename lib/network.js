let SLPSDK = require('slp-sdk');
let SLP = new SLPSDK({
    restURL: "https://trest.bitcoin.com/v2/"
  });
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let CHUNK_SIZE = 10;
class network{

    static async queryAddrDetails(addrList){
        try{
            let details = await SLP.Address.details(addrList);
            return details
        }catch(error){
            console.log(error)
            console.log("Retrying request in 5 seconds.")
            sleep(5000)
            this.queryAddrDetails(addrList)
        }
    }

    static async queryAddrUTXOs(addrList){
        try{
            let utxoAddrList = []
            for(var i = 0; i < addrList.length; i+CHUNK_SIZE){
                let addrChunk = addrList.splice(i, CHUNK_SIZE)
                let utxoAddrChunk = await SLP.Address.utxo(addrChunk);
                utxoAddrList = utxoAddrList.concat(utxoAddrChunk)
            }
            return utxoAddrList
        }catch(error){
            console.log(error)
            console.log("Retrying request in 5 seconds.")
            sleep(5000)
            this.queryAddrUTXOs(addrList)
        }
    }

}
module.exports = network;