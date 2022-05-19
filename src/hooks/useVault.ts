import React, { useContext } from 'react';
import { Contract } from 'ethers';
import { VaultContext } from '../context/Vault';

export const useVault = (): Contract => {
  return useContext(VaultContext as React.Context<Contract>);
};
