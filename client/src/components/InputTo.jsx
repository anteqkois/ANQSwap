import React from 'react';

const InputTo = ({ balance, coinAmount, setCoinAmount, symbol }) => {
  return (
    <>
      <p className="pb-0.5 px-4 text-right text-sm text-slate-400">
        Your balance: {balance ? balance : 0}
      </p>
      <div className="rounded-xl bg-zinc-800 w-full h-12  text-2xl text-slate-50 font-mono relative">
        <input
          onChange={(event) => setCoinAmount(event.target.value, coinAmount)}
          value={coinAmount}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          // pattern="^[0-9]*[.,]?[0-9]*$"
          spellCheck="false"
          name="anqAmount"
          id="anqAmount"
          placeholder="0"
          className="p-4 pr-16 text-right w-full h-full bg-transparent focus:outline-none"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2">
          {symbol}
        </span>
      </div>
    </>
  );
};

export default InputTo;
