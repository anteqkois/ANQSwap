import React from 'react';
import Button from './Button';

const StatusBar = ({ account, connectWallet }) => {
  return (
    <div className="flex items-center justify-between gap-y-4 flex-col p-4 lg:flex-row ">
      <div className="text-center flex flex-col items-center gap-1 sm:flex-row">
        <p>Wallet address:</p>
        {/* TODO change show addres from all to some numbers */}
        <strong className="text-sm"> {account ? account : '0x___'}</strong>
      </div>
      <Button onClick={!account ? connectWallet : null}>{account ? 'Wallet was connected' : 'Connect wallet'}</Button>
    </div>
  );
};

export default StatusBar;
