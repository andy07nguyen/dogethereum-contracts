#!/bin/sh

rm -rf build
truffle compile
truffle migrate --reset --network integrationDogeRegtest

/home/cat/software/web3j-3.3.1/bin/web3j truffle generate ~/dogerelay/build/contracts/DogeRelay.json -o ~/agent/src/main/java/ -p org.dogethereum.dogesubmitter.contract
/home/cat/software/web3j-3.3.1/bin/web3j truffle generate ~/dogerelay/build/contracts/DogeToken.json -o ~/agent/src/main/java/ -p org.dogethereum.dogesubmitter.contract
/home/cat/software/web3j-3.3.1/bin/web3j truffle generate ~/dogerelay/build/contracts/ClaimManager.json -o ~/agent/src/main/java/ -p org.dogethereum.dogesubmitter.contract
/home/cat/software/web3j-3.3.1/bin/web3j truffle generate ~/dogerelay/build/contracts/Superblocks.json -o ~/agent/src/main/java/ -p org.dogethereum.dogesubmitter.contract
