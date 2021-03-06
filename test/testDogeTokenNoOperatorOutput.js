const utils = require('./utils');
const DogeToken = artifacts.require("./token/DogeTokenForTests.sol");

contract('testDogeTokenNoOperatorOutput', function(accounts) {
  const trustedDogeEthPriceOracle = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const trustedRelayerContract = accounts[0]; // Tell DogeToken to trust accounts[0] as it would be the relayer contract
  const collateralRatio = 2;

  it("Accept unlock transaction without output for operator", async () => {
    const keys = [
      'QSRUX7i1WVzFW6vx3i4Qj8iPPQ1tRcuPanMun8BKf8ySc8LsUuKx',
      'QULAK58teBn1Xi4eGo4fKea5oQDPMK4vcnmnivqzgvCPagsWHiyf',
    ].map(utils.dogeKeyPairFromWIF);
    const tx = utils.buildDogeTransaction({
      signer: keys[0],
      inputs: [['edbbd164551c8961cf5f7f4b22d7a299dd418758b611b84c23770219e427df67', 0]],
      outputs: [[utils.dogeAddressFromKeyPair(keys[1]), 1000000]]
    });
    const operatorPublicKeyHash = utils.publicKeyHashFromKeyPair(keys[0]);
    const txData = `0x${tx.toHex()}`;
    const txHash = `0x${tx.getId()}`;

    const dogeToken = await DogeToken.new(trustedRelayerContract, trustedDogeEthPriceOracle, collateralRatio);

    const operatorEthAddress = accounts[3];
    await dogeToken.addOperatorSimple(operatorPublicKeyHash, operatorEthAddress);

    const superblockSubmitterAddress = accounts[4];
    await dogeToken.processTransaction(txData, txHash, operatorPublicKeyHash, superblockSubmitterAddress);
  });
});
