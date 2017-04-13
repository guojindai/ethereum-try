const solc = require('solc');
const fs = require('fs');
const path = require('path');
const request = require('request');
const config = require('./config');

function findImports(importPath) {
  return {
    contents: fs.readFileSync(importPath, { encoding: 'utf8' }),
  };
}

function callRPC(method, params) {
  return new Promise((resolve) => {
    console.log(params);
    console.log(method);
    request.post(config.node, {
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: method,
        id: Date.now(),
        params,
      }),
    }, (err, res, body) => {
      if (err) throw err;
      resolve(body);
    });
  });
}

module.exports = {
  compileSolidity(srcPath) {
    return new Promise((resolve) => {
      fs.readFile(srcPath, { encoding: 'utf8' }, (err, data) => {
        if (err) throw err;
        const sources = {
          sources: {
            [srcPath]: data,
          },
        };
        const output = solc.compile(sources, 1);
        if (output.errors && output.errors.length) throw output.errors;
        if (output.formal && output.formal.errors && output.formal.errors.length) {
          console.warn('solidity compile formal errors: ', output.formal);
        }
        resolve(output.contracts[Object.keys(output.contracts)[0]]);
      });
    });
  },
  sendTransaction(code) {
    return callRPC('eth_sendTransaction', [{
      from: config.sender,
      data: `0x${code}`,
      gas: '0xdbba0',
    }]);
  },
}
