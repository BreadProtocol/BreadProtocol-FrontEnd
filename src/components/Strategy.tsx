import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { Provider } from '../helpers/provider';
import StrategtArtifact from '../artifacts/contracts/yearn-v2/StrategyDAICompoundBasic.sol/StrategyDAICompoundBasic.json';
import { useController } from '../hooks/useController';
import { useVault } from '../hooks/useVault';

export function Strategy(): ReactElement {
  // general
  const context = useWeb3React<Provider>();
  const { active, library } = context;
  const [signer, setSigner] = useState<Signer>();

  const controllerContract = useController();
  const vaultContract = useVault();

  // strategy
  const [strategyContract, setStrategyContract] = useState<Contract>();
  const [strategyContractAddress, setStrategyContractAddress] =
    useState<string>('');

  // general use effect
  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  // controller use effect
  useEffect((): void => {
    if (!controllerContract) {
      return;
    }
  }, [controllerContract]);

  // vault use effect
  useEffect((): void => {
    if (!vaultContract) {
      return;
    }
  }, [vaultContract]);

  // strategy use effect
  useEffect((): void => {
    if (!strategyContract) {
      return;
    }
  }, [strategyContract]);

  ////////////////////////////////////////////////////////////////////
  /////////------HANDLE DEPLOY STRATEGY CONTRACT------////////////////
  ////////////////////////////////////////////////////////////////////

  async function handleDeployStrategy(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    // only deploy the vault contract when a signer and controller and vault are defined
    // user should be able to deploy more than one strategy (to use more than one vault)
    if (!signer || !controllerContract || !vaultContract) {
      return;
    }

    async function deployStrategyContract(signer: Signer): Promise<void> {
      const Strategy = new ethers.ContractFactory(
        StrategtArtifact.abi,
        StrategtArtifact.bytecode,
        signer
      );

      try {
        const strategyContract = await Strategy.deploy(
          controllerContract.address
        );

        await strategyContract.deployed();

        setStrategyContract(strategyContract);

        window.alert(`Strategy deployed to: ${strategyContract.address}`);

        setStrategyContractAddress(strategyContract.address);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployStrategyContract(signer);
  }
  return (
    <div>
      {/* STRATEGY */}
      <b>STRATEGY</b>
      <div>
        <button disabled={!active} onClick={handleDeployStrategy}>
          Deploy Strategy Contract
        </button>
        <div>
          <b>Strategy Contract Address:</b>
          <div>
            {strategyContract ? (
              strategyContractAddress
            ) : (
              <em>{`<Strategy Contract not yet deployed>`}</em>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
