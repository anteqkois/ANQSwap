// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./AnteqToken.sol";

contract ANQSwap is Ownable {
	using SafeMath for uint256;

	AnteqToken public anteqToken;
	uint256 public liquidityFormula;
	string public name = "AnteqToken Swap";

	constructor(AnteqToken _token) {
		anteqToken = _token;
	}

	event BuyTokens(address indexed _buyer, uint256 _amountETH, uint256 _amountANQ);
	event SellTokens(address indexed _seller, uint256 _amountETH, uint256 _amountANQ);
	event logN(string _info, uint256 _number);

	function addInitialLiquidity(uint256 _tokenAmount) external payable {
		require(_tokenAmount <= anteqToken.balanceOf(msg.sender), "Not enought ANQ on wallet");
		anteqToken.transferFrom(msg.sender, address(this), _tokenAmount);
		liquidityFormula = _tokenAmount.mul(msg.value);
	}

	function setTokenAddress(AnteqToken _token) external onlyOwner returns (bool success) {
		anteqToken = _token;
		return true;
	}

	// TODO replace code to recognize by address if this is buy or sell transaction if it possible ?
	// Add require to one tokens amount must be 0
	function predirectExactOut(uint256 _amountETHIn, uint256 _amountANQIn) external view returns (uint256 amountOut) {
		(uint256 reserve0, uint256 reserve1) = _getReserve();

		require(_amountETHIn > 0 || _amountANQIn > 0, "Invalid in tokens");

		// Check which token will in
		uint256 amountIn = _amountETHIn > 0 ? _amountETHIn : _amountANQIn;
		(uint256 reserveIn, uint256 reserveOut) = _amountETHIn > 0 ? (reserve0, reserve1) : (reserve1, reserve0);
		amountOut = _getAmountOut(amountIn, reserveIn, reserveOut);
		require(reserveOut >= amountOut, "Invalid amount of out tokens");
	}

	function predirectExactIn(uint256 _amountETHOut, uint256 _amountANQOut) external view returns (uint256 amountIn) {
		(uint256 reserve0, uint256 reserve1) = _getReserve();
		require(_amountETHOut > 0 || _amountANQOut > 0, "Invalid out tokens");

		// Check which token will in
		uint256 amountOut = _amountETHOut > 0 ? _amountETHOut : _amountANQOut;
		(uint256 reserveIn, uint256 reserveOut) = _amountETHOut > 0 ? (reserve1, reserve0) : (reserve0, reserve1);
		amountIn = _getAmountIn(amountOut, reserveIn, reserveOut);
		require(reserveOut >= amountOut, "Invalid amount of out tokens");
	}

	function _getReserve() internal view returns (uint256 reserve0, uint256 reserve1) {
		reserve0 = address(this).balance;
		reserve1 = anteqToken.balanceOf(address(this));
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

	function _getAmountIn(
		uint256 _amountTokenOut,
		uint256 _reserveIn,
		uint256 _reserveOut
	) internal pure returns (uint256 amountTokenIn) {
		require(_amountTokenOut > 0, "Amount of tokens in can't be equal 0");

		uint256 numerator = _reserveIn.mul(_amountTokenOut).mul(1000);
		uint256 denominator = _reserveOut.sub(_amountTokenOut).mul(1000);
		// amountTokenIn = (numerator / denominator);
		amountTokenIn = (numerator / denominator).add(1);
	}

	function _swap(
		uint256 _amountETHOut,
		uint256 _amountANQOut,
		address _to
	) internal returns (bool success) {
		require(_amountETHOut > 0 || _amountANQOut > 0, "Invalid out tokens");

		if (_amountETHOut > 0) {
			(bool sent, ) = _to.call{ value: _amountETHOut }("");
			require(sent, "Failed to send Ether back");
		} else {
			bool sent = anteqToken.transfer(_to, _amountANQOut);
			require(sent, "Failed to send AnteqToken back");
		}
		return true;
	}

	// swapExactETHForTokens and swapETHForExactTokens is same becouse can't trigger transfer ETH from account by smart contract, so user must himself tsend ETH to contract
	function swapExactETHForTokens() external payable returns (bool success) {
		(uint256 reserve0, uint256 reserve1) = _getReserve();

		uint256 amountANQOut = _getAmountOut(msg.value, reserve0.sub(msg.value), reserve1);
		require(amountANQOut <= reserve1, "Not enought ANQ tokens in swap");

		uint256 newLiquidityFormula = reserve0.mul(reserve1.sub(amountANQOut));
		require(newLiquidityFormula >= liquidityFormula, "Invalid final tokens amount");

		_swap(uint256(0), amountANQOut, msg.sender);
		liquidityFormula = newLiquidityFormula;
		emit BuyTokens(msg.sender, msg.value, amountANQOut);
		return true;
	}

	function swapExactTokensforETH(uint256 _amountIn) external returns (bool success) {
		(uint256 reserve0, uint256 reserve1) = _getReserve();

		uint256 amountETHOut = _getAmountOut(_amountIn, reserve1, reserve0);

		require(amountETHOut <= reserve0, "Not enought ETH in swap");

		uint256 newLiquidityFormula = reserve0.sub(amountETHOut).mul(reserve1.add(_amountIn));
		require(newLiquidityFormula >= liquidityFormula, "Invalid final tokens amount");

		anteqToken.transferFrom(msg.sender, address(this), _amountIn);
		_swap(amountETHOut, uint256(0), msg.sender);
		liquidityFormula = newLiquidityFormula;
		emit SellTokens(msg.sender, amountETHOut, _amountIn);
		return true;
	}

	function swapTokensforExactETH(uint256 _amountOut) external returns (bool success) {
		(uint256 reserve0, uint256 reserve1) = _getReserve();

		uint256 amountANQIn = _getAmountIn(_amountOut, reserve1, reserve0);

		require((amountANQIn <= reserve1) && (_amountOut <= reserve0), "Not enought tokens in swap");

		uint256 newLiquidityFormula = reserve0.sub(_amountOut).mul(reserve1.add(amountANQIn));
		require(newLiquidityFormula >= liquidityFormula, "Invalid final tokens amount");

		anteqToken.transferFrom(msg.sender, address(this), amountANQIn);
		_swap(_amountOut, uint256(0), msg.sender);
		liquidityFormula = newLiquidityFormula;
		emit SellTokens(msg.sender, _amountOut, amountANQIn);
		return true;
	}
}
