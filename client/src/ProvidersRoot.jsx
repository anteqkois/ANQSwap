import React from "react";
import { QuickAlertProvider } from "./hooks/useQuickAlert";
import { Web3Provider } from "./hooks/useWeb3";
import { SwapStoreProvider } from "./hooks/useSwap";

const ProvidersRoot = ({ children }) => {
  return (
    <QuickAlertProvider>
      <Web3Provider>
        <SwapStoreProvider>{children}</SwapStoreProvider>
      </Web3Provider>
    </QuickAlertProvider>
  );
};

export default ProvidersRoot;
