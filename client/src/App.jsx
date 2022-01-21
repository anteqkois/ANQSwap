import React, { useEffect, useState } from 'react';
import ANQSwap from './contracts/ANQSwap.json';
import AnteqToken from './contracts/AnteqToken.json';
import getWeb3 from './helpers/getWeb3';

import './App.css';

export const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [ANQSwapContract, setANQSwapContract] = useState(null);
  const [ANQContract, setANQContract] = useState(null);

  useEffect(async () => {
    try {
      const web3 = await getWeb3();
      setWeb3(web3);

      setAccounts(await web3.eth.getAccounts());

      const networkId = await web3.eth.net.getId();

      setANQSwapContract(new web3.eth.Contract(ANQSwap.abi, ANQSwap.networks[networkId].address));
      setANQContract(new web3.eth.Contract(AnteqToken.abi, AnteqToken.networks[networkId].address));
    } catch (error) {
      console.log(error);
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
    }
  }, []);

  const runExample = async () => {
    const balanceANQInSwap = await ANQContract.methods.balanceOf(ANQSwapContract.options.address).call();
    const balanceANQInUser = await ANQContract.methods.balanceOf(accounts[0]).call();
    console.log(balanceANQInSwap);
    console.log(balanceANQInUser);
  };

  return (
    <div>
      <button onClick={runExample}>Run Example !</button>
    </div>
  );
};

export default App;
