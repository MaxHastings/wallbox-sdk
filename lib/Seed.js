const path = require('path');
const SEED_PATH = path.resolve(__dirname, 'Seed.txt')
const fs = require('fs');
let SLPSDK = require('slp-sdk');
let SLP = new SLPSDK({
  restURL: "https://trest.bitcoin.com/v2/"
});

class Seed {

    static async getNode(){
        
        let mnemonic = ""
        if (!fs.existsSync(SEED_PATH)) {
          // create mnemonic
          mnemonic = SLP.Mnemonic.generate(128);
          console.log("Creating new seed file.")
          fs.writeFileSync(SEED_PATH, mnemonic, function(err) {
              if(err) {
                  return console.log(err);
              }
        
              console.log("The seed file was created!");
          });
        }else{
          console.log("Reading seed file.")
          mnemonic = fs.readFileSync(SEED_PATH, 'utf8')
        }
        
        // create root seed buffer
        let rootSeedBuffer = SLP.Mnemonic.toSeed(mnemonic);

        let hdNode = SLP.HDNode.fromSeed(rootSeedBuffer, "testnet");

        // derive hardened child HDNode
        let childNode = SLP.HDNode.derivePath(hdNode, "m/44'/145'/0'");

        return childNode
    }
}

module.exports = Seed;