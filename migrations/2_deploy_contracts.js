const SimpleStorage = artifacts.require("./SimpleStorage.sol");
const AnteqToken = artifacts.require('./AnteqToken.sol');

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(AnteqToken);
};
