class AddrDetailList {

    constructor(list) {
        this.list = list;
    }

    filterEmptyTotalReceived(){
        let list = this.list
        var i = list.length

        while (i--) {
            var item = list[i];
            if(item.totalReceived == 0 && item.unconfirmedBalanceSat == 0){
                list.splice(i, 1)
            }
        }
        return list
    }

}

module.exports = AddrDetailList;