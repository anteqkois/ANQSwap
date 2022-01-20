const { assert } = require('chai');

const AnteqToken = artifacts.require('./AnteqToken.sol');

require('chai').use(require('chai-as-promised')).should();

contract('AnteqToken', (accounts) => {
  let anteqToken;

  before(async () => {
    anteqToken = await AnteqToken.new();
  });

  describe('Deployed contract', async () => {
    it('Should name to "AnteqToken".', async () => {
      const name = await anteqToken.name();
      assert.equal(name, 'AnteqToken', 'The name was not "AnteqToken".');
    });

    it('Should symbol to "ANQ".', async () => {
      const symbol = await anteqToken.symbol();
      assert.equal(symbol, 'ANQ', 'The name was not "ANQ".');
    });

    it('Should total suply equal to 1mln tokens.', async () => {
      const totalSupply = await anteqToken.totalSupply();
      assert.equal(web3.utils.fromWei(totalSupply, 'ether'), 1000000, 'The total suply not equal to 1mln tokens.');
    });

    it('Should decimal equal to 18.', async () => {
      const decimals = await anteqToken.decimals();
      assert.equal(decimals, 18, 'The decimal was not equal to 18".');
    });

    it('Deplyer address should have 1mln tokens', async () => {
      const deployerBalance = await anteqToken.balanceOf(accounts[0]);

      assert.equal(web3.utils.fromWei(deployerBalance, 'ether'), 1000000, 'Deployer address should have 1mln tokens.');
    });
  });

  describe('Transfer tokens by "transfer" function', async () => {
    it('Deployer can send tokens to another address', async () => {
      const { logs } = await anteqToken.transfer(accounts[1], web3.utils.toWei(web3.utils.toBN(1000), 'ether'), {
        from: accounts[0],
      });

      assert.equal(logs[0].args._from, accounts[0]);
      assert.equal(logs[0].args._to, accounts[1]);
      assert.equal(web3.utils.fromWei(logs[0].args._value, 'ether'), 1000);

      const balanseRecipient = await anteqToken.balanceOf(accounts[1]);
      assert.equal(web3.utils.fromWei(balanseRecipient, 'ether'), 1000, 'Recipient balanse is right after transfer');
    });
    it("Sender doesn't do transfer if havn't enought token", async () => {
      await anteqToken.transfer(accounts[0], web3.utils.toWei(web3.utils.toBN(1001), 'ether'), {
        from: accounts[1],
      }).should.be.rejected;
    });
  });

  describe('Transfer tokens by "transferFrom" function', async () => {
    it("Sender can't transfer token from another address if havn't allowance", async () => {
      await anteqToken.transferFrom(accounts[1], accounts[2], web3.utils.toWei(web3.utils.toBN(1000), 'ether'), {
        from: accounts[0],
      }).should.be.rejected;
    });

    it("Sender can't transfer token from another address if want send to much than allowance approw", async () => {
      const { logs } = await anteqToken.approve(accounts[0], web3.utils.toWei(web3.utils.toBN(1000), 'ether'), {
        from: accounts[1],
      });

      assert.equal(logs[0].args._owner, accounts[1]);
      assert.equal(logs[0].args._spender, accounts[0]);
      assert.equal(web3.utils.fromWei(logs[0].args._value, 'ether'), 1000);

      await anteqToken.transferFrom(accounts[1], accounts[2], web3.utils.toWei(web3.utils.toBN(1001), 'ether'), {
        from: accounts[0],
      }).should.be.rejected;
    });

    it('Sender can transfer token from another address if have allowance', async () => {
      const { logs } = await anteqToken.transferFrom(accounts[1], accounts[2], web3.utils.toWei(web3.utils.toBN(1000), 'ether'), {
        from: accounts[0],
      });

      assert.equal(logs[0].args._from, accounts[1]);
      assert.equal(logs[0].args._to, accounts[2]);
      assert.equal(web3.utils.fromWei(logs[0].args._value, 'ether'), 1000);

      const balance = await anteqToken.balanceOf(accounts[2]);
      assert.equal(web3.utils.fromWei(balance), 1000, 'Tokens can be transfer by another address by allowance');
    });
  });
});
