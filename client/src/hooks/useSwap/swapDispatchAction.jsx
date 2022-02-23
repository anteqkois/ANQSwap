import ACTION from "../../constants/actionSwap";

const action = {
  inputSetBalance: (payload) => ({ type: ACTION.INPUT_SET_BALANCE, payload }),
  inputSetPriceUSD: (payload) => ({
    type: ACTION.INPUT_SET_PRICE_USD,
    payload,
  }),
  inputSetAmount: (payload) => ({ type: ACTION.INPUT_SET_AMOUNT, payload }),
  inputSetSymbol: (payload) => ({ type: ACTION.INPUT_SET_SYMBOL, payload }),
  outputSetBalance: (payload) => ({ type: ACTION.OUTPUT_SET_BALANCE, payload }),
  outputSetPriceUSD: (payload) => ({
    type: ACTION.OUTPUT_SET_PRICE_USD,
    payload,
  }),
  outputSetAmount: (payload) => ({ type: ACTION.OUTPUT_SET_AMOUNT, payload }),
  outputSetSymbol: (payload) => ({ type: ACTION.OUTPUT_SET_SYMBOL, payload }),
  revert: () => ({ type: ACTION.REVERT }),
  setSwapType: (payload) => ({ type: ACTION.SET_SWAP_TYPE, payload }),
  lockOn: () => ({ type: ACTION.LOCK_ON }),
  lockOff: () => ({ type: ACTION.LOCK_OFF }),
  revertLoadingOn: () => ({ type: ACTION.REVERT_LOADING_ON }),
  revertLoadingOff: () => ({ type: ACTION.REVERT_LOADING_OFF }),
  setInForOneOut: (payload) => ({ type: ACTION.SET_IN_FOR_ONE_OUT, payload }),
  calculateLoadingOn: () => ({ type: ACTION.CALCULATE_LOADING_ON }),
  calculateLoadingOff: () => ({ type: ACTION.CALCULATE_LOADING_OFF }),
};
export default action;
