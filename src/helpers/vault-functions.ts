import { Contract, ethers, BigNumber, Signer } from 'ethers';
import * as chains from '../constants/chains';
import COINS from '../constants/coins';

import {
  // getProvider,
  getSigner,
  getAccount,
  getNetwork,
  checkNetwork,
  getWeth,
  doesTokenExist,
  getDecimals,
  getBalanceAndSymbol,
} from './functions';

// necessary abis - controller, strategyDAI..., vault, dai
const CONTROLLER_ABI = require('../constants/Controller');
const STRATEGY_DAI_COMPOUND_BASIC_ABI = require('../constants/StrategyDAICompoundBasic');
const VAULT_ABI = require('../constants/Vault');
export const DAI_ABI = require('../constants/dai');
// const COMPTROLLER_ABI = require('../constants/Comptroller');
// const CONVERTER_ABI = require('../constants/Converter');
// const UNI_ABI = require('../constants/Uni');
// const ERC20_ABI = require('../constants/ERC20');

// try and recreate simulate script from vault-fun
// get contracts, deployer, and signers
const provider = getProvider();
// deployer
const signer = getSigner(provider);

export function getProvider() {
  return new ethers.providers.Web3Provider(window.ethereum as any);
}

// signers
export async function getAccounts() {
  const accounts = await window.ethereum?.request({
    method: 'eth_requestAccounts',
  });

  return accounts;
}

// get Dai contract
export function getDai(address: string, signer: Signer) {
  return new Contract(address, DAI_ABI, signer);
}

// get Controller contract
export function getController(address: string, signer: Signer) {
  return new Contract(address, CONTROLLER_ABI, signer);
}

// get Vault contract
export function getVault(address: string, signer: Signer) {
  return new Contract(address, VAULT_ABI, signer);
}

// get Strategy contract
export function getStrategy(address: string, signer: Signer) {
  return new Contract(address, STRATEGY_DAI_COMPOUND_BASIC_ABI, signer);
}

// skip impersonate account
// skip transfer DAI to signers because I believe that is just simulation

// deployed Controller contract at 0xffa7CA1AEEEbBc30C874d32C7e22F052BbEa0429
// deployed Vault contract at 0x3aAde2dCD2Df6a8cAc689EE797591b2913658659
// deployed Strategy contract at 0xab16A69A5a8c12C732e0DEFF4BE56A70bb64c926

// blogger gets router, weth, and factory contracts he had deployed previously
// connect to localhost network on metamask
// run some transactions
// metamask should pop up
