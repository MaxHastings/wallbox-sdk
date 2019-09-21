var network = require('./network')
var walletFileManager = require('./walletFileManager')
let AddrUtxoList = require('./AddrUtxoList')

class WalletUtxos {

    static async update(){
        let addrList = walletFileManager.fetchAllWatchedAddrs()
        walletFileManager.resetUTXOs();
        let addrUTXOList = await network.queryAddrUTXOs(addrList)
        //Filter out empty addresses
        let filteredUTXOList = new AddrUtxoList(addrUTXOList).filterEmptyAddr()
        walletFileManager.appendUTXOS(filteredUTXOList)
        walletFileManager.saveUTXOsToFile()
    }

    static getBalance(){
        let utxoAddrList = walletFileManager.getUTXOList()
        var balance = 0;
        for(var i = 0; i < utxoAddrList.length; i++){
            let utxoList = utxoAddrList[i].utxos;
            for(var j = 0; j < utxoList.length; j++){
                let utxo = utxoList[j]
                balance += utxo.satoshis
            }
        }
        return balance;
    }

}

module.exports = function(slp){
    network = network(slp)
    return WalletUtxos;
}