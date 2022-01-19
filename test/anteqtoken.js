const AnteqToken = artifacts.require('./AnteqToken.sol');
// const Web3 = require('./client/web3');

contract('AnteqToken', (accounts) => {
  let anteqTokenInstance;

  before(async () => {
    anteqTokenInstance = await AnteqToken.new();
  });

  it('Should name to "AnteqToken".', async () => {
    const name = await anteqTokenInstance.name();
    assert.equal(name, 'AnteqToken', 'The name was not "AnteqToken".');
  });

  it('Should symbol to "ANQ".', async () => {
    const symbol = await anteqTokenInstance.symbol();
    assert.equal(symbol, 'ANQ', 'The name was not "ANQ".');
  });

  it('Should total suply equal to 1mln tokens.', async () => {
    const totalSupply = await anteqTokenInstance.totalSupply();
    assert.equal(
      web3.utils.fromWei(totalSupply, 'ether'),
      1000000,
      'The total suply not equal to 1mln tokens.',
    );
  });

  it('Should decimal equal to 18.', async () => {
    const decimals = await anteqTokenInstance.decimals();
    assert.equal(decimals, 18, 'The decimal was not equal to 18".');
  });

  it('Deplyer address should have 1mln tokens', async () => {
    const deployerBalance = await anteqTokenInstance.balanceOf(accounts[0]);
    console.log(web3.utils.fromWei(deployerBalance, 'ether'));

    assert.equal(
      web3.utils.fromWei(deployerBalance, 'ether'),
      1000000,
      'Deployer address should have 1mln tokens.',
    );
  });
});
