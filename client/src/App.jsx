import React, { useState, useEffect } from 'react';
import ANQSwap from './contracts/ANQSwap.json';
import AnteqToken from './contracts/AnteqToken.json';
import Web3 from 'web3';
import StatusBar from './components/StatusBar';
import Swap from './components/Swap';

export const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [ANQSwapContract, setANQSwapContract] = useState(null);
  const [ANQContract, setANQContract] = useState(null);

  const handleConnect = async () => {
    try {
      if (!window.ethereum) throw new Error('No crypto wallet found. Please install it.');

      await window.ethereum.send('eth_requestAccounts');
      const web3 = await new Web3(window.ethereum);
      setWeb3(web3);

      const networkId = await web3.eth.net.getId();
      setANQSwapContract(new web3.eth.Contract(ANQSwap.abi, ANQSwap.networks[networkId].address));
      setANQContract(new web3.eth.Contract(AnteqToken.abi, AnteqToken.networks[networkId].address));

      setAccounts(await web3.eth.getAccounts());
    } catch (error) {
      console.log(error);
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
    }
  };
  
  return (
    <div className="w-screen p-4 flex flex-col h-screen bg-zinc-800 text-slate-300">
      <StatusBar account={accounts} connectWallet={handleConnect}></StatusBar>
      <div className=" flex items-center justify-center md:h-3/4">
        <Swap web3={web3} accounts={accounts} ANQSwapContract={ANQSwapContract} ANQContract={ANQContract} />
      </div>
    </div>
  );
};

export default App;
