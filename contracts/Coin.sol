pragma solidity ^0.4.0;

contract Coin {
  address public minter;
  mapping (address => uint) public balances;

  event Sent(address from, address to, uint amount);
  event Print(address who, uint balance);

  function Coin() {
    minter = msg.sender;
  }

  function mint(address receiver, uint amount) {
    if (msg.sender != minter) return;
    balances[receiver] += amount;
  }

  function send(address sender, address to, uint amount) {
    if (balances[sender] < amount) return;
    balances[sender] -= amount;
    balances[to] += amount;
    Sent(sender, to, amount);
  }

  function getBalance(address who) returns (uint) {
    Print(who, balances[who]);
    return balances[who];
  }
}
