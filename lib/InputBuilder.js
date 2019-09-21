var SLP

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
        var fee, change
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
                fee = byteCount * this.feePerByte
                change = satoshiTotalInput - satoshiAmount - fee
                if(satoshiTotalInput >= satoshiAmount + fee){
                    return {inputList: inputList, change: change, fee: fee};
                }
            }
        }
        return {inputList: inputList, change: change, fee: fee};
    }

}
module.exports = function(slp){
    SLP = slp
    return InputBuilder;
}