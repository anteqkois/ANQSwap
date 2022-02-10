import React from "react";
import Button from "./Button";

const StatusBar = ({ account, connectWallet }) => {
  account = account
    ? (() => {
        const start = account.toString().split(1, 5);
        // const end = account.toString().split(-6, 6);
        const end = '';
        return `${start}...${end}`;
      })()
    : "0x";

  return (
    <div className="flex items-center justify-between gap-y-4 flex-col p-4 lg:flex-row ">
      <div className="text-center flex flex-col items-center gap-1 sm:flex-row">
        <p>Wallet address:</p>
        {/* TODO change show addres from all to some numbers */}
        <strong className="text-sm"> {account}</strong>
      </div>
      <Button onClick={!account !== "0x" ? connectWallet : null}>
        {account !== "0x" ? "Wallet was connected" : "Connect wallet"}
      </Button>
    </div>
  );
};

export default StatusBar;
