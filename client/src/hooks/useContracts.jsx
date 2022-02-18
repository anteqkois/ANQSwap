import { useEffect, useState } from "react";
import useWeb3 from './useWeb3';
import ANQSwap from "../contracts/ANQSwap.json";
import AnteqToken from "../contracts/AnteqToken.json";

const useContracts = () => {
   const [ANQSwapContract, setANQSwapContract] = useState(null);
   const [ANQContract, setANQContract] = useState(null);
   
  const { web3 } = useWeb3();

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


  return {ANQContract, ANQSwapContract}
}

export default useContracts