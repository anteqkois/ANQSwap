import React from 'react';
import { useSwapState, useSwapDispatch } from "../hooks/useSwap";

const InputTo = () => {
  const { state: swapState } = useSwapState();
  const { setOutputAmount } = useSwapDispatch();
  return (
    <>
      <p className="pb-0.5 px-4 text-right text-sm text-slate-400">
        Your balance: {swapState.output.balance ? swapState.output.balance : 0}
      </p>
      <div className="rounded-xl bg-zinc-800 w-full h-12  text-2xl text-slate-50 font-mono relative">
        <input
          onChange={(event) => setOutputAmount(event.target.value)}
          value={swapState.output.amount}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          // pattern="^[0-9]*[.,]?[0-9]*$"
          spellCheck="false"
          name="anqAmount"
          id="anqAmount"
          placeholder="0"
          className="p-4 pr-16 text-right w-full h-full bg-transparent caret-slate-50 focus:outline-none"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          {swapState.output.symbol}
        </span>
      </div>
    </>
  );
};

export default InputTo;
