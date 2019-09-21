var SLP
let AddressListKeyPair = require('./AddressListKeyPair')
var InputBuilder = require('./InputBuilder')

class TransactionBuilder {

    constructor(utxoAddrList, hdNode, changeAddress) {
        this.utxoAddrList = utxoAddrList
        this.hdNode = hdNode
        this.changeAddress = changeAddress
        this._setDefaults()
    }

    _setDefaults(){
        this.feePerByte = 1
    }

    setFeePerByte(feePerByte){
        if(feePerByte < 1){
            return;
        }
        this.feePerByte = feePerByte
        return this;
    }

    setOpReturnMessage(message){
        this.message = message
    }

    sendTo(address, satoshis){
        this.sendToAddr = address
        this.sendToSatoshis = satoshis
    }

    build(){
        this.txBuilder = new SLP.TransactionBuilder('testnet');
        this._addInputs()
        this._addOutputs()
        let addressListKeyPair = new AddressListKeyPair(this.hdNode);
        addressListKeyPair.loadAddresses();
        this._signInputs(addressListKeyPair)
        let tx = this.txBuilder.build()
        return tx;
    }

    _getOutputBytes(){
        let messageByteSize = 0;
        if(this.message){
            let message = this.message
            messageByteSize = Buffer.byteLength(message, 'utf8') + 1; //1 byte is for OP_RETURN
        }
        return SLP.BitcoinCash.getByteCount({ P2PKH: 0 }, { P2PKH: 2 }) + messageByteSize
    }

    _addInputs(){
        let inputBuilder = new InputBuilder(this.utxoAddrList, this.sendToSatoshis, this._getOutputBytes(), this.feePerByte)
        let inputObj = inputBuilder.fetchInputs();
        let inputList = inputObj.inputList;
        this.inputList = inputList
        this.change = inputObj.change;
        this.fee = inputObj.fee
        
        for(var i = 0; i < inputList.length; i++){
            let input = inputList[i];
            let txId = input.txId;
            let vout = input.vout;
            this.txBuilder.addInput(txId, vout);
        }
    }

    _addOutputs(){
        if(this.message){
            let message = this.message
            // add output w/ address and amount to send
            // encode some text as a buffer
            let buf = Buffer.from(message);
            // create array w/ OP_RETURN code and text buffer and encode
            let data = SLP.Script.encode([
                SLP.Script.opcodes.OP_RETURN,
                buf
            ])
            // add encoded data as output and send 0 satoshis
            this.txBuilder.addOutput(data, 0)
        }
        let changeAddress = this.changeAddress
        let sendToAddr = this.sendToAddr
        let sendToSatoshis = this.sendToSatoshis
        let change = this.change

        this.txBuilder.addOutput(sendToAddr, sendToSatoshis);
        this.txBuilder.addOutput(changeAddress, change)
    }

    _signInputs(addressListKeyPair){
        let inputList = this.inputList
        for(var i = 0; i < inputList.length; i++){
            var input = inputList[i];
            var vin = i
            let satoshis = input.satoshis
            let cashAddress = input.cashAddress
            let keyPair = addressListKeyPair.getKeyPair(cashAddress)
            let redeemScript;
            let txBuilder = this.txBuilder
            txBuilder.sign(vin, keyPair, redeemScript, txBuilder.hashTypes.SIGHASH_ALL, satoshis, txBuilder.signatureAlgorithms.SCHNORR);
        }
    }

}
module.exports = function(slp){
    SLP = slp
    InputBuilder = InputBuilder(slp)
    return TransactionBuilder;
}