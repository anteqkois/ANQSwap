import React, { useState, useEffect, useReducer, useCallback } from 'react';
import Button from './Button';
import InputFrom from './InputFrom';
import InputTo from './InputTo';

const ACTION = {
  FROM_SET_BALANCE: 'FROM_SET_BALANCE',
  FROM_SET_PRICE_USD: 'FROM_SET_PRICE_USD',
  FROM_SET_AMOUNT: 'FROM_SET_AMOUNT',
  FROM_SET_SYMBOL: 'FROM_SET_SYMBOL',
  TO_SET_BALANCE: 'TO_SET_BALANCE',
  TO_SET_PRICE_USD: 'TO_SET_PRICE_USD',
  TO_SET_AMOUNT: 'TO_SET_AMOUNT',
  TO_SET_SYMBOL: 'TO_SET_SYMBOL',
  REVERT: 'REVERT',
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.FROM_SET_BALANCE:
      return { ...state, from: { ...state.from, balance: action.payload } };
      break;
    case ACTION.FROM_SET_PRICE_USD:
      return { ...state, from: { ...state.from, priceUSD: action.payload } };
      break;
    case ACTION.FROM_SET_AMOUNT:
      console.log( action.payload);
      console.log(typeof action.payload);
      // action.payload = typeof action.payload[0] === null ? '' : action.payload[0];
      // console.log( action.payload);

      const toAmount =
        state.to.priceUSD === 0 || state.from.priceUSD === 0
          ? 'Connect wallet'
          : (action.payload * state.from.priceUSD) / state.to.priceUSD;
      return {
        from: { ...state.from, amount: action.payload[0] },
        to: { ...state.to, amount: action.payload[0] === '' ? '' : toAmount },
      };
      break;
    case ACTION.FROM_SET_SYMBOL:
      return { ...state, from: { ...state.from, symbol: action.payload } };
      break;
    case ACTION.TO_SET_BALANCE:
      return { ...state, to: { ...state.to, balance: action.payload } };
      break;
    case ACTION.TO_SET_PRICE_USD:
      return { ...state, to: { ...state.to, priceUSD: action.payload } };
      break;
    case ACTION.TO_SET_AMOUNT:
      const fromAmount =
        state.to.priceUSD === 0 || state.from.priceUSD === 0
          ? 'Connect wallet'
          : (action.payload * state.from.priceUSD) / state.to.priceUSD;
      return {
        to: { ...state.to, amount: action.payload[0] },
        from: {
          ...state.from,
          amount: action.payload[0] === '' ? '' : fromAmount,
        },
      };
      break;
    case ACTION.TO_SET_SYMBOL:
      return { ...state, to: { ...state.to, symbol: action.payload } };
      break;
    case ACTION.REVERT:
      return { from: state.to, to: state.from };
      break;

    default:
      return state;
      break;
  }
};

const initialState = {
  from: {
    balance: 0,
    priceUSD: 0,
    amount: '',
    symbol: 'ETH',
  },
  to: {
    balance: 0,
    priceUSD: 0,
    amount: '',
    symbol: 'ANQ',
  },
};

const Swap = ({ accounts, web3, ANQSwapContract, ANQContract }) => {
  const [isBuying, setIsBuying] = useState(true);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    accounts &&
      (async () => {
        dispatch({
          type: ACTION.FROM_SET_BALANCE,
          payload: web3.utils.fromWei(await web3.eth.getBalance(accounts[0])),
        });
        dispatch({
          type: ACTION.TO_SET_BALANCE,
          payload: web3.utils.fromWei(await ANQContract.methods.balanceOf(accounts[0]).call()),
        });
        dispatch({
          type: ACTION.TO_SET_PRICE_USD,
          payload: await ANQSwapContract.methods.rate().call(),
        });
        dispatch({
          type: ACTION.FROM_SET_AMOUNT,
          payload: '',
        });
        dispatch({
          type: ACTION.TO_SET_AMOUNT,
          payload: '',
        });
      })();
  }, [accounts]);

  useEffect(() => {
    (async () => {
      // let data = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      // data = await data.json();
      // setEthPrice(data.ethereum.usd);

      dispatch({
        type: ACTION.FROM_SET_PRICE_USD,
        payload: 2443.34,
      });
    })();
  }, [web3]);

  const handleSwap = useCallback(async () => {
    web3 &&
      (async () => {
        console.log(state.from.amount, state.to.amount);
        console.log(state.from.symbol === 'ETH' ? 'buy' : 'sell');
      })();
  }, [web3, state.from.symbol, state.from.amount, state.to.amount]);

  const handleFromAmount = useCallback((amount) => {
    dispatch({ type: ACTION.FROM_SET_AMOUNT, payload: amount });
  }, []);

  const handleToAmount = useCallback((amount) => {
    dispatch({ type: ACTION.TO_SET_AMOUNT, payload: amount });
  }, []);

  const handleCheckPattern = (event, set, prevValue) => {
    let match = event.target.value.match(/^(\d{0,7}[.,]\d{0,18})$|^(\d{0,7})$/g);
    match = match[0] === '.' ? '0.' : match;
    event.target.value = match ? match : prevValue;
    set(match ? match : prevValue);
  };

  return (
    <div className="flex items-center justify-center w-max backdrop-blur  bg-zinc-900 rounded-xl my-5">
      <div className="h-full w-full p-4 text-base">
        <InputFrom
          balance={state.from.balance}
          valueOfAmount={state.from.priceUSD}
          symbol={state.from.symbol}
          patternCheck={handleCheckPattern}
          coinAmount={state.from.amount}
          setCoinAmount={handleFromAmount}
          web3={web3}
        ></InputFrom>
        <div className="flex justify-center pt-4">
          <div
            onClick={() => dispatch({ type: ACTION.REVERT })}
            className="tooltip h-12 w-12 bg-zinc-800 rounded-xl relative cursor-pointer hover:bg-zinc-700"
            data-title="Revers swaping tokens"
          >
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 50 50"
              className="fill-zinc-900 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"
            >
              <path d="M 25 5 C 14.351563 5 5.632813 13.378906 5.054688 23.890625 C 5.007813 24.609375 5.347656 25.296875 5.949219 25.695313 C 6.550781 26.089844 7.320313 26.132813 7.960938 25.804688 C 8.601563 25.476563 9.019531 24.828125 9.046875 24.109375 C 9.511719 15.675781 16.441406 9 25 9 C 29.585938 9 33.699219 10.925781 36.609375 14 L 34 14 C 33.277344 13.988281 32.609375 14.367188 32.246094 14.992188 C 31.878906 15.613281 31.878906 16.386719 32.246094 17.007813 C 32.609375 17.632813 33.277344 18.011719 34 18 L 40.261719 18 C 40.488281 18.039063 40.71875 18.039063 40.949219 18 L 44 18 L 44 8 C 44.007813 7.460938 43.796875 6.941406 43.414063 6.558594 C 43.03125 6.175781 42.511719 5.964844 41.96875 5.972656 C 40.867188 5.988281 39.984375 6.894531 40 8 L 40 11.777344 C 36.332031 7.621094 30.964844 5 25 5 Z M 43.03125 23.972656 C 41.925781 23.925781 40.996094 24.785156 40.953125 25.890625 C 40.488281 34.324219 33.558594 41 25 41 C 20.414063 41 16.304688 39.074219 13.390625 36 L 16 36 C 16.722656 36.011719 17.390625 35.632813 17.753906 35.007813 C 18.121094 34.386719 18.121094 33.613281 17.753906 32.992188 C 17.390625 32.367188 16.722656 31.988281 16 32 L 9.71875 32 C 9.507813 31.96875 9.296875 31.96875 9.085938 32 L 6 32 L 6 42 C 5.988281 42.722656 6.367188 43.390625 6.992188 43.753906 C 7.613281 44.121094 8.386719 44.121094 9.007813 43.753906 C 9.632813 43.390625 10.011719 42.722656 10 42 L 10 38.222656 C 13.667969 42.378906 19.035156 45 25 45 C 35.648438 45 44.367188 36.621094 44.945313 26.109375 C 44.984375 25.570313 44.800781 25.039063 44.441406 24.636719 C 44.078125 24.234375 43.570313 23.996094 43.03125 23.972656 Z"></path>
            </svg> */}
            <span className="w-1 h-8 rounded bg-zinc-900 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"></span>
            <span className="w-1 h-4 rounded-tl rounded-tr bg-zinc-900 absolute left-1/2 top-1/2 -translate-y-0.5 -translate-x-1/2 rotate-45 origin-bottom"></span>
            <span className="w-1 h-4 rounded-tl rounded-tr bg-zinc-900 absolute left-1/2 top-1/2 -translate-y-0.5 -translate-x-1/2 -rotate-45 origin-bottom"></span>
          </div>
        </div>
        <InputTo
          balance={state.to.balance}
          symbol={state.to.symbol}
          patternCheck={handleCheckPattern}
          coinAmount={state.to.amount}
          setCoinAmount={handleToAmount}
          web3={web3}
        ></InputTo>
        <div className="p-1 flex items-top gap-1">
          <svg width="17" height="17" viewBox="0 0 24 24" className="inline-block mt-1 fill-slate-500 cursor-help">
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z" />
          </svg>
          <p className=" text-slate-400 ">
            {`1 ${state.from.symbol} ≈ ${
              state.to.priceUSD !== 0 ? (state.from.priceUSD / state.to.priceUSD).toFixed(10) + ' ' + state.to.symbol : ' '
            } 
            ($${state.from.priceUSD ? state.from.priceUSD : '0'})`}
          </p>
        </div>
        <div className="flex justify-center flex-col py-2">
          <Button onClick={handleSwap}>swap</Button>
          <Button onClick={() => dispatch({ type: ACTION.REVERT })} type="ghost">
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
