import React from "react";
import { useSwapState, useSwapDispatch } from '../hooks/useSwap';

const InputFrom = () => {
  const { state: swapState} = useSwapState();
  const { setInputAmount } = useSwapDispatch();
  return (
    <>
      <p className="p-0.5 px-4 text-right text-sm text-slate-400">
        Your balance: {swapState.input.balance ? swapState.input.balance : 0}
      </p>
      <div className="rounded-xl bg-zinc-800 w-full h-16  text-2xl text-slate-50 font-mono relative">
        <input
          onChange={(event) => setInputAmount(event.target.value)}
          value={swapState.input.amount}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          // pattern="^[0-9]*[.,]?[0-9]*$"
          spellCheck="false"
          name="ethAmount"
          id="ethAmount"
          placeholder="0"
          className=" p-4 pr-16 pb-8 text-right w-full h-full bg-transparent caret-slate-50 focus:outline-none"
        />
        <span className="absolute right-4 pt-2">{swapState.input.symbol}</span>
        <p className="p-0.5 px-4 text-right text-sm text-slate-400 absolute bottom-1 right-1">
          ${(swapState.input.priceUSD * swapState.input.amount).toFixed(8)}
        </p>
      </div>
    </>
  );
};

export default InputFrom;
