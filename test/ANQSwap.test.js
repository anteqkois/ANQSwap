const { assert, expect } = require('chai');

const AnteqToken = artifacts.require('./AnteqToken.sol');
const ANQSwap = artifacts.require('./ANQSwap.sol');

require('chai').use(require('chai-as-promised')).should();

// for (const log of logs) {
//   console.log(log.args._info, web3.utils.fromWei(log.args._number, 'wei'));
// }
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
    it('User can buy ANQ by exact ETH amount', async () => {
      const predirectExactOut = await anqSwap.predirectExactOut(toWei(5), 0);

      const { logs } = await anqSwap.swapExactETHForTokens({ from: accounts[1], value: toWei(5) });

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

    it('User can buy exact ANQ amount', async () => {
      // Want 1000 ANQ, calculate amount ETH to send
      const predirectExactIn = await anqSwap.predirectExactIn(0, toWei(1_000));

      // To check if contract calculate right ETH in amount
      const predirectExactOut = await anqSwap.predirectExactOut(predirectExactIn, 0);

      const swapBalanceOfANQBefore = await anteqToken.balanceOf(anqSwap.address);
      const swapBalanceOfETHBefore = await web3.eth.getBalance(anqSwap.address);

      const { logs } = await anqSwap.swapExactETHForTokens({ from: accounts[3], value: predirectExactIn });

      const buyerBalanceOfANQ = await anteqToken.balanceOf(accounts[3]);
      const swapBalanceOfANQAfter = await anteqToken.balanceOf(anqSwap.address);
      const swapBalanceOfETHAfter = await web3.eth.getBalance(anqSwap.address);

      assert.equal(logs[0].args._buyer, accounts[3]);
      assert.equal(fromWei(logs[0].args._amountANQ), 1_000);
      assert.equal(fromWei(logs[0].args._amountETH), fromWei(predirectExactIn));

      assert.equal(fromWei(buyerBalanceOfANQ), fromWei(predirectExactOut));
      assert.equal(fromWei(swapBalanceOfANQAfter), fromWei(web3.utils.toBN(swapBalanceOfANQBefore).sub(predirectExactOut)));
      assert.equal(fromWei(swapBalanceOfETHAfter), fromWei(web3.utils.toBN(swapBalanceOfETHBefore).add(predirectExactIn)));
    });

    it("User can't buy token if havn't enought ETH", async () => {
      await anqSwap.swapExactETHForTokens({ from: accounts[0], value: toWei(1_000) }).should.be.rejected;
    });
  });

  describe('Sell token', async () => {
    it('User can sell ANQ', async () => {
      const sellerBalanceOfANQBefore = await anteqToken.balanceOf(accounts[1]);
      const swapBalanceOfANQBefore = await anteqToken.balanceOf(anqSwap.address);
      const sellerBalanceOfETHBefore = await web3.eth.getBalance(accounts[1]);
      const swapBalanceOfETHBefore = await web3.eth.getBalance(anqSwap.address);
      const predirectExactOut = await anqSwap.predirectExactOut(0, sellerBalanceOfANQBefore);

      await anteqToken.approve(anqSwap.address, sellerBalanceOfANQBefore, {
        from: accounts[1],
      });
      const { logs } = await anqSwap.swapExactTokensforETH(sellerBalanceOfANQBefore, { from: accounts[1] });

      const sellerBalanceOfANQAfter = await anteqToken.balanceOf(accounts[1]);
      const swapBalanceOfANQAfter = await anteqToken.balanceOf(anqSwap.address);
      const sellerBalanceOfETHAfter = await web3.eth.getBalance(accounts[1]);
      const swapBalanceOfETHAfter = await web3.eth.getBalance(anqSwap.address);

      assert.equal(logs[0].args._seller, accounts[1]);
      assert.equal(fromWei(logs[0].args._amountANQ), fromWei(sellerBalanceOfANQBefore));
      assert.equal(fromWei(logs[0].args._amountETH), fromWei(predirectExactOut));
      assert.equal(fromWei(sellerBalanceOfANQAfter), 0);
      assert.equal(fromWei(swapBalanceOfANQAfter), fromWei(swapBalanceOfANQBefore.add(sellerBalanceOfANQBefore)));
      assert.equal(fromWei(swapBalanceOfETHAfter), fromWei(web3.utils.toBN(swapBalanceOfETHBefore).sub(predirectExactOut)));
      assert.isAbove(parseFloat(fromWei(sellerBalanceOfETHAfter)), parseFloat(fromWei(sellerBalanceOfETHBefore)));
    });

    it("User cann't sell token if havn't enought", async () => {

      await anteqToken.approve(anqSwap.address, toWei(1000), {
        from: accounts[4],
      });

      await anqSwap.swapExactTokensforETH(toWei(1000), { from: accounts[4] }).should.be.rejected;
    });
  });
});
