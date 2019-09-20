let SLPSDK = require('slp-sdk');
let SLP = new SLPSDK({
    restURL: "https://trest.bitcoin.com/v2/"
  });

class InputBuilder {

    constructor(utxoAddrList, satoshiAmount, byteCount, feePerByte) {
        this.utxoAddrList = utxoAddrList
        this.satoshiAmount = satoshiAmount
        this.byteCount = byteCount
        this.feePerByte = feePerByte
    }

    fetchInputs(){
        let inputList = []
        let satoshiTotalInput = 0;
        let satoshiAmount = this.satoshiAmount
        let byteCount = this.byteCount;
        for(var i = 0; i < this.utxoAddrList.length; i++){
            let utxoAddr = this.utxoAddrList[i]
            let utxoList = utxoAddr.utxos;
            let cashAddress = utxoAddr.cashAddress;
            for(var j = 0; j < utxoList.length; j++){
                let utxo = utxoList[j];
                let txId = utxo.txid;
                let vout = utxo.vout;
                let satoshis = utxo.satoshis
                inputList.push({txId: txId, vout: vout, cashAddress : cashAddress, satoshis: satoshis});
                byteCount += SLP.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 0 })
                satoshiTotalInput += satoshis
                let fee = byteCount * this.feePerByte
                if(satoshiTotalInput >= satoshiAmount + fee){
                    var change = satoshiTotalInput - satoshiAmount - fee
                    this.change = change
                    return {inputList: inputList, change: change, fee: fee};
                }
            }
        }
    }

}
module.exports = InputBuilder;