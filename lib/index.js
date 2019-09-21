module.exports = function(slp, network){
  return {
    Wallet: require('./Wallet')(slp, network),
    Seed: require('./Seed')(slp, network)
  }
}