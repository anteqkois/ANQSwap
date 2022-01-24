import React from 'react';

const InputFrom = ({ balance, coinAmount, setCoinAmount, patternCheck, symbol, valueOfAmount }) => {
  // const handleCheckPattern = (event, setCoinAmount) => patternCheck(event, setCoinAmount);

  return (
    <>
      <p className="p-0.5 px-4 text-right text-sm text-slate-400">Your balance: {balance ? balance : 0}</p>
      <div className="rounded-xl bg-zinc-800 w-full h-16  text-2xl text-slate-50 font-mono relative">
        <input
          onChange={(event) => patternCheck(event, setCoinAmount, coinAmount)}
          value={coinAmount}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          pattern="^[0-9]*[.,]?[0-9]*$"
          spellCheck="false"
          name="ethAmount"
          id="ethAmount"
          className="p-4 pr-16 pb-8 text-right w-full h-full bg-transparent focus:outline-none"
          placeholder="0"
        />
        <span className="absolute right-4 pt-2">{symbol}</span>
        <p className="p-0.5 px-4 text-right text-sm text-slate-400 absolute bottom-1 right-1">
          ${(valueOfAmount * coinAmount).toFixed(3)}
        </p>
      </div>
    </>
  );
};

export default InputFrom;
