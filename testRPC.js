const request = require('request');
const fs = require('fs');
const util = require('util')
/* eth_coinbase */
// request.post('http://localhost:8545', {
//   body: JSON.stringify({
//     "jsonrpc": "2.0",
//     "method": "eth_coinbase",
//     "id": Date.now(),
//   }),
// }, (err, res, body) => {
//   console.log(util.inspect(JSON.parse(body), false, null));
// });

/* eth_compileSolidity */
// const code = fs.readFileSync('contracts/Multiply7.sol', { encoding: 'utf8' });
// request.post('http://localhost:8545', {
//   body: JSON.stringify({
//     "jsonrpc": "2.0",
//     "method": "eth_compileSolidity",
//     "id": Date.now(),
//     "params": [code],
//   }),
// }, (err, res, body) => {
//   console.log(util.inspect(JSON.parse(body), false, null));
// });

/* eth_estimateGas Gas */
// request.post('http://localhost:8545', {
//   body: JSON.stringify({
//     "jsonrpc": "2.0",
//     "method": "eth_estimateGas",
//     "id": Date.now(),
//     "params": [{
//       from: '0x350fbac31ea88d14d6ba483501e31a9a5b60f81d',
//       data: '0x6060604052341561000c57fe5b5b60b38061001b6000396000f300606060405263ffffffff60e060020a600035041663c6888fa181146020575bfe5b3415602757fe5b60306004356042565b60408051918252519081900360200190f35b6040805160078302815290516000917f24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da919081900360200190a150600781025b9190505600a165627a7a72305820bb06f7b93913360e77915933abae1e9811c9b2c87a9c7456f6efb9b2bbfaad510029',
//     }],
//   }),
// }, (err, res, body) => {
//   console.log(util.inspect(JSON.parse(body), false, null));
// });

/* eth_sendTransaction Gas */
// request.post('http://localhost:8545', {
//   body: JSON.stringify({
//     "jsonrpc": "2.0",
//     "method": "eth_sendTransaction",
//     "id": Date.now(),
//     "params": [{
//       from: '0x350fbac31ea88d14d6ba483501e31a9a5b60f81d',
//       data: '0x6060604052341561000c57fe5b5b60b38061001b6000396000f300606060405263ffffffff60e060020a600035041663c6888fa181146020575bfe5b3415602757fe5b60306004356042565b60408051918252519081900360200190f35b6040805160078302815290516000917f24abdb5865df5079dcc5ac590ff6f01d5c16edbc5fab4e195d9febd1114503da919081900360200190a150600781025b9190505600a165627a7a72305820bb06f7b93913360e77915933abae1e9811c9b2c87a9c7456f6efb9b2bbfaad510029',
//       gas: '0x18fac',
//     }],
//   }),
// }, (err, res, body) => {
//   console.log(util.inspect(JSON.parse(body), false, null));
// });

/* eth_getTransactionReceipt Gas */
// request.post('http://localhost:8545', {
//   body: JSON.stringify({
//     "jsonrpc": "2.0",
//     "method": "eth_getTransactionReceipt",
//     "id": Date.now(),
//     "params": ['0x2d0a09e4fbb0e0d3c35b9973906244cb0bbefb312d4c6cddf9b2546934bffcb3'],
//   }),
// }, (err, res, body) => {
//   console.log(util.inspect(JSON.parse(body), false, null));
// });

/* eth_sendTransaction */
// request.post('http://localhost:8545', {
//   body: JSON.stringify({
//     "jsonrpc": "2.0",
//     "method": "eth_sendTransaction",
//     "id": Date.now(),
//     "params": [{
//       from: '0x350fbac31ea88d14d6ba483501e31a9a5b60f81d',
//       to: '0x3b5f505a16ebd9488be46538720b10e20827b562',
//       data: '0xc6888fa10000000000000000000000000000000000000000000000000000000000000006',
//     }],
//   }),
// }, (err, res, body) => {
//   console.log(util.inspect(JSON.parse(body), false, null));
// });

/* eth_getTransactionReceipt Gas */
request.post('http://localhost:8545', {
  body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "eth_getTransactionReceipt",
    "id": Date.now(),
    "params": ['0xc02bcad575136230eda7d2232300fc9062a7efe8f5d7308030db7d3e1b82554f'],
  }),
}, (err, res, body) => {
  console.log(util.inspect(JSON.parse(body), false, null));
});
