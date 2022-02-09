const AnteqToken = artifacts.require('./AnteqToken.sol');
const ANQSwap = artifacts.require('./ANQSwap.sol');

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(AnteqToken);
  const token = await AnteqToken.deployed();
  const swap = await deployer.deploy(ANQSwap, token.address);

  // Add liquidity to swap
  await token.approve(swap.address, web3.utils.toWei(web3.utils.toBN(100_000), 'ether'), { from: accounts[0] });
  await swap.addInitialLiquidity(web3.utils.toWei(web3.utils.toBN(100_000), 'ether'), {
    from: accounts[0],
    value: web3.utils.toWei(web3.utils.toBN(50), 'ether'),
  });
};
