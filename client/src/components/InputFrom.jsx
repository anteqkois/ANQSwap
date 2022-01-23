import React from 'react';

const InputFrom = ({ balance, coinAmount, setCoinAmount, patternCheck, symbol, rate }) => {
  // const handleCheckPattern = (event, setCoinAmount) => patternCheck(event, setCoinAmount);

  return (
    <>
      <p className="p-0.5 px-4 text-right text-sm">Your balance: {balance ? balance : 0}</p>
      <div
        className={`rounded-xl bg-zinc-800 w-full h-16  text-2xl text-slate-100 font-mono relative after:content-['${symbol}'] after:absolute after:right-4 after:pt-2`}
      >
        <input
          onChange={(event) => patternCheck(event, setCoinAmount)}
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
          maxLength={17}
          placeholder="0"
        />
        <p className="p-0.5 px-4 text-right text-sm text-slate-300 absolute bottom-1 right-1">${ (rate * coinAmount).toFixed(3)}</p>
      </div>
    </>
  );
};

export default InputFrom;
