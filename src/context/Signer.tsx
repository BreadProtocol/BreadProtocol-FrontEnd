import { useWeb3React } from '@web3-react/core';
import { Signer } from 'ethers';
import { createContext, ReactElement, useEffect, useState } from 'react';
import { Provider } from '../helpers/provider';

export const SignerContext = createContext<Signer | undefined>(undefined);
SignerContext.displayName = 'SignerContext';

// TODO: FIX: change type of children from any
export function SignerAccount({ children }: { children: any }): ReactElement {
  const context = useWeb3React<Provider>();
  const { library } = context;
  const [signer, setSigner] = useState<Signer>();

  // signer use effect
  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  return (
    <SignerContext.Provider value={signer}>{children}</SignerContext.Provider>
  );
}
