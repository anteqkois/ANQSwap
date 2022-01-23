import React, { useState, useEffect } from 'react';
import Button from './Button';
import InputFrom from './InputFrom';
import InputTo from './InputTo';

const SwapForm = ({ accounts, web3, ANQSwapContract, ANQContract }) => {
  const [ethAmount, setEthAmount] = useState(null);
  const [anqAmount, setAnqAmount] = useState(null);
  const [buy, setBuy] = useState(true);
  const [eth, setEth] = useState(null);
  const [anq, setAnq] = useState(null);
  const [ethPrice, setEthPrice] = useState(null);
  const [anqPrice, setAnqPrice] = useState(null);

  useEffect(() => {
    accounts &&
      (async () => {
        setEth(web3.utils.fromWei(await web3.eth.getBalance(accounts[0])));
        setAnq(web3.utils.fromWei(await ANQContract.methods.balanceOf(accounts[0]).call()));
        setAnqPrice(await ANQSwapContract.methods.rate().call());
        console.log(await ANQSwapContract.methods.rate().call());
      })();
  }, [accounts]);

  useEffect(() => {
    (async () => {
      // let data = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      // data = await data.json();
      // setEthPrice(data.ethereum.usd);
      setEthPrice(2443.34);
    })();
  }, [web3]);

  const handleCheckPattern = (event, set) => {
    const match = event.target.value.match(/^[0-9]*[.,]?[0-9]*$/g);
    event.target.value = match ? match : ethAmount;
    set((prev) => (match ? match : prev));
  };

  return (
    <div className="flex items-center justify-center  w-full backdrop-blur  bg-zinc-900 rounded-xl my-5">
      <div className="h-full w-full p-4 text-base">
        <InputFrom
          balance={buy ? eth : anq}
          rate={buy ? ethPrice : 100}
          symbol={buy ? 'ETH' : 'ANQ'}
          patternCheck={handleCheckPattern}
          coinAmount={buy ? ethAmount : anqAmount}
          setCoinAmount={buy ? setEthAmount : setAnqAmount}
        ></InputFrom>
        <div className="flex justify-center pt-4">
          <div onClick={() => setBuy((prev) => !prev)} className="h-12 w-12 bg-zinc-800 rounded-xl relative">
            <span className="w-1.5 h-9 rounded bg-zinc-900 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"></span>
            <span className="w-1.5 h-5 rounded-tl rounded-tr bg-zinc-900 absolute left-1/2 top-1/2 -translate-y-1/4 -translate-x-1/2 rotate-45 origin-bottom"></span>
            <span className="w-1.5 h-5 rounded-tl rounded-tr bg-zinc-900 absolute left-1/2 top-1/2 -translate-y-1/4 -translate-x-1/2 -rotate-45 origin-bottom"></span>
          </div>
        </div>
        <InputTo
          balance={buy ? anq : eth}
          symbol={buy ? 'ANQ' : 'ETH'}
          patternCheck={handleCheckPattern}
          coinAmount={buy ? anqAmount : ethAmount}
          setCoinAmount={buy ? setAnqAmount : setEthAmount}
        ></InputTo>
        <p className="p-1">1 ETH = 728 ANQ = ${ethPrice}</p>
        <div className="flex justify-center flex-col py-2">
          <Button onClick={() => setBuy(true)}>Buy</Button>
          <Button onClick={() => setBuy(false)} type="ghost">
            Sell
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwapForm;
