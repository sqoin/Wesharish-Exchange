pragma solidity ^0.4.17;

 contract  SimpleStorage  {

   uint public myVariable=11;

 function set(uint x) public {
        myVariable =x;
        
    }
  function get() constant public returns (uint) {
    return myVariable ;
  }
}