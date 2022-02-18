import React from "react";
import Button from "./utils/Button";

const StatusBar = ({ account, connectWallet }) => {
  account = account
    ? (() => {
        const start = account.toString().slice(0, 6);
        const end = account.toString().slice(-6);
        return `${start}...${end}`;
      })()
    : "0x";

  return (
    <div className="flex items-center justify-between gap-y-4 flex-col p-4 lg:flex-row ">
      <div className="text-center flex flex-col items-center gap-1 sm:flex-row md:text-lg">
        <p>Wallet address:</p>
        <strong className="text-sm md:text-lg"> {account}</strong>
      </div>
      <Button type="special" onClick={!account !== "0x" ? connectWallet : null}>
        {account !== "0x" ? "Wallet was connected" : "Connect wallet"}
      </Button>
    </div>
  );
};

export default StatusBar;
