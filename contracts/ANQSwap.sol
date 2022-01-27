// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AnteqToken.sol";

contract ANQSwap is Ownable {
    AnteqToken public anteqToken;
    uint256 public totalLiquidity;
    string public name = "AnteqToken Swap";

    constructor(AnteqToken _token) {
        anteqToken = _token;
    }

    event BuyTokens(address indexed _buyer, uint256 _amount);
    event SellTokens(address indexed _seller, uint256 _amount);

    function addInitialLiquidity(uint256 _tokenAmount)external payable {
        require(_tokenAmount <= anteqToken.balanceOf(msg.sender), 'Not enought ANQ on wallet');
        anteqToken.transferFrom(msg.sender, address(this), _tokenAmount);
        totalLiquidity = _tokenAmount * msg.value;
    }
    // function addInitialLiquidity(uint256 _tokenAmount)external payable returns(uint256 _totalLiquidity){
    //     require(msg.value <= msg.sender.balance, 'Not enought ETH on wallet');
    //     require(_tokenAmount <= anteqToken.balanceOf(msg.sender), 'Not enought ANQ on wallet');
    //     anteqToken.transferFrom(msg.sender, address(this), _tokenAmount);
    //     totalLiquidity = _tokenAmount * msg.value;
    //     return totalLiquidity;
    // }
    
    function changeTokenAddress(AnteqToken _token)
        external
        onlyOwner
        returns (bool success)
    {
        anteqToken = _token;
        return true;
    }

    // function buyTokens() external payable {
    //     uint256 amountANQ = msg.value * rate;
    //     require(
    //         anteqToken.balanceOf(address(this)) >= amountANQ,
    //         "AnteqToken Swap havn't enought ANQ."
    //     );
    //     anteqToken.transfer(msg.sender, amountANQ);
    //     emit BuyTokens(msg.sender, amountANQ);
    // }

    // function sellTokens(uint256 _value) public {
    //     require(
    //         anteqToken.balanceOf(msg.sender) >= _value,
    //         "You doesn't have enought AnteqToken."
    //     );
    //     uint256 etherToSendBack = _value / rate;
    //     require(
    //         address(this).balance >= etherToSendBack,
    //         "AnteqToken Swap doesn't have enought Ether to buy yours token."
    //     );
    //     anteqToken.transferFrom(msg.sender, address(this), _value);
    //     payable(msg.sender).transfer(etherToSendBack);
    //     emit SellTokens(msg.sender, _value);
    // }

    // ADD WITHDRAW FUNCION
    // function withdraw() external onlyOwner returns (bool success){
    //     payable(owner().address).transfer();
    // }
}
