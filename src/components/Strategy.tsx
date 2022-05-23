import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { Provider } from '../helpers/provider';
import StrategyArtifact from '../artifacts/contracts/yearn-v2/StrategyDAICompoundBasic.sol/StrategyDAICompoundBasic.json';
import { useController, useSigner } from '../hooks/';
import { useVault } from '../hooks/useVault';

export function Strategy(): ReactElement {
  // signer
  const context = useWeb3React<Provider>();
  const { active } = context;
  const signer = useSigner();

  const controllerContract = useController();
  const vaultContract = useVault();

  // strategy
  const [strategyContract, setStrategyContract] = useState<Contract>();
  const [strategyContractAddress, setStrategyContractAddress] =
    useState<string>('');

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
        StrategyArtifact.abi,
        StrategyArtifact.bytecode,
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

  async function handleSetStrategy(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    // set vault
    // await controllerContract.setVault(DAI_ADDRESS, vaultContract.address);
    // const greeting = await controllerContract.greet();
    const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'; // underlying asset of vault
    await controllerContract.setVault(DAI_ADDRESS, vaultContract.address);
    window.alert('Vault Set');

    // approve strategy
    // await controllerContract.approveStrategy(DAI_ADDRESS, strategyContract.address);
    await controllerContract.approveStrategy(
      DAI_ADDRESS,
      strategyContractAddress
    );
    window.alert('Strategy Approved');

    // set strategy
    // await controllerContract.setStrategy(DAI_ADDRESS, strategyContract.address);
    await controllerContract.setStrategy(DAI_ADDRESS, strategyContractAddress);
    window.alert('Strategy Set');
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
        <button onClick={handleSetStrategy}>Set Strategy</button>
      </div>
    </div>
  );
}
