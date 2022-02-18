import React, { useState, useContext } from "react";
import Web3 from "web3";
import { rinkeby } from "../constants/chains";
import useAlert from "./useAlert";
import Button from "./../components/utils/Button";

export const Web3Context = React.createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
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

  const handleConnectWallet = async () => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await window.ethereum.send("eth_requestAccounts");
      const web3 = await new Web3(window.ethereum);
      setWeb3(web3);

      //TODO in future use rinkeby network (4)
      const networkId = await web3.eth.net.getId();
      console.log(networkId);

      //use local Ganache
      networkId !== 5777 && setAlertWrongNetwork(true);

      setAccounts(await web3.eth.getAccounts());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        web3,
        accounts,
        switchNetwork: handleChangeNetwork,
        connectWallet: handleConnectWallet,
      }}
    >
      {children}
      <AlertWrongNetwork>
        You use wrong network. Switch to Rinkeby network !
        <Button type="minimalist" onClick={handleChangeNetwork}>
          Switch to Rinkeby network
        </Button>
      </AlertWrongNetwork>
    </Web3Context.Provider>
  );
};

const useWeb3 = () => useContext(Web3Context);

export default useWeb3;
