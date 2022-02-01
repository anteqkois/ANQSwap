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
		require(_tokenAmount <= anteqToken.balanceOf(msg.sender), "Not enought ANQ on wallet.");
		anteqToken.transferFrom(msg.sender, address(this), _tokenAmount);
		totalLiquidityFormula = _tokenAmount.mul(msg.value);
	}

	function changeTokenAddress(AnteqToken _token) external onlyOwner returns (bool success) {
		anteqToken = _token;
		return true;
	}

	function predirectAmountOfBuyTokens(uint256 _ETHAmount) public view returns (uint256 predirectANQAmount) {
		uint256 amountANQToTransfer = _getAmountOut(_ETHAmount, address(this).balance, anteqToken.balanceOf(address(this)));
		// uint256 amountANQToTransfer = (anteqToken.balanceOf(address(this)) *
		//     _ETHAmount) / (address(this).balance + _ETHAmount);
		require(anteqToken.balanceOf(address(this)) >= amountANQToTransfer, "AnteqToken Swap havn't enought ANQ.");
		return amountANQToTransfer;
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
		totalLiquidityFormula = amountANQInSwapAfterTransfer.mul(address(this).balance);

		anteqToken.transfer(msg.sender, amountANQToTransfer);
		emit BuyTokens(msg.sender, amountANQToTransfer);
	}

	function sellTokens(uint256 _value) external {
		require(anteqToken.balanceOf(msg.sender) >= _value, "You havn't enought ANQ tokens.");
		uint256 amountETHToTransfer = _getAmountOut(_value, anteqToken.balanceOf(address(this)), address(this).balance);
		require(address(this).balance >= amountETHToTransfer, "Swap doesn't have enought Ether to buy yours ANQ tokens.");

		uint256 amountANQInSwapAfterTransfer = anteqToken.balanceOf(address(this)).add(_value);

		require(
			amountANQInSwapAfterTransfer.mul(address(this).balance - amountETHToTransfer) >= totalLiquidityFormula,
			"Invalid final tokens amount."
		);

		emit SellTokens(msg.sender, _value);
		emit debugN("new K", amountANQInSwapAfterTransfer.mul(address(this).balance - amountETHToTransfer));

		anteqToken.transferFrom(msg.sender, address(this), _value);
		payable(msg.sender).transfer(amountETHToTransfer);

		//TODO set new K
		emit debugN("amountETHToTransfer", amountETHToTransfer);
		emit debugN("amountANQInSwapAfterTransfer", amountANQInSwapAfterTransfer);
		emit debugN("old K", totalLiquidityFormula);
		emit debugN("ETH i nSwao after", address(this).balance);
	}

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
