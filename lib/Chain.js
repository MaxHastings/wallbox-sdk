var bip32utils = require('bip32-utils')
var SLP

class Chain {
    constructor(hdNode){
        this.hdNode = hdNode
    }
    getAddr(pos){
        let chain = new bip32utils.Chain(this.hdNode, pos);
        let chainAddr = SLP.Address.toCashAddress(chain.get());
        return chainAddr;
    }
    fetchAddrChunk(start, size){
        let addrList = []
        let chain = new bip32utils.Chain(this.hdNode, start);
        addrList.push(SLP.Address.toCashAddress(chain.get()));
        for(var i = 0; i < size - 1; i++){
            addrList.push(SLP.Address.toCashAddress(chain.next()));
        }
        return addrList;
    }
    deriveKeyPair(k){
        var chain = new bip32utils.Chain(this.hdNode, k);
        var chainAddr = chain.get();
        let xpriv = chain.derive(chainAddr, this.hdNode); //Gets private key for this address using address and parent node private key.
        let ecPair = xpriv.keyPair;
        return ecPair
    }
}
module.exports = function(slp){
    SLP = slp
    return Chain;
}
