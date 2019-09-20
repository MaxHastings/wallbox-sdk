var walletFileManager = require('./walletFileManager')
var TransactionBuilder = require('./TransactionBuilder')
let SLPSDK = require('slp-sdk');
let WatchedAddresses = require('./WatchedAddresses')
let WalletUtxos = require('./WalletUtxos');
let FreshAddress = require('./FreshAddress')
let SLP = new SLPSDK({
    restURL: "https://trest.bitcoin.com/v2/"
  });

class Wallet {

    constructor(hdNode) {
        this.hdNode = hdNode;
    }

    async send(address, amount){
        let watchedAddresses = new WatchedAddresses(this.hdNode)
        await watchedAddresses.update()
        await WalletUtxos.update()
        let hdNode = this.hdNode
        let utxoAddrList = walletFileManager.getUTXOList()
        let changeAddress = await this.getfreshAddress()
        let transactionBuilder = new TransactionBuilder(utxoAddrList, hdNode, changeAddress);
        transactionBuilder.sendTo(address, amount)
        //transactionBuilder.setFeePerByte(10)
        //transactionBuilder.setOpReturnMessage("BCH = $50,000 by 2022")
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

module.exports = Wallet;