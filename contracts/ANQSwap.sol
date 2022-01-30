// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./AnteqToken.sol";

contract ANQSwap is Ownable {
    using SafeMath for uint256;

    AnteqToken public anteqToken;
    uint256 public totalLiquidityFormula;
    string public name = "AnteqToken Swap";

    constructor(AnteqToken _token) {
        anteqToken = _token;
    }

    event BuyTokens(address indexed _buyer, uint256 _amount);
    event SellTokens(address indexed _seller, uint256 _amount);
    event debugN(string _info, uint256 _number);

    function addInitialLiquidity(uint256 _tokenAmount) external payable {
        require(
            _tokenAmount <= anteqToken.balanceOf(msg.sender),
            "Not enought ANQ on wallet"
        );
        anteqToken.transferFrom(msg.sender, address(this), _tokenAmount);
        totalLiquidityFormula = _tokenAmount.mul(msg.value);
    }

    function changeTokenAddress(AnteqToken _token)
        external
        onlyOwner
        returns (bool success)
    {
        anteqToken = _token;
        return true;
    }

    function predirectAmountOfBuyTokens(uint256 _ETHAmount)
        public
        view
        returns (uint256 predirectANQAmount)
    {
        uint256 amountANQToTransfer = _getAmountOut(
            _ETHAmount,
            address(this).balance,
            anteqToken.balanceOf(address(this))
        );
        // uint256 amountANQToTransfer = (anteqToken.balanceOf(address(this)) *
        //     _ETHAmount) / (address(this).balance + _ETHAmount);
        require(
            anteqToken.balanceOf(address(this)) >= amountANQToTransfer,
            "AnteqToken Swap havn't enought ANQ."
        );
        return amountANQToTransfer;
    }

    function _getAmountOut(
        uint256 _amountTokenIn,
        uint256 _reserveIn,
        uint256 _reserveOut
    ) internal pure returns (uint256 amountTokenOut) {
        require(_amountTokenIn > 0, "Amount of tokens in can't be equal 0");
        uint256 amountInWithoutFee = _amountTokenIn.mul(1000); // With fee 0,3% ==> mul(997)
        uint256 numerator = amountInWithoutFee.mul(_reserveOut);
        uint256 denominator = _reserveIn.mul(1000).add(amountInWithoutFee);
        amountTokenOut = numerator.div(denominator);
    }

    function buyTokens() external payable {
        uint256 amountANQToTransfer = _getAmountOut(
            msg.value,
            address(this).balance.sub(msg.value),
            anteqToken.balanceOf(address(this))
        );

        uint256 amountANQInSwapAfterTransfer = anteqToken.balanceOf(
            address(this)
        ).sub(amountANQToTransfer);

        require(
            amountANQInSwapAfterTransfer.mul(address(this).balance) >=
                totalLiquidityFormula,
            "Invalid final tokens amount"
        );
        totalLiquidityFormula = amountANQInSwapAfterTransfer.mul(
            address(this).balance
        );

        anteqToken.transfer(msg.sender, amountANQToTransfer);
        emit BuyTokens(msg.sender, amountANQToTransfer);
    }
    // function buyTokens() external payable {
    //     uint256 amountANQToTransfer = (anteqToken.balanceOf(address(this)) *
    //         msg.value) / (address(this).balance);
    //     require(
    //         anteqToken.balanceOf(address(this)) >= amountANQToTransfer,
    //         "AnteqToken Swap havn't enought ANQ."
    //     );
    //     uint256 amountANQInSwapAfterBuy = (anteqToken.balanceOf(address(this)) -
    //         amountANQToTransfer);

    //     uint256 newTotalLiquidityFormula = (amountANQInSwapAfterBuy * (address(this).balance));

    //     // uint256 diffLiquidityFormula = totalLiquidityFormula - newTotalLiquidityFormula;

    //     // uint256 newANQInSwap = (totalLiquidityFormula - diffLiquidityFormula)l;

    //     emit debugN("balanceANQOfSwap", anteqToken.balanceOf(address(this)));
    //     emit debugN("anteqToken.balanceOf(address(this)) * msg.value", anteqToken.balanceOf(address(this)) *
    //         msg.value);
    //     emit debugN("ETH in Swap", (address(this).balance));

    //     emit debugN("liq before purchase", totalLiquidityFormula);
    //     emit debugN("liq after purchase", newTotalLiquidityFormula);
    //     emit debugN("ANQ amount In Swap", anteqToken.balanceOf(address(this)));
    //     emit debugN("amountANQInSwapAfterBuy", amountANQInSwapAfterBuy);
    //     emit debugN("amountBuyANQ", amountANQToTransfer);

    //     emit debugN("noweANQ", (totalLiquidityFormula - (newTotalLiquidityFormula - totalLiquidityFormula))/address(this).balance);
    //     emit debugN("noweK", ((totalLiquidityFormula - (newTotalLiquidityFormula - totalLiquidityFormula))/address(this).balance)*address(this).balance);

    //     // require(
    //     //     amountANQInSwapAfterBuy * address(this).balance ==
    //     //         totalLiquidityFormula,
    //     //     "Wrong total liquidity after purchase"
    //     // );

    //     // anteqToken.transfer(msg.sender, amountANQToTransfer);
    //     emit BuyTokens(msg.sender, amountANQToTransfer);
    // }

    // function buyTokens() external payable {
    //     // uint256 amountANQAfterBuy = totalLiquidityFormula /
    //     //     address(this).balance;
    //     uint256 amountANQToTransfer = (anteqToken.balanceOf(address(this)) *
    //         msg.value) / (address(this).balance);
    //     require(
    //         anteqToken.balanceOf(address(this)) >= amountANQToTransfer,
    //         "AnteqToken Swap havn't enought ANQ."
    //     );
    //     uint256 amountANQInSwapAfterBuy = (anteqToken.balanceOf(address(this)) -
    //         amountANQToTransfer);

    //     uint256 newTotalLiquidityFormula = (amountANQInSwapAfterBuy * (address(this).balance));
    //     uint256 diffLiquidityFormula = totalLiquidityFormula - newTotalLiquidityFormula;

    //     uint256 newANQInSwap = (totalLiquidityFormula - diffLiquidityFormula)l;

    //     emit debugN("liq after purchase", newTotalLiquidityFormula);
    //     emit debugN("ANQ amount In Swap", anteqToken.balanceOf(address(this)));
    //     emit debugN("amountANQInSwapAfterBuy", amountANQInSwapAfterBuy);
    //     emit debugN("ETH amount in Swap", address(this).balance);
    //     emit debugN("amountBuyANQ", amountANQToTransfer);

    //     // require(
    //     //     amountANQInSwapAfterBuy * address(this).balance ==
    //     //         totalLiquidityFormula,
    //     //     "Wrong total liquidity after purchase"
    //     // );

    //     anteqToken.transfer(msg.sender, amountANQToTransfer);
    //     emit BuyTokens(msg.sender, amountANQToTransfer);
    // }
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
