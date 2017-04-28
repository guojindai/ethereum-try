require('colors');
const solc = require('solc');
const fs = require('fs');
const SHA3 = require('sha3');
const abiUtil = require('ethereumjs-abi');
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

const util = {
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
        const compiledData = output.contracts[Object.keys(output.contracts)[0]];
        console.log('compileSolidity compiledData'.green);
        console.log(compiledData);
        resolve(compiledData);
      });
    });
  },
  sendTransaction(data, to) {
    return new Promise((resolve) => {
      const txObject = {
        from: config.sender,
        gas: '0xdbba0',
        data: data,
      };
      if (to) {
        txObject.to = to;
      }
      callRPC('eth_sendTransaction', [txObject]).then((txData) => {
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
  callContractFunction(contractAddress, abi, funcName, ...funcArgs) {
    const funcAbi = util.getFunctionAbi(abi, funcName);
    const argTypes = funcAbi.inputs.map(input => input.type);
    const funcSignature = util.signFunction(funcAbi, argTypes, funcName);
    const argsSignature = util.signArguments(argTypes, funcArgs);
    const data = util.ensure0X(funcSignature + argsSignature);
    console.log('callContractFunction'.green);
    console.log('funcName: '.blue, funcName);
    console.log('funcArgs: '.blue, funcArgs);
    console.log('funcSignature: '.blue, funcSignature);
    console.log('argsSignature: '.blue, argsSignature);
    console.log('data: '.blue, data);
    return util.sendTransaction(data, contractAddress)
      .then((txRes) => {
        if (txRes.result && txRes.result.logs && txRes.result.logs.length) {
          console.log('callContractFunction logs'.green);
          console.log(txRes.result.logs);
          txRes.result.logsDecoded = util.decodeLogs(abi, txRes.result.logs);
          console.log('callContractFunction logsDecoded'.green);
          console.log(txRes.result.logsDecoded);
        }
        return txRes;
      });
  },
  signFunction(funcAbi, argTypes, funcName) {
    const funcSelector = `${funcAbi.name}(${argTypes.join(',')})`;
    console.log(`signFunction funcSelector = ${funcSelector}`.green);
    return util.sha3(funcSelector).substr(0, 8);
  },
  signArguments(argTypes, funcArgs) {
    return abiUtil.rawEncode(argTypes, funcArgs).toString('hex')
  },
  decodeLogs(abi, logs) {
    const logsDecoded = [];
    logs.forEach((log) => {
      for(let i = 0;i < abi.length; i += 1) {
        const eventInputTypes = abi[i].inputs.map(input => input.type);
        const eventSelector = `${abi[i].name}(${eventInputTypes.join(',')})`;
        const eventSelectorSHA3 = util.ensure0X(util.sha3(eventSelector));
        if (abi[i].type === 'event' && eventSelectorSHA3 === log.topics[0]) {
          const logData = util.ensureNo0X(log.data);
          console.log('rawDecode'.green);
          console.log('eventInputTypes: '.blue, eventInputTypes);
          console.log('data: '.blue, logData);
          logsDecoded.push(abiUtil.rawDecode(eventInputTypes, new Buffer(logData, 'hex')));
          break;
        }
      }
    });
    return logsDecoded;
  },
  getFunctionAbi(abi, funcName) {
    let funcAbi;
    for(let i = 0; i < abi.length; i += 1) {
      if(abi[i].name === funcName && abi[i].type === 'function') {
        funcAbi = abi[i];
        break;
      }
    }
    if (funcAbi) {
      console.log(`getFunctionAbi ${funcName}`.green);
      console.log(funcAbi);
      return funcAbi;
    } else {
      console.error(`can not find funcAbi with function name ${funcName} in abi`.red);
      console.error(abi);
      throw new Error('can not find funcAbi');
    }
  },
  ensure0X(val) {
    return val.substr(0, 2) === '0x' ? val : `0x${val}`;
  },
  ensureNo0X(val) {
    return val.substr(0, 2) === '0x' ? val.substr(2) : val;
  },
  sha3(val) {
    const sha3Hash = new SHA3.SHA3Hash(256);
    sha3Hash.update(val);
    return sha3Hash.digest('hex');
  },
};

module.exports = util;
