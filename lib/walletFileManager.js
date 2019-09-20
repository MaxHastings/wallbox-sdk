const fs = require('fs');
const path = require('path');
const WATCHED_ADDR_PATH = path.resolve(__dirname, 'watchedAddresses.txt')
const UTXO_PATH = path.resolve(__dirname, 'utxos.txt')


class walletFileManager{
    
    static appendWatchedAddrs(addrDetailList){
        let addrList = this._addrDetailsToAddrList(addrDetailList)
        let watchedList = this.fetchAllWatchedAddrs()
        let data = JSON.stringify(watchedList.concat(addrList))
        fs.writeFileSync(WATCHED_ADDR_PATH, data)
        console.log('The "data to append" was appended to file!');
    }

    static resetUTXOs(){
        if (fs.existsSync(UTXO_PATH)) {
            fs.unlinkSync(UTXO_PATH)
        }
        this.utxoList = []
    }

    static appendUTXOS(list){
        this.utxoList = this.utxoList.concat(list)
    }

    static saveUTXOsToFile(){
        let data = JSON.stringify(this.utxoList)
        fs.writeFileSync(UTXO_PATH, data)
        console.log('Written UTXOs to file!');
    }

    static getUTXOList(){
        if (!fs.existsSync(UTXO_PATH)){
            return []
        }
        let utxoList = fs.readFileSync(UTXO_PATH)
        return JSON.parse(utxoList);
    }

    static fetchAllWatchedAddrs(){
        if (!fs.existsSync(WATCHED_ADDR_PATH)){
            return []
        }
        let addrList = fs.readFileSync(WATCHED_ADDR_PATH);
        return JSON.parse(addrList);
    }

    static _addrDetailsToAddrList(addrDetailList){
        var addrList = []
        for(var i = 0; i < addrDetailList.length; i++){
            addrList.push(addrDetailList[i].cashAddress);
        }
        return addrList;
    }
}
walletFileManager.utxoList = []

module.exports = walletFileManager