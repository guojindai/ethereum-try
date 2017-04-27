require('colors');
const util = require('./util');

function deployContract() {
  util.compileSolidity('./contracts/Coin.sol')
    .then((compiledData) => {
      util.sendTransaction(compiledData.bytecode)
        .then((txRes) => {
          callFunctionMint(txRes.result.contractAddress);
        });
    });
}

function callFunctionMint(contractAddress) {
  console.log(contractAddress.blue);
}

deployContract();
