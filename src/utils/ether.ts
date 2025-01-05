import { BrowserProvider, JsonRpcProvider } from 'ethers';

export const getEthereumProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    // We are in the browser and MetaMask is running
    return new BrowserProvider(window.ethereum);
  }
  
  // If we want to connect to local hardhat node
  return new JsonRpcProvider('http://127.0.0.1:8545');
};
