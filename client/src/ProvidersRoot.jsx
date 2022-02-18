import React from "react";
import { QuickAlertProvider } from "./hooks/useQuickAlert";
import { Web3Provider } from "./hooks/useWeb3";

const ProvidersRoot = ({ children }) => {
  return (
    <QuickAlertProvider>
      <Web3Provider>{children}</Web3Provider>
    </QuickAlertProvider>
  );
};

export default ProvidersRoot;
