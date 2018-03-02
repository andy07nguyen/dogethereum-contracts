var DogeRelay = artifacts.require("./DogeRelay.sol");
var DogeRelayForTests = artifacts.require("./DogeRelayForTests.sol");
var DogeProcessor = artifacts.require("./DogeProcessor.sol");
var Set = artifacts.require("./token/Set.sol");
var DogeToken = artifacts.require("./token/DogeToken.sol");
var DogeTokenForTests = artifacts.require("./token/DogeTokenForTests.sol");
var DogeTx = artifacts.require("./DogeParser/DogeTx.sol");
var ScryptCheckerDummy = artifacts.require("./ScryptCheckerDummy.sol");

const scryptCheckerAddress = '0xfeedbeeffeedbeeffeedbeeffeedbeeffeedbeef';
const dogethereumRecipientUnitTest = '0x4d905b4b815d483cdfabcd292c6f86509d0fad82';
const dogethereumRecipientIntegrationDogeMain = '0x0000000000000000000000000000000000000003';
const dogethereumRecipientIntegrationDogeRegtest = '0x0000000000000000000000000000000000000004';

module.exports = function(deployer, network, accounts) {
  var dogethereumRecipient;
  if (network === 'development') {
    dogethereumRecipient = dogethereumRecipientUnitTest;
  } else if (network === 'integrationDogeMain') {
    dogethereumRecipient = dogethereumRecipientIntegrationDogeMain;
  } else {
    dogethereumRecipient = dogethereumRecipientIntegrationDogeRegtest;    
  }
  var dogeRelayNetwork;
  if (network === 'integrationDogeRegtest') {
    dogeRelayNetwork = 2; // REGTEST
  } else {
    dogeRelayNetwork = 0; // MAIN
  }

  deployer.deploy(Set, {gas: 300000});
  deployer.deploy(DogeTx, {gas: 100000});
  if (network === 'development') {
    deployer.link(Set, DogeTokenForTests);
    deployer.link(DogeTx, DogeTokenForTests);
    return deployer.deploy(DogeRelayForTests, dogeRelayNetwork, {gas: 4600000}).then(function () {
      return deployer.deploy(ScryptCheckerDummy, DogeRelayForTests.address, true, {gas: 1000000})
    }).then(function () {
      return deployer.deploy(DogeProcessor, DogeRelayForTests.address, {gas: 3600000});
    }).then(function () {
      return deployer.deploy(DogeTokenForTests, DogeRelayForTests.address, dogethereumRecipient, {gas: 4000000});
    }).then(function () {
      const dogeRelay = DogeRelayForTests.at(DogeRelayForTests.address);
      return dogeRelay.setScryptChecker(ScryptCheckerDummy.address, {gas: 1000000});
    });
  } else {
    deployer.link(Set, DogeToken);
    deployer.link(DogeTx, DogeToken);
    return deployer.deploy(DogeRelay, dogeRelayNetwork, {gas: 3600000}).then(function () {
      return deployer.deploy(DogeToken, DogeRelay.address, dogethereumRecipient, {gas: 4000000});
    }).then(function () {
      return deployer.deploy(ScryptCheckerDummy, DogeRelay.address, true, {gas: 1000000})
    }).then(function () {
      const dogeRelay = DogeRelay.at(DogeRelay.address);
      //return dogeRelay.setScryptChecker(scryptCheckerAddress, {gas: 100000});
      return dogeRelay.setScryptChecker(ScryptCheckerDummy.address, {gas: 100000});
    });
  }
};
