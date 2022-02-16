import React, { useState } from "react";
import ANQSwap from "./contracts/ANQSwap.json";
import AnteqToken from "./contracts/AnteqToken.json";
import Web3 from "web3";
import StatusBar from "./components/StatusBar";
import Swap from "./components/Swap";
import useAlert from "./hooks/useAlert";
import Button from "./components/Button";
import { testNetwork, rinkeby, BinanceSmartChian } from "./constants/chains";

export const App = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [ANQSwapContract, setANQSwapContract] = useState(null);
  const [ANQContract, setANQContract] = useState(null);

  const [AlertWrongNetwork, setAlertWrongNetwork] = useAlert();

  const handleChangeNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${Number(4).toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                ...rinkeby,
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  };

  const handleConnect = async () => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await window.ethereum.send("eth_requestAccounts");
      const web3 = await new Web3(window.ethereum);
      setWeb3(web3);

      //TODO in future use rinkeby network (4)
      const networkId = await web3.eth.net.getId();

      // networkId !== 577 && setAlertWrongNetwork(true);

      setANQSwapContract(
        new web3.eth.Contract(ANQSwap.abi, ANQSwap.networks[networkId].address)
      );
      setANQContract(
        new web3.eth.Contract(
          AnteqToken.abi,
          AnteqToken.networks[networkId].address
        )
      );

      setAccounts(await web3.eth.getAccounts());
    } catch (error) {
      console.log(error);
      // alert(
      //   `Failed to load web3, accounts, or contract. Check console for details.`
      // );
    }
  };

  return (
    <div className="w-screen p-4 flex flex-col h-screen bg-zinc-800 text-slate-300">
      <StatusBar account={accounts} connectWallet={handleConnect}></StatusBar>
      <div className=" flex items-center justify-center md:h-3/4">
        <Swap
          web3={web3}
          accounts={accounts}
          ANQSwapContract={ANQSwapContract}
          ANQContract={ANQContract}
          connectWallet={handleConnect}
        />
      </div>
      <AlertWrongNetwork>
        You use wrong network. Switch to Rinkeby network !
        <Button type="minimalist" onClick={handleChangeNetwork}>
          Switch to Rinkeby network
        </Button>
      </AlertWrongNetwork>
    </div>
  );
};

export default App;
