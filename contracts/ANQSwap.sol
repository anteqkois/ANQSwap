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

	event BuyTokens(address indexed _buyer, uint256 _amountANQ, uint256 _amountETH);
	event SellTokens(address indexed _seller, uint256 _amountANQ, uint256 _amountETH);
	event debugN(string _info, uint256 _number);

	function addInitialLiquidity(uint256 _tokenAmount) external payable {
		require(_tokenAmount <= anteqToken.balanceOf(msg.sender), "Not enought ANQ on wallet.");
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
        require(_amountETHIn > 0 || _amountETHIn > 0, "Invalid out tokens");

        // Check which token will in
        uint amountIn =  _amountETHIn > 0 ? _amountETHIn : _amountANQIn;
        (uint256 reserveIn, uint256 reserveOut) = _amountETHIn > 0 ? (reserve0, reserve1):(reserve1, reserve0);
		amountOut = _getAmountOut(amountIn, reserveIn, reserveOut);
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

	function _swap(
		uint256 _amountETHOut,
		uint256 _amountANQOut,
		address _to
	) internal returns (bool success) {
		require(_amountETHOut > 0 || _amountANQOut > 0, "Invalid out tokens");

		if (_amountETHOut > 0) {
			(bool sent,) = _to.call{ value: _amountETHOut }("");
			require(sent, "Failed to send Ether back");
		} else {
			bool sent = anteqToken.transfer(_to, _amountANQOut);
			require(sent, "Failed to send AnteqToken back");
		}
        return true;
	}

	function swapExactETHForTokens() external payable returns (bool success) {
		(uint256 reserve0, uint256 reserve1) = _getReserve();

		uint256 amountANQOut = _getAmountOut(msg.value, reserve0.sub(msg.value), reserve1);
		require(amountANQOut <= reserve1, "Not enought ANQ tokens in swap");

		uint256 newLiquidityFormula = reserve0.mul(reserve1.sub(amountANQOut));
		require(newLiquidityFormula >= liquidityFormula, "Invalid final tokens amount.");

		_swap(uint(0), amountANQOut, msg.sender);
		liquidityFormula = newLiquidityFormula;
		emit BuyTokens(msg.sender, amountANQOut, msg.value);
		return true;
	}

	// function buyTokens() external payable {
	// 	uint256 amountANQToTransfer = _getAmountOut(
	// 		msg.value,
	// 		address(this).balance.sub(msg.value),
	// 		anteqToken.balanceOf(address(this))
	// 	);

	// 	uint256 amountANQInSwapAfterTransfer = anteqToken.balanceOf(address(this)).sub(amountANQToTransfer);

	// 	require(
	// 		amountANQInSwapAfterTransfer.mul(address(this).balance) >= liquidityFormula,
	// 		"Invalid final tokens amount."
	// 	);

	// 	anteqToken.transfer(msg.sender, amountANQToTransfer);

	// 	liquidityFormula = amountANQInSwapAfterTransfer.mul(address(this).balance);
	// 	emit BuyTokens(msg.sender, amountANQToTransfer, msg.value);
	// }

	// function sellTokens(uint256 _value) external {
	// 	require(anteqToken.balanceOf(msg.sender) >= _value, "You havn't enought ANQ tokens.");
	// 	uint256 amountETHToTransfer = _getAmountOut(_value, anteqToken.balanceOf(address(this)), address(this).balance);
	// 	require(
	// 		address(this).balance >= amountETHToTransfer,
	// 		"Swap doesn't have enought Ether to buy yours ANQ tokens."
	// 	);

	// 	uint256 amountANQInSwapAfterTransfer = anteqToken.balanceOf(address(this)).add(_value);

	// 	require(
	// 		amountANQInSwapAfterTransfer.mul(address(this).balance - amountETHToTransfer) >= liquidityFormula,
	// 		"Invalid final tokens amount."
	// 	);

	// 	anteqToken.transferFrom(msg.sender, address(this), _value);
	// 	payable(msg.sender).transfer(amountETHToTransfer);

	// 	liquidityFormula = amountANQInSwapAfterTransfer.mul(address(this).balance - amountETHToTransfer);
	// 	emit SellTokens(msg.sender, _value, amountETHToTransfer);
	// }
}
