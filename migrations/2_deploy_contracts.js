const AnteqToken = artifacts.require('./AnteqToken.sol');
const ANQSwap = artifacts.require('./ANQSwap.sol');

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(AnteqToken);
  const token = await AnteqToken.deployed();
  const swap = await deployer.deploy(ANQSwap, token.address, 10);
  await token.transfer(swap.address, '999900000000000000000000');
  await token.transfer(accounts[0], '100000000000000000000');
};
