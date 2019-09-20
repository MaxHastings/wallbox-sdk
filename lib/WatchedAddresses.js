let AddrDetailList = require('./AddrDetailList')
var network = require('./network')
var walletFileManager = require('./walletFileManager')
let Chain = require('./Chain')
let ADDR_BUFF_SIZE = 10;

class WatchedAddresses {

    constructor(hdNode){
        this.hdNode = hdNode
    }

    async update(){
        let hdNode = this.hdNode
        var chain = new Chain(hdNode)
        var fetching = true
        while(fetching){
            let addresses = walletFileManager.fetchAllWatchedAddrs();
            let length = addresses.length
            let chainList = chain.fetchAddrChunk(length, ADDR_BUFF_SIZE)
            let addrDetailList = await network.queryAddrDetails(chainList)
            addrDetailList = new AddrDetailList(addrDetailList).filterEmptyTotalReceived()
            if(addrDetailList.length == 0){
                return
            }
            walletFileManager.appendWatchedAddrs(addrDetailList)
            if(addrDetailList.length < 2){
                fetching = false
            }
        }
    }

}

module.exports = WatchedAddresses;