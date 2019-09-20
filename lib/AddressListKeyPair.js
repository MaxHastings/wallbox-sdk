var bip32utils = require('bip32-utils')
var walletFileManager = require('./walletFileManager')

class AddressListKeyPair {

    constructor(hdNode) {
        this.hdNode = hdNode
    }

    loadAddresses(){
        this.addressList = walletFileManager.fetchAllWatchedAddrs()
    }

    getKeyPair(address){
        let addressList = this.addressList
        for(var i = 0; i < addressList.length; i++){
            if(addressList[i] == address){
                return this._deriveKeyPair(i)
            }
        }
    }

    _deriveKeyPair(k){
        var chain = new bip32utils.Chain(this.hdNode, k);
        var chainAddr = chain.get();
        let xpriv = chain.derive(chainAddr, this.hdNode); //Gets private key for this address using address and parent node private key.
        let ecPair = xpriv.keyPair;
        return ecPair
    }

}
module.exports = AddressListKeyPair;