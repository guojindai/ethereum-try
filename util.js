require('colors');
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
    console.log(`callRPC: ${method}`.green);
    console.log('callRPC params:'.green);
    console.log(params);
    request.post(config.node, {
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: method,
        id: Date.now(),
        params,
      }),
    }, (err, res, bodyStr) => {
      const body = bodyStr ? JSON.parse(bodyStr) : {};
      const errObj = err || body.error;
      if (errObj) {
        throw errObj;
      }
      console.log('callRPC response:'.green);
      console.log(body);
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
          console.warn('solidity compile formal errors: '.yellow, output.formal);
        }
        resolve(output.contracts[Object.keys(output.contracts)[0]]);
      });
    });
  },
  sendTransaction(code) {
    return new Promise((resolve) => {
      callRPC('eth_sendTransaction', [{
        from: config.sender,
        data: `0x${code}`,
        gas: '0xdbba0',
      }]).then((txData) => {
        let runs = 0;
        const txHash = txData.result;
        const intervalId = setInterval(() => {
          if (runs ++ < 100) {
            console.log(`sendTransaction eth_getTransactionReceipt ${runs}, ${txHash}`.green);
            callRPC('eth_getTransactionReceipt', [txHash])
              .then((receiptData) => {
                if (receiptData.result) {
                  clearInterval(intervalId);
                  resolve(receiptData);
                }
              });
          } else {
            clearInterval(intervalId);
            console.error('sendTransaction fail'.red);
          }
        }, 2000);
      });
    });
  },
}
