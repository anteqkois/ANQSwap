import React from 'react';
import Button from './Button';

const StatusBar = ({ account, connectWallet }) => {
  return (
    <div className="flex items-center justify-between gap-y-4 flex-col p-4 lg:flex-row ">
      <div className="text-center">
        Wallet address: <strong className="text-sm block"> {account ? account : '...'}</strong>
      </div>
      <Button
      onClick={!account && connectWallet}
      >
        {account ? 'Wallet was connected' : 'Connect wallet'}
      </Button>
    </div>
  );
};

export default StatusBar;
