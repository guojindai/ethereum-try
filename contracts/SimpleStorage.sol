pragma solidity ^0.4.0;

contract SimpleStorage {
  uint storedData;

  function set(uint x) {
    storedData = x;
  }

  function get() constant returns (unit) {
    return storedData;
  }
}
