pragma solidity >=0.5.0 <0.9.0;

import "./AnteqToken.sol";

contract ANQSwap {
    AnteqToken public anteqToken;
    uint256 public rate;
    string public name = 'AnteqToken Swap';

    constructor(AnteqToken _token, uint256 _rate) public {
        anteqToken = _token;
        rate = _rate;
    }

    event Buy

    // add onlyOwner modifier
    function setTokenAddress(AnteqToken _token) public returns (bool success) {
        anteqToken = _token;
        return true;
    }

    function buyTokens() public payable{
        uint256 amountAnteqToken = msg.value * rate;
        require(anteqToken.balanceOf(address(this)) >= amountAnteqToken, "AnteqToken Swap havn't enought ANQ.");
        anteqToken.transfer(msg.sender, amountAnteqToken);
        // emit event
    }

    function sellTokens(uint256 _value) public {
        require(anteqToken.balanceOf(msg.sender) >= _value, "You doesn't have enought AnteqToken.");
        uint256 etherToSendBack = _value/rate;
        require(address(this).balance >= etherToSendBack, "AnteqToken Swap doesn't have enought Ether to buy yours token.");
        anteqToken.transferFrom(msg.sender, address(this), _value);
        msg.sender.transfer(etherToSendBack);
        //emit event
    }
}
