import React, { useContext } from 'react';
import { Signer } from 'ethers';
import { SignerContext } from '../context/Signer';

export const useSigner = (): Signer => {
  return useContext(SignerContext as React.Context<Signer>);
};
