import React from "react";
import { QuickAlertProvider } from "./hooks/useQuickAlert";
import { Web3Provider } from "./hooks/useWeb3";
import { SwapProvider } from "./hooks/useSwap";

const ProvidersRoot = ({ children }) => {
  return (
    <QuickAlertProvider>
      <Web3Provider>
        <SwapProvider>{children}</SwapProvider>
      </Web3Provider>
    </QuickAlertProvider>
  );
};

export default ProvidersRoot;
