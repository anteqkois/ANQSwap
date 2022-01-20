const { assert, expect } = require('chai');

const AnteqToken = artifacts.require('./AnteqToken.sol');
const ANQSwap = artifacts.require('./ANQSwap.sol');

require('chai').use(require('chai-as-promised')).should();

contract('ANQSwap', (accounts) => {
  let anteqToken, anqSwap;

  before(async () => {
    anteqToken = await AnteqToken.new();
    anqSwap = await ANQSwap.new(anteqToken.address, 10);
    await anteqToken.transfer(anqSwap.address, web3.utils.toWei(web3.utils.toBN(1000000), 'ether'), { from: accounts[0] });
  });

  describe('Deploy ANQSwap', async () => {
    it('ANQSwap had got assigned right token address', async () => {
      const tokenAddressInSwap = await anqSwap.anteqToken();
      assert.equal(anteqToken.address, tokenAddressInSwap);
    });
    it('ANQSwap have 1mln AnteqToken', async () => {
      const balanceOfSwap = await anteqToken.balanceOf(anqSwap.address);
      assert.equal(web3.utils.fromWei(balanceOfSwap, 'ether'), 1000000);
    });
  });

  describe('Change ANQ address', async () => {
    it('Owner can change ANQ address', async () => {
      await anqSwap.setTokenAddress(accounts[2], { from: accounts[0] });
      const tokenAddressInSwap = await anqSwap.anteqToken();
      assert.notEqual(anteqToken.address, tokenAddressInSwap);
      await anqSwap.setTokenAddress(anteqToken.address, { from: accounts[0] });
    });

    it("Other address can't change ANQ address", async () => {
      await anqSwap.setTokenAddress(accounts[2], { from: accounts[2] }).should.be.rejected;
    });
  });

  describe('Buy token', async () => {
    it('User can buy token', async () => {
      const { logs } = await anqSwap.buyTokens({ from: accounts[0], value: web3.utils.toWei(web3.utils.toBN(10), 'ether') });

      const balanceOfUserANQ = await anteqToken.balanceOf(accounts[0]);
      const balanceOfSwapANQ = await anteqToken.balanceOf(anqSwap.address);
      const balanceOfSwapEther = await web3.eth.getBalance(anqSwap.address);

      assert.equal(logs[0].args._buyer, accounts[0]);
      assert.equal(web3.utils.fromWei(logs[0].args._amount, 'ether'), 100);
      assert.equal(web3.utils.fromWei(balanceOfUserANQ, 'ether'), 100);
      assert.equal(web3.utils.fromWei(balanceOfSwapANQ, 'ether'), 999900);
      assert.equal(web3.utils.fromWei(balanceOfSwapEther, 'ether'), 10);
    });

    it("User can't buy token if Swap havn't enought", async () => {
      await anqSwap.buyTokens({ from: accounts[0], value: web3.utils.toWei(web3.utils.toBN(1000001), 'ether') }).should.be
        .rejected;
    });
  });

  describe('Sell token', async () => {
    it('User can sell token', async () => {
      await anteqToken.approve(anqSwap.address, web3.utils.toWei(web3.utils.toBN(100), 'ether'), { from: accounts[0] });
      const { logs } = await anqSwap.sellTokens(web3.utils.toWei(web3.utils.toBN(100), 'ether'), { from: accounts[0] });

      const balanceOfUserANQ = await anteqToken.balanceOf(accounts[0]);
      const balanceOfSwapANQ = await anteqToken.balanceOf(anqSwap.address);
      const balanceOfSwapEther = await web3.eth.getBalance(anqSwap.address);

      assert.equal(logs[0].args._seller, accounts[0]);
      assert.equal(web3.utils.fromWei(logs[0].args._amount, 'ether'), 100);
      assert.equal(web3.utils.fromWei(balanceOfUserANQ, 'ether'), 0);
      assert.equal(web3.utils.fromWei(balanceOfSwapANQ, 'ether'), 1000000);
      assert.equal(web3.utils.fromWei(balanceOfSwapEther, 'ether'), 0);
    });
  });
});
