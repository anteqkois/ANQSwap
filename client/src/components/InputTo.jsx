import React from 'react';

const InputTo = ({ balance, coinAmount, setCoinAmount, patternCheck, symbol }) => {
  return (
    <>
      <p className="pb-0.5 px-4 text-right text-sm">Your balance: {balance ? balance : 0}</p>
      <div className={`rounded-xl bg-zinc-800 w-full h-12  text-2xl text-slate-100 font-mono relative after:content-['${symbol}'] after:absolute after:right-4 after:top-1/2 after:-translate-y-1/2`}>
        <input
          onChange={(event) => patternCheck(event, setCoinAmount)}
          value={coinAmount}
          type="text"
          inputmode="decimal"
          autocomplete="off"
          autocorrect="off"
          pattern="^[0-9]*[.,]?[0-9]*$"
          spellcheck="false"
          name="anqAmount"
          id="anqAmount"
          className="p-4 pr-16 text-right w-full h-full bg-transparent focus:outline-none"
          placeholder="0"
        />
      </div>
    </>
  );
};

export default InputTo;
