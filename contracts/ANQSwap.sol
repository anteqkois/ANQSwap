// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AnteqToken.sol";

contract ANQSwap is Ownable {
    AnteqToken public anteqToken;
    uint256 public rate;
    string public name = "AnteqToken Swap";

    constructor(AnteqToken _token, uint256 _rate) {
        anteqToken = _token;
        rate = _rate;
    }

    event BuyTokens(address indexed _buyer, uint256 _amount);
    event SellTokens(address indexed _seller, uint256 _amount);

    function setTokenAddress(AnteqToken _token)
        external
        onlyOwner
        returns (bool success)
    {
        anteqToken = _token;
        return true;
    }

    function buyTokens() external payable {
        uint256 amountANQ = msg.value * rate;
        require(
            anteqToken.balanceOf(address(this)) >= amountANQ,
            "AnteqToken Swap havn't enought ANQ."
        );
        anteqToken.transfer(msg.sender, amountANQ);
        emit BuyTokens(msg.sender, amountANQ);
    }

    function sellTokens(uint256 _value) public {
        require(
            anteqToken.balanceOf(msg.sender) >= _value,
            "You doesn't have enought AnteqToken."
        );
        uint256 etherToSendBack = _value / rate;
        require(
            address(this).balance >= etherToSendBack,
            "AnteqToken Swap doesn't have enought Ether to buy yours token."
        );
        anteqToken.transferFrom(msg.sender, address(this), _value);
        payable(msg.sender).transfer(etherToSendBack);
        emit SellTokens(msg.sender, _value);
    }

    // ADD WITHDRAW FUNCION
    // function withdraw() external onlyOwner returns (bool success){
    //     payable(owner().address).transfer();
    // }
}
