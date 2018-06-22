var DogeRelay = artifacts.require("./DogeRelay.sol");
var DogeToken = artifacts.require("./token/DogeToken.sol");
var utils = require('../test/utils');

module.exports = async function(callback) {
  var dr  = await DogeRelay.deployed();
  console.log("DogeRelay");
  console.log("---------");
  var bestBlockHash = await dr.getBestBlockHash.call(); 
  console.log("Doge Best block hash : " + bestBlockHash.toString(16));
  var bestBlockHeight = await dr.getBestBlockHeight.call(); 
  console.log("Doge Best block height : " + bestBlockHeight.toString(10));
  var blockLocator = await dr.getBlockLocator.call();     
  var blockLocatorFormatted = new Array();
  blockLocator.forEach(function(element) {
      blockLocatorFormatted.push(utils.formatHexUint32(element.toString(16)));
  });    
  console.log("Locator : " + blockLocatorFormatted);
  
  console.log("DogeToken");
  console.log("---------");
  var dt = await DogeToken.deployed();
  var balance1 = await dt.balanceOf.call("0x92ecc1ba4ea10f681dcf35c02f583e59d2b99b4b"); 
  console.log("DogeToken Balance of 0x92ecc1ba4ea10f681dcf35c02f583e59d2b99b4b : " + balance1);
  var balance2 = await dt.balanceOf.call("0xd2394f3fad76167e7583a876c292c86ed10305da"); 
  console.log("DogeToken Balance of 0xd2394f3fad76167e7583a876c292c86ed10305da : " + balance2);
  var balance3 = await dt.balanceOf.call("0xf5fa014271b7971cb0ae960d445db3cb3802dfd9"); 
  console.log("DogeToken Balance of 0xf5fa014271b7971cb0ae960d445db3cb3802dfd9 : " + balance3);


  var dogeEthPrice = await dt.dogeEthPrice.call(); 
  console.log("Doge-Eth price : " + dogeEthPrice);

  // Operators
  const operatorsLength = await dt.getOperatorsLength();
  console.log("operators length : " + operatorsLength);
  for (var i = 0; i < operatorsLength; i++) {      
    let operatorKey = await dt.operatorKeys(i);
    if (operatorKey[1] == false) {
      // not deleted
      let operatorPublicKeyHash = operatorKey[0];
      let operator = await dt.operators(operatorPublicKeyHash);
      console.log("operator [" + operatorPublicKeyHash + "]: " + 
                  "eth address : " + operator[0].toString(16) + ", " + 
                  "dogeAvailableBalance : " + operator[1] + ", " + 
                  "dogePendingBalance : " + operator[2] + ", " + 
                  "nextUnspentUtxoIndex : " + operator[3] + ", " + 
                  "ethBalance : " + web3.fromWei(operator[4]));
      const utxosLength = await dt.getUtxosLength(operatorPublicKeyHash);
      console.log("utxosLength : " + utxosLength);  
      for (var j = 0; j < utxosLength; j++) {
        var utxo = await dt.getUtxo(operatorPublicKeyHash, j);
        console.log("utxo [" + j + "]: " + utils.formatHexUint32(utxo[1].toString(16)) + ", " + utxo[2] + ", " + utxo[0]);  
      }    
    }
  }
 
  // Current block number 
  console.log("Eth Current block : " + web3.eth.blockNumber);

  // Unlock events
  var unlockRequestEvent = dt.UnlockRequest({}, {fromBlock: 0, toBlock: "latest"});
  var myResults = unlockRequestEvent.get(async function(error, unlockRequestEvents){ 
     if (error) console.log("error : " + error);
     console.log("unlockRequestEvents length : " + unlockRequestEvents.length);
     for (var i = 0; i < unlockRequestEvents.length; i++) {
        console.log("unlockRequestEvent [" + unlockRequestEvents[i].args.id + "]: ");
        console.log("  tx block number : " + unlockRequestEvents[i].blockNumber);
        var unlock = await dt.getUnlockPendingInvestorProof(unlockRequestEvents[i].args.id);
        console.log("  from : " + unlock[0]);
        console.log("  dogeAddress : " + unlock[1]);
        console.log("  value : " + unlock[2].toNumber());
        console.log("  timestamp : " + unlock[3].toNumber());
        console.log("  selectedUtxos : ");
        for (var j = 0; j <  unlock[4].length; j++) {
          console.log("    " + unlock[4][j]);          
        }
        console.log("  fee : " + unlock[5].toNumber());
        console.log("  operatorPublicKeyHash : " + unlock[6]);
     }
  });
}