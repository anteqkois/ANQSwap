import React from 'react';
import ConnectWalletError from './ConnectWalletError';
import SwapForm from './SwapForm';

const Swap = ({ accounts }) => {
  return <div className="flex items-center justify-center h-96 bg-purple-800">{accounts ? <SwapForm /> : <ConnectWalletError />}</div>;
};

export default Swap;
