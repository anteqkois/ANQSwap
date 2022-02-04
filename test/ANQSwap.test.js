const { assert, expect } = require('chai');

const AnteqToken = artifacts.require('./AnteqToken.sol');
const ANQSwap = artifacts.require('./ANQSwap.sol');

require('chai').use(require('chai-as-promised')).should();

const fromWei = (wei) => web3.utils.fromWei(wei);
const toWei = (wei) => web3.utils.toWei(web3.utils.toBN(wei));

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
    it('Right amount of liquidityFormula', async () => {
      const liquidityFormula = await anqSwap.liquidityFormula();

      // liquidityFormula = x**10*18 * y**10*18 ==>  liquidityFormula*10*19
      assert.equal(web3.utils.fromWei(web3.utils.fromWei(liquidityFormula, 'ether'), 'ether'), 5_000_000);
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
    it('User can buy ANQ', async () => {
      const predirectExactOut = await anqSwap.predirectExactOut(toWei(5), 0);

      const { logs } = await anqSwap.swapExactETHForTokens({ from: accounts[1], value: toWei(5) });

      // for (const log of logs) {
      //   console.log(log.args._info, web3.utils.fromWei(log.args._number, 'wei'));
      // }

      const buyerBalanceOfANQ = await anteqToken.balanceOf(accounts[1]);
      const swapBalanceOfANQ = await anteqToken.balanceOf(anqSwap.address);
      const swapBalanceOfETH = await web3.eth.getBalance(anqSwap.address);

      assert.equal(logs[0].args._buyer, accounts[1]);
      assert.equal(fromWei(logs[0].args._amountANQ), fromWei(predirectExactOut));
      assert.equal(fromWei(logs[0].args._amountETH), 5);

      assert.equal(fromWei(buyerBalanceOfANQ), fromWei(predirectExactOut));
      assert.equal(fromWei(swapBalanceOfANQ), 100_000 - fromWei(predirectExactOut));
      assert.equal(fromWei(swapBalanceOfETH), 55);
    });

    it("User can't buy token if havn't enought ether", async () => {
      await anqSwap.swapExactETHForTokens({ from: accounts[0], value: toWei(1_000) }).should.be
        .rejected;
    });
  });

  xdescribe('Sell token', async () => {
    it('User can sell ANQ', async () => {
      const balanceOfANQSeller = await anteqToken.balanceOf(accounts[1]);
      const predirectExactOut = await anqSwap.predirectExactOut(balanceOfANQSeller, false);

      await anteqToken.approve(anqSwap.address, balanceOfANQSeller, {
        from: accounts[1],
      });
      const { logs } = await anqSwap.sellTokens(balanceOfANQSeller, { from: accounts[1] });

      const balanceOfUserANQ = await anteqToken.balanceOf(accounts[1]);
      const balanceOfSwapANQ = await anteqToken.balanceOf(anqSwap.address);
      const balanceOfSwapEther = await web3.eth.getBalance(anqSwap.address);

      assert.equal(logs[0].args._seller, accounts[1]);
      assert.equal(web3.utils.fromWei(logs[0].args._amountANQ, 'ether'), web3.utils.fromWei(balanceOfANQSeller));
      assert.equal(web3.utils.fromWei(logs[0].args._amountETH, 'ether'), fromWei(predirectExactOut));
      assert.equal(web3.utils.fromWei(balanceOfUserANQ, 'ether'), 0);
      assert.equal(web3.utils.fromWei(balanceOfSwapANQ, 'ether'), 100_000);
      assert.equal(web3.utils.fromWei(balanceOfSwapEther, 'ether'), 55 - web3.utils.fromWei(predirectExactOut, 'ether'));
    });

    it("User cann't sell token if havn't enought", async () => {
      await anqSwap.sellTokens(web3.utils.toWei(web3.utils.toBN(100), 'ether'), { from: accounts[0] }).should.be.rejected;
    });
  });
});
