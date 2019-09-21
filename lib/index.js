module.exports = function(slp){
  return {
    Wallet: require('./Wallet')(slp),
    Seed: require('./Seed')(slp)
  }
}