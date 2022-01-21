import React, { useEffect, useState } from 'react';
import ANQSwap from './contracts/ANQSwap.json';
import AnteqToken from './contracts/AnteqToken.json';
import Web3 from 'web3';
import './App.css';

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

      setAccounts(await web3.eth.getAccounts());
      const networkId = await web3.eth.net.getId();

      setANQSwapContract(new web3.eth.Contract(ANQSwap.abi, ANQSwap.networks[networkId].address));
      setANQContract(new web3.eth.Contract(AnteqToken.abi, AnteqToken.networks[networkId].address));
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
    }
  };

  const handleDisconnect = async () => {};

  const runExample = async () => {
    const balanceANQInSwap = await ANQContract.methods.balanceOf(ANQSwapContract.options.address).call();
    const balanceANQInUser = await ANQContract.methods.balanceOf(accounts[0]).call();
    console.log(balanceANQInSwap);
    console.log(balanceANQInUser);
  };

  return (
    <div>
      <button onClick={handleConnect}>Connect Wallet</button>
      <button onClick={handleDisconnect}>Disconnect Wallet</button>
      <button onClick={runExample}>Run Example !</button>
      <h1 className="text-3xl font-bold underline text-cyan-800">Hello world!!!!!</h1>
    </div>
  );
};

export default App;
