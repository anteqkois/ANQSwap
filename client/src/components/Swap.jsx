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
      return {
        from: { ...state.from, amount: action.payload },
        to: { ...state.to, amount: (action.payload * state.from.priceUSD) / state.to.priceUSD },
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
      return {
        to: { ...state.to, amount: action.payload },
        from: { ...state.from, amount: (action.payload * state.to.priceUSD) / state.from.priceUSD },
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

  const handleFromAmount = useCallback((amount) => {
    dispatch({ type: ACTION.FROM_SET_AMOUNT, payload: amount });
  }, []);

  const handleToAmount = useCallback((amount) => {
    dispatch({ type: ACTION.TO_SET_AMOUNT, payload: amount });
  }, []);

  const handleCheckPattern = (event, set, prevValue) => {
    const match = event.target.value.match(/^[0-9][.,]?[0-9]{0,18}$/g);
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
        ></InputFrom>
        <div className="flex justify-center pt-4">
          <div onClick={() => dispatch({ type: ACTION.REVERT })} className="h-12 w-12 bg-zinc-800 rounded-xl relative">
            <span className="w-1.5 h-9 rounded bg-zinc-900 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"></span>
            <span className="w-1.5 h-5 rounded-tl rounded-tr bg-zinc-900 absolute left-1/2 top-1/2 -translate-y-1/4 -translate-x-1/2 rotate-45 origin-bottom"></span>
            <span className="w-1.5 h-5 rounded-tl rounded-tr bg-zinc-900 absolute left-1/2 top-1/2 -translate-y-1/4 -translate-x-1/2 -rotate-45 origin-bottom"></span>
          </div>
        </div>
        <InputTo
          balance={state.to.balance}
          symbol={state.to.symbol}
          patternCheck={handleCheckPattern}
          coinAmount={state.to.amount}
          setCoinAmount={handleToAmount}
        ></InputTo>
        <div className="p-1 flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className="inline-block fill-slate-500"
          >
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.033 16.01c.564-1.789 1.632-3.932 1.821-4.474.273-.787-.211-1.136-1.74.209l-.34-.64c1.744-1.897 5.335-2.326 4.113.613-.763 1.835-1.309 3.074-1.621 4.03-.455 1.393.694.828 1.819-.211.153.25.203.331.356.619-2.498 2.378-5.271 2.588-4.408-.146zm4.742-8.169c-.532.453-1.32.443-1.761-.022-.441-.465-.367-1.208.164-1.661.532-.453 1.32-.442 1.761.022.439.466.367 1.209-.164 1.661z" />
          </svg>
          <p className="pb-0.5 text-slate-400 ">
            {`1 ${state.from.symbol} = ${state.to.priceUSD ? (state.from.priceUSD / state.to.priceUSD).toFixed(5) : '___'} ${
              state.to.symbol
            } ( $${state.from.priceUSD ? state.from.priceUSD : '_'} )`}
          </p>
          {/* 1{state.from.symbol} ={' '}
          {state.to.priceUSD ? (state.from.priceUSD / state.to.priceUSD).toFixed(5) : 0} {state.to.symbol} = $
          {state.from.priceUSD} */}
        </div>
        <div className="flex justify-center flex-col py-2">
          <Button>Buy</Button>
          <Button onClick={() => dispatch({ type: ACTION.REVERT })} type="ghost">
            Sell
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Swap;
