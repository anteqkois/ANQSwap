import React, { useState, useEffect } from "react";
import ANQSwap from "./contracts/ANQSwap.json";
import AnteqToken from "./contracts/AnteqToken.json";

import StatusBar from "./components/StatusBar";
import Swap from "./components/Swap";
import useWeb3 from './hooks/useWeb3';

export const App = () => {
  const [ANQSwapContract, setANQSwapContract] = useState(null);
  const [ANQContract, setANQContract] = useState(null);

  const { web3, accounts, connectWallet } =  useWeb3();

  useEffect(() => {
    web3 &&
      (async () => {
        try {
          const networkId = await web3.eth.net.getId();

          setANQSwapContract(
            new web3.eth.Contract(
              ANQSwap.abi,
              ANQSwap.networks[networkId].address
            )
          );
          setANQContract(
            new web3.eth.Contract(
              AnteqToken.abi,
              AnteqToken.networks[networkId].address
            )
          );
        } catch (error) {
          console.log(error);
        }
      })();
  }, [web3]);

  return (
    <div className="w-screen p-4 flex flex-col h-screen bg-zinc-800 text-slate-300">
      <StatusBar account={accounts} connectWallet={connectWallet}></StatusBar>
      <div className=" flex items-center justify-center md:h-3/4">
        <Swap
          web3={web3}
          accounts={accounts}
          ANQSwapContract={ANQSwapContract}
          ANQContract={ANQContract}
          connectWallet={connectWallet}
        />
      </div>
    </div>
  );
};

export default App;
