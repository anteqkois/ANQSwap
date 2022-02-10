import React, {
  useState,
  useMemo,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import useDebounce from "../hooks/useDebounce";
import {
  handleInputPattern,
  handleOutputPattern,
} from "../helpers/amountPattern";
import Button from "./Button";
import InputFrom from "./InputFrom";
import InputTo from "./InputTo";
import PredirectFromOneInfo from "./PredirectFromOneInfo";

const ACTION = {
  INPUT_SET_BALANCE: "INPUT_SET_BALANCE",
  INPUT_SET_PRICE_USD: "INPUT_SET_PRICE_USD",
  INPUT_SET_AMOUNT: "INPUT_SET_AMOUNT",
  INPUT_SET_SYMBOL: "INPUT_SET_SYMBOL",
  OUTPUT_SET_BALANCE: "OUTPUT_SET_BALANCE",
  OUTPUT_SET_PRICE_USD: "OUTPUT_SET_PRICE_USD",
  OUTPUT_SET_AMOUNT: "OUTPUT_SET_AMOUNT",
  OUTPUT_SET_SYMBOL: "OUTPUT_SET_SYMBOL",
  REVERT: "REVERT",
  LOCK_ON: "LOCK_ON",
  LOCK_OFF: "LOCK_OFF",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.INPUT_SET_BALANCE:
      return { ...state, input: { ...state.input, balance: action.payload } };
      break;
    case ACTION.INPUT_SET_PRICE_USD:
      return { ...state, input: { ...state.input, priceUSD: action.payload } };
      break;
    case ACTION.INPUT_SET_AMOUNT:
      return {
        ...state,
        input: { ...state.input, amount: action.payload },
      };
      break;
    case ACTION.INPUT_SET_SYMBOL:
      return { ...state, input: { ...state.input, symbol: action.payload } };
      break;
    case ACTION.OUTPUT_SET_BALANCE:
      return { ...state, output: { ...state.output, balance: action.payload } };
      break;
    case ACTION.OUTPUT_SET_PRICE_USD:
      return {
        ...state,
        output: { ...state.output, priceUSD: action.payload },
      };
      break;
    case ACTION.OUTPUT_SET_AMOUNT:
      return {
        ...state,
        output: { ...state.output, amount: action.payload },
      };
      break;
    case ACTION.OUTPUT_SET_SYMBOL:
      return { ...state, output: { ...state.output, symbol: action.payload } };
      break;
    case ACTION.REVERT:
      return { input: state.output, output: state.input, lock: true };
      break;
    case ACTION.LOCK_ON:
      return {
        ...state,
        lock: true,
      };
    case ACTION.LOCK_OFF:
      return {
        ...state,
        lock: false,
      };
      break;

    default:
      return state;
      break;
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
};

const Swap = ({ accounts, web3, ANQSwapContract, ANQContract }) => {
  const [outputAmountFromOne, setOutputAmountFromOne] = useState("");

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    accounts &&
      (async () => {
        dispatch({
          type: ACTION.INPUT_SET_BALANCE,
          payload: web3.utils.fromWei(await web3.eth.getBalance(accounts[0])),
        });
        dispatch({
          type: ACTION.OUTPUT_SET_BALANCE,
          payload: web3.utils.fromWei(
            await ANQContract.methods.balanceOf(accounts[0]).call()
          ),
        });
        dispatch({
          type: ACTION.OUTPUT_SET_PRICE_USD,
          payload: 1000,
          //TODO calculate price to USD from 1ANQ
          // payload: await ANQSwapContract.methods.rate().call(),
        });
        dispatch({
          type: ACTION.INPUT_SET_AMOUNT,
          payload: "",
        });
        dispatch({
          type: ACTION.OUTPUT_SET_AMOUNT,
          payload: "",
        });
      })();
  }, [ANQContract, accounts, web3]);

  // get ETH price in USD from coingecko API
  useEffect(() => {
    (async () => {
      // let data = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      // data = await data.json();
      // setEthPrice(data.ethereum.usd);

      dispatch({
        type: ACTION.INPUT_SET_PRICE_USD,
        payload: 3243.34,
      });
    })();
  }, [web3]);

  // calculate amount of token from one token from input
  useEffect(() => {
    ANQSwapContract &&
      (async () => {
        const eth = state.input.symbol === "ETH" ? web3.utils.toWei("1") : 0;
        const anq = state.input.symbol === "ETH" ? 0 : web3.utils.toWei("1");

        const amountFromOne = web3.utils.fromWei(
          await ANQSwapContract.methods.predirectExactOut(eth, anq).call()
        );
        setOutputAmountFromOne(amountFromOne);
      })();
  }, [web3, ANQSwapContract, state.input.symbol]);

  // const handleSwap = useCallback(async () => {
  //   web3 &&
  //     (async () => {
  //       // console.log(state.from.amount, state.output.amount);
  //       state.from.symbol === 'ETH'
  //         ? (() => {
  //             // console.log('buy', web3.utils.toWei(state.from.amount));
  //             ANQSwapContract.methods
  //               .buyTokens()
  //               .send({ from: accounts[0], value: web3.utils.toWei(web3.utils.toBN(state.from.amount)) });
  //           })()
  //         : (() => {
  //             // console.log('sell', web3.utils.toWei(state.from.amount));
  //             ANQContract.methods.approve(ANQSwapContract.options.address).call({ from: accounts[0] });
  //             ANQSwapContract.methods
  //               .sellTokens(web3.utils.toWei(web3.utils.toBN(state.from.amount)))
  //               .call({ from: accounts[0] });
  //           })();
  //     })();
  // }, [web3, state.from.symbol, state.from.amount, state.output.amount]);

  const handleSwap = useCallback(() => {}, [
    web3,
    state.input.symbol,
    state.input.amount,
    state.output.amount,
  ]);

  // TODO combine two function to one to update amount (check from triger and call right dispatch)
  const handleInputAmount = useCallback((amount, prevAmount) => {
    let match = handleInputPattern(amount);

    match !== null &&
      (() => {
        dispatch({
          type: ACTION.INPUT_SET_AMOUNT,
          payload: match,
        });
      })();
  }, []);

  const handleOutputAmount = useCallback((amount, prevAmount) => {
    let match = handleInputPattern(amount);

    match !== null &&
      (() => {
        dispatch({
          type: ACTION.OUTPUT_SET_AMOUNT,
          payload: match,
        });
      })();
  }, []);

  // to unlock for a short time (lock is to prevent infinity loop)
  useDebounce(
    () => {
      state.lock && dispatch({ type: ACTION.LOCK_OFF });
    },
    1100,
    [state.lock]
  );

  // Update output amount and lock for a short time
  useDebounce(
    async () => {
      !state.lock &&
        (async () => {
          const predirectOut =
            state.input.amount !== ""
              ? web3.utils.fromWei(
                  await ANQSwapContract.methods
                    .predirectExactOut(web3.utils.toWei(state.input.amount), 0)
                    .call()
                )
              : "";
          dispatch({
            type: ACTION.OUTPUT_SET_AMOUNT,
            payload: handleOutputPattern(predirectOut),
          });
          dispatch({ type: ACTION.LOCK_ON });
        })();
    },
    1000,
    [state.input.amount]
  );

  // Update input amount and lock for a short time
  useDebounce(
    async () => {
      !state.lock &&
        (async () => {
          const predirectIn =
            state.output.amount !== ""
              ? web3.utils.fromWei(
                  await ANQSwapContract.methods
                    .predirectExactIn(0, web3.utils.toWei(state.output.amount))
                    .call()
                )
              : "";
          dispatch({
            type: ACTION.INPUT_SET_AMOUNT,
            payload: handleOutputPattern(predirectIn),
          });
          dispatch({ type: ACTION.LOCK_ON });
        })();
    },
    1000,
    [state.output.amount]
  );

  return (
    <div className="flex items-center justify-center w-max backdrop-blur  bg-zinc-900 rounded-xl my-5">
      <div className="h-full w-full p-4 text-base">
        <InputFrom
          balance={state.input.balance}
          valueOfAmount={state.input.priceUSD}
          symbol={state.input.symbol}
          coinAmount={state.input.amount}
          setCoinAmount={handleInputAmount}
        ></InputFrom>
        <div className="flex justify-center pt-4">
          <div
            onClick={() => dispatch({ type: ACTION.REVERT })}
            className="tooltip h-12 w-12 bg-zinc-800 rounded-xl relative cursor-pointer hover:bg-zinc-700"
            data-title="Revers swaping tokens"
          >
            <span className="w-1 h-8 rounded bg-zinc-900 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"></span>
            <span className="w-1 h-4 rounded-tl rounded-tr bg-zinc-900 absolute left-1/2 top-1/2 -translate-y-0.5 -translate-x-1/2 rotate-45 origin-bottom"></span>
            <span className="w-1 h-4 rounded-tl rounded-tr bg-zinc-900 absolute left-1/2 top-1/2 -translate-y-0.5 -translate-x-1/2 -rotate-45 origin-bottom"></span>
          </div>
        </div>
        <InputTo
          balance={state.output.balance}
          symbol={state.output.symbol}
          coinAmount={state.output.amount}
          setCoinAmount={handleOutputAmount}
        ></InputTo>
        <div className="p-1 flex items-top gap-1">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            className="inline-block mt-1 fill-slate-500 cursor-help"
          >
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z" />
          </svg>
          <PredirectFromOneInfo
            inputSymbol={state.input.symbol}
            outputSymbol={state.output.symbol}
            inputPriceUSD={state.input.priceUSD}
            outputPriceUSD={state.output.priceUSD}
            outputAmountFromOne={outputAmountFromOne}
          />
        </div>
        <div className="flex justify-center flex-col py-2">
          <Button onClick={handleSwap}>swap</Button>
          <Button
            onClick={() => dispatch({ type: ACTION.REVERT })}
            type="ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 50 50"
              className="fill-zinc-800 hover:fill-zinc-700 w-full"
            >
              <path d="M 25 5 C 14.351563 5 5.632813 13.378906 5.054688 23.890625 C 5.007813 24.609375 5.347656 25.296875 5.949219 25.695313 C 6.550781 26.089844 7.320313 26.132813 7.960938 25.804688 C 8.601563 25.476563 9.019531 24.828125 9.046875 24.109375 C 9.511719 15.675781 16.441406 9 25 9 C 29.585938 9 33.699219 10.925781 36.609375 14 L 34 14 C 33.277344 13.988281 32.609375 14.367188 32.246094 14.992188 C 31.878906 15.613281 31.878906 16.386719 32.246094 17.007813 C 32.609375 17.632813 33.277344 18.011719 34 18 L 40.261719 18 C 40.488281 18.039063 40.71875 18.039063 40.949219 18 L 44 18 L 44 8 C 44.007813 7.460938 43.796875 6.941406 43.414063 6.558594 C 43.03125 6.175781 42.511719 5.964844 41.96875 5.972656 C 40.867188 5.988281 39.984375 6.894531 40 8 L 40 11.777344 C 36.332031 7.621094 30.964844 5 25 5 Z M 43.03125 23.972656 C 41.925781 23.925781 40.996094 24.785156 40.953125 25.890625 C 40.488281 34.324219 33.558594 41 25 41 C 20.414063 41 16.304688 39.074219 13.390625 36 L 16 36 C 16.722656 36.011719 17.390625 35.632813 17.753906 35.007813 C 18.121094 34.386719 18.121094 33.613281 17.753906 32.992188 C 17.390625 32.367188 16.722656 31.988281 16 32 L 9.71875 32 C 9.507813 31.96875 9.296875 31.96875 9.085938 32 L 6 32 L 6 42 C 5.988281 42.722656 6.367188 43.390625 6.992188 43.753906 C 7.613281 44.121094 8.386719 44.121094 9.007813 43.753906 C 9.632813 43.390625 10.011719 42.722656 10 42 L 10 38.222656 C 13.667969 42.378906 19.035156 45 25 45 C 35.648438 45 44.367188 36.621094 44.945313 26.109375 C 44.984375 25.570313 44.800781 25.039063 44.441406 24.636719 C 44.078125 24.234375 43.570313 23.996094 43.03125 23.972656 Z"></path>
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
