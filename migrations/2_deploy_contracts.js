const AnteqToken = artifacts.require('./AnteqToken.sol');
const ANQSwap = artifacts.require('./ANQSwap.sol');

module.exports = async function(deployer) {
  await deployer.deploy(AnteqToken);
  const token = await AnteqToken.deployed();
  await deployer.deploy(ANQSwap, token.address, 10);
};
