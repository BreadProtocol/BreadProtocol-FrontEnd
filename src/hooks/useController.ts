import React, { useContext } from 'react';
import { Contract } from 'ethers';
import { ControllerContext } from '../context/Controller';

export const useController = (): Contract => {
  return useContext(ControllerContext as React.Context<Contract>);
};
