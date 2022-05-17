import { MetaMaskInpageProvider } from '@metamask/providers';
// import detectEthereumProvider from '@metamask/detect-provider';

export {};

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
    // ethereum?: detectEthereumProvider;
  }
}
