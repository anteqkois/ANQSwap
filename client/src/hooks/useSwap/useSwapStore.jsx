import React, { useEffect, useContext, useReducer, useCallback } from "react";
import useContracts from "../useContracts";
import useWeb3 from "../useWeb3";
import useDebounce from "../useDebounce";
import useAlert from "../useAlert";
import ACTION from "../../constants/actionSwap";
import action from "./swapDispatchAction";

import SWAP_TYPE from "../../constants/swapType";

import { handleInputPattern } from "../../helpers/amountPattern";
import Button from "../../components/utils/Button";

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.INPUT_SET_BALANCE:
      return { ...state, input: { ...state.input, balance: action.payload } };
    case ACTION.INPUT_SET_PRICE_USD:
      return { ...state, input: { ...state.input, priceUSD: action.payload } };
    case ACTION.INPUT_SET_AMOUNT:
      return {
        ...state,
        input: { ...state.input, amount: action.payload },
      };
    case ACTION.INPUT_SET_SYMBOL:
      return { ...state, input: { ...state.input, symbol: action.payload } };
    case ACTION.OUTPUT_SET_BALANCE:
      return { ...state, output: { ...state.output, balance: action.payload } };
    case ACTION.OUTPUT_SET_PRICE_USD:
      return {
        ...state,
        output: { ...state.output, priceUSD: action.payload },
      };
    case ACTION.OUTPUT_SET_AMOUNT:
      return {
        ...state,
        output: { ...state.output, amount: action.payload },
      };
    case ACTION.OUTPUT_SET_SYMBOL:
      return { ...state, output: { ...state.output, symbol: action.payload } };
    case ACTION.REVERT:
      return {
        ...state,
        input: state.output,
        output: state.input,
        lock: true,
        swapType:
          state.input.symbol === "ETH"
            ? SWAP_TYPE.SELL.EXACT_TOKENS_FOR_ETH
            : SWAP_TYPE.BUY.EXACT_ETH_FOR_TOKENS,
        revertLoading: state.input.amount === "" ? false : true,
        calculatePriceLoading: true,
      };
    case ACTION.LOCK_ON:
      return {
        ...state,
        lock: true,
      };
    case ACTION.LOCK_OFF:
      return {
        ...state,
        lock: false,
        // calculatePriceLoading: false,
      };
    case ACTION.SET_SWAP_TYPE:
      return {
        ...state,
        swapType: action.payload,
        calculatePriceLoading: true,
      };
    case ACTION.REVERT_LOADING_ON:
      return {
        ...state,
        revertLoading: true,
      };
    case ACTION.REVERT_LOADING_OFF:
      return {
        ...state,
        revertLoading: false,
      };
    case ACTION.SET_IN_FOR_ONE_OUT:
      return {
        ...state,
        revertLoading: action.payload,
      };
    case ACTION.CALCULATE_LOADING_ON:
      return {
        ...state,
        calculatePriceLoading: true,
      };
    case ACTION.CALCULATE_LOADING_OFF:
      return {
        ...state,
        calculatePriceLoading: false,
      };
    default:
      return state;
  }
};

const initialState = {
  input: {
    balance: 0,
    priceUSD: 0,
    amount: "",
    symbol: "ETH",
  },
  output: {
    balance: 0,
    priceUSD: 0,
    amount: "",
    symbol: "ANQ",
  },
  lock: false,
  swapType: SWAP_TYPE.BUY.EXACT_ETH_FOR_TOKENS,
  revertLoading: false,
  inForOneOut: null,
  calculatePriceLoading: false,
};

export const SwapStateContext = React.createContext();
export const SwapDispatchContext = React.createContext();

export const SwapStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { web3, accounts, connectWallet } = useWeb3();
  const { ANQSwapContract, ANQContract } = useContracts();

  const [AlertConnectWallet, setAlertConnectWallet] = useAlert();

  //Set initial value after connect to web3
  useEffect(() => {
    accounts &&
      ANQSwapContract &&
      (async () => {
        dispatch(
          action.inputSetBalance(
            web3.utils.fromWei(await web3.eth.getBalance(accounts[0]))
          )
        );
        dispatch(
          action.outputSetBalance(
            web3.utils.fromWei(
              await ANQContract.methods.balanceOf(accounts[0]).call()
            )
          )
        );
        dispatch(action.inputSetAmount(""));
        dispatch(action.outputSetAmount(""));

        const ethPrice = 3243.34;
        dispatch(action.inputSetPriceUSD(ethPrice));

        const amountETHForOneANQ = web3.utils.fromWei(
          await ANQSwapContract.methods
            .predirectExactOut(0, web3.utils.toWei("1"))
            .call()
        );

        dispatch(
          action.outputSetPriceUSD((amountETHForOneANQ * ethPrice).toFixed(8))
        );
      })();
  }, [ANQContract, ANQSwapContract, accounts, web3]);

  // calculate amount of token from one token from input
  useDebounce(
    () => {
      state.input.amount &&
        state.output.amount &&
        (() => {
          const MULTIPLIER = web3.utils.toBN(10).pow(web3.utils.toBN(18));

          const numerator = web3.utils
            .toBN(web3.utils.toWei(state.input.amount))
            .mul(MULTIPLIER);

          const denominator = web3.utils.toBN(
            web3.utils.toWei(state.output.amount)
          );

          const amountFromOne = web3.utils.fromWei(numerator.div(denominator));
          dispatch(action.setInForOneOut(amountFromOne));

          // What this do ?
          // dispatch({
          //   type: ACTION.CALCULATE_LOADING_OFF,
          // });
        })();
    },
    1000,
    [state.input.amount, state.output.amount]
  );

  // to handle revert tokens, first set to ""  that to triger other update useEffect
  useDebounce(
    () => {
      const prev = state.output.amount;
      dispatch(action.outputSetAmount(""));
      dispatch(action.outputSetAmount(prev));
    },
    1200,
    [state.input.symbol]
  );

  // TODO combine two function to one to update amount (check from triger and call right dispatch)
  const setInputAmount = useCallback(
    (amount) => {
      const match = handleInputPattern(amount);

      //TODO provide a infura connect with web3 to allow user to type amount and see predirect swap
      !web3 && setAlertConnectWallet(true);
      match !== null &&
        (() => {
          dispatch(
            action.setSwapType(
              state.input.symbol === "ETH"
                ? SWAP_TYPE.BUY.EXACT_ETH_FOR_TOKENS
                : SWAP_TYPE.SELL.EXACT_TOKENS_FOR_ETH
            )
          );

          dispatch(action.inputSetAmount(match));
        })();
    },
    [state.input.symbol, web3]
  );

  const setOutputAmount = useCallback(
    (amount) => {
      const match = handleInputPattern(amount);
      !web3 && setAlertConnectWallet(true);

      match !== null &&
        (() => {
          dispatch(
            action.setSwapType(
              state.input.symbol === "ETH"
                ? SWAP_TYPE.BUY.EXACT_ETH_FOR_TOKENS
                : SWAP_TYPE.SELL.TOKENS_FOR_EXACT_ETH
            )
          );

          dispatch(action.outputSetAmount(match));
        })();
    },
    [state.input.symbol, web3]
  );

  // to unlock after a short time (lock is to prevent infinity loop)
  useDebounce(() => state.lock && dispatch(action.lockOff()), 1100, [
    state.lock,
  ]);

  // Update output amount if input change and lock for a short time to prevent infinite loop with useDebounce
  useDebounce(
    async () => {
      !state.lock &&
        web3 &&
        (async () => {
          const eth =
            state.input.symbol === "ETH"
              ? web3.utils.toWei(state.input.amount ? state.input.amount : "0")
              : 0;
          const anq =
            state.input.symbol === "ETH"
              ? 0
              : web3.utils.toWei(state.input.amount ? state.input.amount : "0");

          const predirectOut =
            state.input.amount !== ""
              ? web3.utils.fromWei(
                  await ANQSwapContract.methods
                    .predirectExactOut(eth, anq)
                    .call()
                )
              : "";
          dispatch(action.outputSetAmount(predirectOut));
          // payload: handleOutputPattern(predirectOut),
          dispatch(action.lockOn());
          dispatch(action.revertLoadingOff());
        })();
    },
    1000,
    [state.input.amount, state.input.symbol]
  );

  // Update input amount if output change and lock for a short time to prevent infinite loop with useDebounce
  useDebounce(
    async () => {
      !state.lock &&
        web3 &&
        (async () => {
          const eth =
            state.input.symbol === "ETH"
              ? 0
              : web3.utils.toWei(
                  state.output.amount ? state.output.amount : "0"
                );
          const anq =
            state.input.symbol === "ETH"
              ? web3.utils.toWei(
                  state.output.amount ? state.output.amount : "0"
                )
              : 0;

          const predirectIn =
            state.output.amount !== ""
              ? web3.utils.fromWei(
                  await ANQSwapContract.methods
                    .predirectExactIn(eth, anq)
                    .call()
                )
              : "";

          dispatch(action.inputSetAmount(predirectIn));
          // payload: handleOutputPattern(predirectIn),
          dispatch(action.lockOn());
          dispatch(action.revertLoadingOff());
        })();
    },
    1000,
    [state.output.amount, state.input.symbol]
  );

  return (
    <SwapDispatchContext.Provider
      value={{
        dispatch,
        setInputAmount,
        setOutputAmount,
        action,
      }}
    >
      <SwapStateContext.Provider
        value={{
          state,
          SWAP_TYPE,
        }}
      >
        {children}
        <AlertConnectWallet type="alert" title="Connect wallet">
          If you want to use swap, first connect your MetaMask to swap and see
          predirect price for tokens.
          <Button
            type="minimalist"
            onClick={() => {
              connectWallet();
              setAlertConnectWallet(false);
            }}
          >
            connect wallet
          </Button>
        </AlertConnectWallet>
      </SwapStateContext.Provider>
    </SwapDispatchContext.Provider>
  );
};

export const useSwapDispatch = () => useContext(SwapDispatchContext);
export const useSwapState = () => useContext(SwapStateContext);
export const useSwapStore = () => {
  return { ...useContext(SwapStateContext), ...useContext(SwapStateContext) };
};
