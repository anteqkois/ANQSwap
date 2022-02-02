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

	event BuyTokens(address indexed _buyer, uint256 _amountANQ, uint256 _amountETH);
	event SellTokens(address indexed _seller, uint256 _amountANQ,  uint256 _amountETH);
	event debugN(string _info, uint256 _number);

	function addInitialLiquidity(uint256 _tokenAmount) external payable {
		require(_tokenAmount <= anteqToken.balanceOf(msg.sender), "Not enought ANQ on wallet.");
		anteqToken.transferFrom(msg.sender, address(this), _tokenAmount);
		totalLiquidityFormula = _tokenAmount.mul(msg.value);
	}

	function changeTokenAddress(AnteqToken _token) external onlyOwner returns (bool success) {
		anteqToken = _token;
		return true;
	}

	function predirectExactAmountOut(uint256 _amountIn, bool _buy) public view returns (uint256 amountToTransfer) {
		uint256 reserveIn = (_buy ? address(this).balance : anteqToken.balanceOf(address(this)));
		uint256 reserveOut = (_buy ? anteqToken.balanceOf(address(this)) : address(this).balance);
		amountToTransfer = _getAmountOut(_amountIn, reserveIn, reserveOut);
		// uint256 amountToTransfer = (anteqToken.balanceOf(address(this)) *
		//     _amountIn) / (address(this).balance + _amountIn);
		require(reserveOut >= amountToTransfer, "AnteqToken Swap havn't enought token to send back.");
	}

	function _getAmountOut(
		uint256 _amountTokenIn,
		uint256 _reserveIn,
		uint256 _reserveOut
	) internal pure returns (uint256 amountTokenOut) {
		require(_amountTokenIn > 0, "Amount of tokens in can't be equal 0.");

		// amountTokenOut = (_reserveOut * _amountTokenIn) / (_reserveIn + _amountTokenIn);

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

		uint256 amountANQInSwapAfterTransfer = anteqToken.balanceOf(address(this)).sub(amountANQToTransfer);

		require(
			amountANQInSwapAfterTransfer.mul(address(this).balance) >= totalLiquidityFormula,
			"Invalid final tokens amount."
		);

		anteqToken.transfer(msg.sender, amountANQToTransfer);

		totalLiquidityFormula = amountANQInSwapAfterTransfer.mul(address(this).balance);
		emit BuyTokens(msg.sender, amountANQToTransfer, msg.value);
	}

	function sellTokens(uint256 _value) external {
		require(anteqToken.balanceOf(msg.sender) >= _value, "You havn't enought ANQ tokens.");
		uint256 amountETHToTransfer = _getAmountOut(_value, anteqToken.balanceOf(address(this)), address(this).balance);
		require(
			address(this).balance >= amountETHToTransfer,
			"Swap doesn't have enought Ether to buy yours ANQ tokens."
		);

		uint256 amountANQInSwapAfterTransfer = anteqToken.balanceOf(address(this)).add(_value);

		require(
			amountANQInSwapAfterTransfer.mul(address(this).balance - amountETHToTransfer) >= totalLiquidityFormula,
			"Invalid final tokens amount."
		);

		anteqToken.transferFrom(msg.sender, address(this), _value);
		payable(msg.sender).transfer(amountETHToTransfer);

		totalLiquidityFormula = amountANQInSwapAfterTransfer.mul(address(this).balance - amountETHToTransfer);
		emit SellTokens(msg.sender, _value, amountETHToTransfer);
	}

	// ADD WITHDRAW FUNCION
	// function withdraw() external onlyOwner returns (bool success){
	//     payable(owner().address).transfer();
	// }
}
