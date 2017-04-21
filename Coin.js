const util = require('./util');

util.compileSolidity('./contracts/Coin.sol')
  .then((compiledData) => {
    util.sendTransaction(compiledData.bytecode);
  });
