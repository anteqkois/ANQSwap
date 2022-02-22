import { useState } from "react";
import { useSwapState } from "./useSwapStore";
import useQuickAlert from "./../useQuickAlert";
import useWeb3 from "./../useWeb3";
import useContracts from "./../useContracts";
import SWAP_TYPE from "./../../constants/swapType";
import useDebounce from './../useDebounce';

const useSwap = () => {
 // Amount of input tokens for one output token
  const [inForOneOut, setinForOneOut] = useState("");
  const [transationData, setTransationData] = useState();

  const { state: swapState } = useSwapState();
  const { web3, accounts } = useWeb3();
  const { ANQContract, ANQSwapContract } = useContracts();
  const quickAlert = useQuickAlert();

  // calculate amount of token from one token from input
  useDebounce(
    () => {
      swapState.input.amount &&
        swapState.output.amount &&
        (() => {
          const MULTIPLIER = web3.utils.toBN(10).pow(web3.utils.toBN(18));

          const numerator = web3.utils
            .toBN(web3.utils.toWei(swapState.input.amount))
            .mul(MULTIPLIER);

          const denominator = web3.utils.toBN(
            web3.utils.toWei(swapState.output.amount)
          );

          const amountFromOne = web3.utils.fromWei(numerator.div(denominator));
          setinForOneOut(amountFromOne);

          // What tiis do ?
          // dispatch({
          //   type: ACTION.CALCULATE_LOADING_OFF,
          // });
        })();
    },
    1000,
    [swapState.input.amount, swapState.output.amount]
  );

  const handleSwap = async () => {
    !swapState.input.amount || !swapState.output.amount
      ? quickAlert({
          title: "alert",
          message: `Type amount of tokens to swap form`,
          showTime: 3000,
        })
      : (async () => {
          switch (swapState.swapType) {
            case SWAP_TYPE.BUY.EXACT_ETH_FOR_TOKENS:
              await ANQSwapContract.methods
                .swapExactETHForTokens()
                .send({
                  from: accounts[0],
                  value: web3.utils.toWei(swapState.input.amount),
                })
                .on(
                  "receipt",
                  ({
                    transactionHash,
                    blockHash,
                    blockNumber,
                    from,
                    to,
                    gasUsed,
                    events,
                  }) => {
                    const parseTransationData = {
                      transactionHash,
                      blockHash,
                      blockNumber,
                      from,
                      to,
                      gasUsed,
                      fromAmount: web3.utils.fromWei(
                        events.BuyTokens._amountETH
                      ),
                      fromSymbol: "ETH",
                      toAmount: web3.utils.fromWei(events.BuyTokens._amountANQ),
                      toSymbol: "ANQ",
                    };

                    setTransationData(parseTransationData);
                  }
                )
                .on("confirmation", (confirmationNumber, receipt) => {
                  quickAlert({
                    title: "Confirmation",
                    message: `Your transation have ${confirmationNumber} confirmation !`,
                    showTime: 3000,
                  });
                })
                .on("error", (error, receipt) => {
                  console.log({ error, receipt });
                });
              break;
            case SWAP_TYPE.SELL.EXACT_TOKENS_FOR_ETH:
              await ANQContract.methods
                .approve(
                  ANQSwapContract.options.address,
                  web3.utils.toWei(swapState.input.amount)
                )
                .send({ from: accounts[0] });

              await ANQSwapContract.methods
                .swapExactTokensforETH(web3.utils.toWei(swapState.input.amount))
                .send({
                  from: accounts[0],
                });
              break;
            case SWAP_TYPE.SELL.TOKENS_FOR_EXACT_ETH:
              await ANQContract.methods
                .approve(
                  ANQSwapContract.options.address,
                  web3.utils.toWei(swapState.input.amount)
                )
                .send({ from: accounts[0] });

              await ANQSwapContract.methods
                .swapTokensforExactETH(
                  web3.utils.toWei(swapState.output.amount)
                )
                .send({
                  from: accounts[0],
                });
              break;
            default:
              quickAlert({
                title: "error",
                message: `Something went wrong :( Try do swap tokens again or wait a while.`,
                showTime: 3000,
              });
              break;
          }
        })();
  };

  return { handleSwap, transationData, inForOneOut };
};

export default useSwap;
