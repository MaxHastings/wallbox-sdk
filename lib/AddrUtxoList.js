class AddrUtxoList {

    constructor(list) {
        this.list = list;
    }

    filterEmptyAddr(){
        let list = this.list
        var i = list.length
        while (i--) {
            var item = list[i];
            if(item.utxos.length == 0){
                list.splice(i, 1)
            }
        }
        return list
    }

}

module.exports = AddrUtxoList;