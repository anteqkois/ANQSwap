import React from "react";

const PredirectFromOneInfo = ({
  inputSymbol,
  outputSymbol,
  inputPriceUSD,
  outputPriceUSD,
  outputAmountFromOne,
}) => {
  return (
    <p className=" text-slate-400 ">
      {outputAmountFromOne
        ? (() => {
            return `1 ${inputSymbol} ≈ ${
              parseFloat(outputAmountFromOne).toFixed(10) + " " + outputSymbol
            } ($${inputPriceUSD ? inputPriceUSD : "0"})`;
          })()
        : (() => {
            return `1 ${inputSymbol} ≈ connect wallet !`;
          })()}
    </p>
  );
};

export default PredirectFromOneInfo;
