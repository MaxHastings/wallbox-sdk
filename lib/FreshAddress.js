let Chain = require('./Chain')
var walletFileManager = require('./walletFileManager')

class FreshAddress{

    constructor(hdNode){
        this.hdNode = hdNode
    }

    getNewAddress(){
        let list = walletFileManager.fetchAllWatchedAddrs();
        let chain = new Chain(this.hdNode)
        let address = chain.getAddr(list.length)
        return address
    }

}

module.exports = function(slp){
    Chain = Chain(slp)
    return FreshAddress;
}