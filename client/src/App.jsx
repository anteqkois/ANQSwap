import React, { useState, useEffect } from "react";

import StatusBar from "./components/StatusBar";
import Swap from "./components/Swap";
import useWeb3 from "./hooks/useWeb3";
import useContracts from "./hooks/useContracts";

export const App = () => {
  const { web3, accounts, connectWallet } = useWeb3();
  const { ANQSwapContract, ANQContract } = useContracts();

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
