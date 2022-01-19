const AnteqToken = artifacts.require('./AnteqToken.sol');
// const Web3 = require('./client/web3');

contract('AnteqToken', (accounts) => {
  let anteqTokenInstance;

  before(async () => {
    anteqTokenInstance = await AnteqToken.new();
  });

  describe('Deployed contract', async () => {
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

      assert.equal(
        web3.utils.fromWei(deployerBalance, 'ether'),
        1000000,
        'Deployer address should have 1mln tokens.',
      );
    });
  });

  describe('Transfer tokens', async () => {
    it('Deployer can send tokens to another address', async () => {
      const amount = web3.utils.toBN(1000);
      const to = accounts[1];

      await anteqTokenInstance.transfer(to, web3.utils.toWei(amount, 'ether'), {
        from: accounts[0],
      });

      const balanseRecipient = await anteqTokenInstance.balanceOf(to);
      assert.equal(
        web3.utils.fromWei(balanseRecipient, 'ether'),
        1000,
        'Recipient balanse is right after transfer',
      );
    });
  });
});
