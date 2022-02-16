export const testNetwork = {
  chainId: `0x${Number(1337).toString(16)}`,
  chainName: 'Local testnet',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://127.0.0.1:7545'],
};

export const rinkeby = {
  chainId: `0x${Number(4).toString(16)}`,
  chainName: 'Rinkeby',
  nativeCurrency: {
    name: 'Rinkeby Ether',
    symbol: 'RIN',
    decimals: 18,
  },
  rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
  blockExplorerUrls: ['https://rinkeby.etherscan.io'],
};

export const BinanceSmartChian = {
  chainId: `0x${Number(56).toString(16)}`,
  chainName: 'Binance Smart Chain Mainnet',
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
  rpcUrls: [
    'https://bsc-dataseed1.binance.org',
    'https://bsc-dataseed2.binance.org',
    'https://bsc-dataseed3.binance.org',
    'https://bsc-dataseed4.binance.org',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed2.defibit.io',
    'https://bsc-dataseed3.defibit.io',
    'https://bsc-dataseed4.defibit.io',
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed2.ninicoin.io',
    'https://bsc-dataseed3.ninicoin.io',
    'https://bsc-dataseed4.ninicoin.io',
    'wss://bsc-ws-node.nariox.org',
  ],
  blockExplorerUrls: ['https://bscscan.com'],
};
