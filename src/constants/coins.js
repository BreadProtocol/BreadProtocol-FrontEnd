import * as chains from './chains';

const MAINNETCoins = [
  {
    name: 'Ether',
    abbr: 'ETH',
    address: '', // Weth address is fetched from the router
  },
  {
    name: 'Dai',
    abbr: 'DAI',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  {
    name: 'Tether USD',
    abbr: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  },
];

const ROPSTENCoins = [
  {
    name: 'Ether',
    abbr: 'ETH',
    address: '', // Weth address is fetched from the router
  },
  {
    name: 'Dai',
    abbr: 'DAI',
    address: '0xad6d458402f60fd3bd25163575031acdce07538d',
  },
  {
    name: 'Tether USD',
    abbr: 'USDT',
    address: '0x6ee856ae55b6e1a249f04cd3b947141bc146273c',
  },
];

const KOVANCoins = [
  {
    name: 'Ether',
    abbr: 'ETH',
    address: '', // // Weth address is fetched from the router
  },
  {
    name: 'Dai',
    abbr: 'DAI',
    address: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
  },
  {
    name: 'Tether USD',
    abbr: 'USDT',
    address: '0xf3e0d7bf58c5d455d31ef1c2d5375904df525105',
  },
];

const RINKEBYCoins = [
  {
    name: 'Ether',
    abbr: 'ETH',
    address: '', // Weth address is fetched from the router
  },
  {
    name: 'Dai',
    abbr: 'DAI',
    address: '0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658',
  },
  {
    name: 'Tether USD',
    abbr: 'USDT',
    address: '0x3b00ef435fa4fcff5c209a37d1f3dcff37c705ad',
  },
];

const GÖRLICoins = [
  {
    name: 'Ether',
    abbr: 'ETH',
    address: '', // Weth address is fetched from the router
  },
  {
    name: 'Dai',
    abbr: 'DAI',
    address: '0x73967c6a0904aa032c103b4104747e88c566b1a2',
  },
  {
    name: 'Tether USD',
    abbr: 'USDT',
    address: '0x509ee0d083ddf8ac028f2a56731412edd63223b9',
  },
];

const COINS = new Map();
COINS.set(chains.ChainId.MAINNET, MAINNETCoins);
COINS.set(chains.ChainId.ROPSTEN, ROPSTENCoins);
COINS.set(chains.ChainId.RINKEBY, RINKEBYCoins);
COINS.set(chains.ChainId.GÖRLI, GÖRLICoins);
COINS.set(chains.ChainId.KOVAN, KOVANCoins);
export default COINS;
