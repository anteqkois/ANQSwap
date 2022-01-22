import React from 'react';

const StatusBar = ({ account, connectWallet }) => {
  return (
    <div className="w-screen  bg-gray-200 flex items-center justify-between gap-y-4 flex-col p-4 lg:flex-row ">
      <div className="	">
        Twój address portfela: <strong> {account}</strong>
      </div>
      <button
        className="rounded-md bg-purple-600 hover:bg-purple-700 text-white uppercase font-semibold px-4 py-2"
        onClick={!account && connectWallet}
      >
        {account ? 'Wallet was connected' : 'Connect wallet'}
      </button>
    </div>
  );
};

export default StatusBar;
