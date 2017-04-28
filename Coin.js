require('colors');
const util = require('./util');
const config = require('./config');

function deployContract() {
  util.compileSolidity('./contracts/Coin.sol')
    .then((compiledData) => {
      util.sendTransaction(util.ensure0X(compiledData.bytecode))
        .then((txRes) => {
          callFunctionMint(txRes.result.contractAddress, JSON.parse(compiledData.interface));
        });
    });
}

function callFunctionMint(contractAddress, abi) {
  util.callContractFunction(contractAddress, abi, 'mint', config.account2, 9898)
    .then(() => {
      return util.callContractFunction(contractAddress, abi, 'getBalance', config.account2);
    });
}

deployContract();
