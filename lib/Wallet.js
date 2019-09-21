var walletFileManager = require('./walletFileManager')
var TransactionBuilder = require('./TransactionBuilder')
let WatchedAddresses = require('./WatchedAddresses')
let WalletUtxos = require('./WalletUtxos');
let FreshAddress = require('./FreshAddress')
var SLP

class Wallet {

    constructor(hdNode) {
        this.hdNode = hdNode;
    }

    async send(address, amount, options){
        var feePerByte = 1
        var message
        if (options){
            if(options.feePerByte){
                feePerByte = options.feePerByte
            }
            if(options.message){
                message = options.message
            }
        }

        let watchedAddresses = new WatchedAddresses(this.hdNode)
        await watchedAddresses.update()
        await WalletUtxos.update()
        let hdNode = this.hdNode
        let utxoAddrList = walletFileManager.getUTXOList()
        let changeAddress = await this.getfreshAddress()
        let transactionBuilder = new TransactionBuilder(utxoAddrList, hdNode, changeAddress);
        transactionBuilder.sendTo(address, amount)
        transactionBuilder.setFeePerByte(feePerByte)
        transactionBuilder.setOpReturnMessage(message)
        let tx = transactionBuilder.build();
        let hex = tx.toHex();
        SLP.RawTransactions.sendRawTransaction(hex).then((result) => { console.log(result); }, (err) => { console.log(err); });
    }

    async getWalletBalance() {
        let watchedAddresses = new WatchedAddresses(this.hdNode)
        await watchedAddresses.update()
        await WalletUtxos.update()
        return SLP.BitcoinCash.toBitcoinCash(WalletUtxos.getBalance())
    }

    async getfreshAddress(){
        let watchedAddresses = new WatchedAddresses(this.hdNode)
        await watchedAddresses.update()
        let freshAddress = new FreshAddress(this.hdNode)
        let address = freshAddress.getNewAddress();
        return address
    }
}

module.exports = function (slp){
    SLP = slp
    WatchedAddresses = WatchedAddresses(slp)
    FreshAddress = FreshAddress(slp)
    WalletUtxos = WalletUtxos(slp)
    TransactionBuilder = TransactionBuilder(slp)
    return Wallet
};