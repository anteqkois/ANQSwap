const { assert, expect } = require('chai');

const AnteqToken = artifacts.require('./AnteqToken.sol');
const ANQSwap = artifacts.require('./ANQSwap.sol');

require('chai').use(require('chai-as-promised')).should();

contract('ANQSwap', (accounts) => {
  let anteqToken, anqSwap;

  before(async () => {
    anteqToken = await AnteqToken.new();
    anqSwap = await ANQSwap.new(anteqToken.address);

    await anteqToken.approve(anqSwap.address, web3.utils.toWei(web3.utils.toBN(100_000), 'ether'), { from: accounts[0] });

    await anqSwap.addInitialLiquidity(web3.utils.toWei(web3.utils.toBN(100_000), 'ether'), {
      from: accounts[0],
      value: web3.utils.toWei(web3.utils.toBN(50), 'ether'),
    });
  });

  describe('Deploy ANQSwap', async () => {
    it('ANQSwap had got assigned right token address', async () => {
      const tokenAddressInSwap = await anqSwap.anteqToken();
      assert.equal(anteqToken.address, tokenAddressInSwap);
    });
  });

  describe('Initial liquidity, ANQ and ETH amount', async () => {
    it('Right amount of totalLiquidity', async () => {
      const totalLiquidity = await anqSwap.totalLiquidity();

      // totalLiquidity = x**10*18 * y**10*18 ==>  totalLiquidity*10*19
      assert.equal(web3.utils.fromWei(web3.utils.fromWei(totalLiquidity, 'ether'), 'ether'), 5_000_000);
    });
    it('Right amount of ANQ', async () => {
      const balanceOfSwap = await anteqToken.balanceOf(anqSwap.address);
      assert.equal(web3.utils.fromWei(balanceOfSwap, 'ether'), 100_000);
    });
    it('Right amount of ETH', async () => {
      const balanceOfSwap = await web3.eth.getBalance(anqSwap.address);
      assert.equal(web3.utils.fromWei(balanceOfSwap, 'ether'), 50);
    });
  });

  describe('Change ANQ address', async () => {
    it('Owner can change ANQ address', async () => {
      await anqSwap.changeTokenAddress(accounts[2], { from: accounts[0] });
      const tokenAddressInSwap = await anqSwap.anteqToken();
      assert.notEqual(anteqToken.address, tokenAddressInSwap);
      await anqSwap.changeTokenAddress(anteqToken.address, { from: accounts[0] });
    });

    it("Other address can't change ANQ address", async () => {
      await anqSwap.changeTokenAddress(accounts[2], { from: accounts[2] }).should.be.rejected;
    });
  });

  xdescribe('Buy token', async () => {
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

    it("User can't buy token if havn't enought ether", async () => {
      await anqSwap.buyTokens({ from: accounts[0], value: web3.utils.toWei(web3.utils.toBN(1000), 'ether') }).should.be.rejected;
    });
  });

  xdescribe('Sell token', async () => {
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

    it("User cann't sell token if havn't enought", async () => {
      await anqSwap.sellTokens(web3.utils.toWei(web3.utils.toBN(100), 'ether'), { from: accounts[0] }).should.be.rejected;
    });
  });
});
