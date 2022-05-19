import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { Provider } from '../helpers/provider';
import VaultArtifact from '../artifacts/contracts/yearn-v2/Vault.sol/Vault.json';
import StrategtArtifact from '../artifacts/contracts/yearn-v2/StrategyDAICompoundBasic.sol/StrategyDAICompoundBasic.json';
import { useController } from '../hooks/useController';

export function Vault(): ReactElement {
  // general
  const context = useWeb3React<Provider>();
  const { library, active } = context;
  const [signer, setSigner] = useState<Signer>();

  // controller
  // const { controllerContract } = useController();
  const controllerContract = useController();
  // vault
  const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'; // underlying asset of vault
  const [vaultContract, SetvaultContract] = useState<Contract>();
  const [vaultContractAddress, setVaultContractAddress] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');

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
  /////////------ HANDLE DEPLOY VAULT CONTRACT ------/////////////////
  ////////////////////////////////////////////////////////////////////
  async function handleDeployVault(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    // only deploy the vault contract when a signer and controller are defined
    // user should be able to deploy more than one vault (to use more than one strategy)
    if (!signer || !controllerContract) {
      return;
    }

    async function deployVaultContract(signer: Signer): Promise<void> {
      const Vault = new ethers.ContractFactory(
        VaultArtifact.abi,
        VaultArtifact.bytecode,
        signer
      );

      try {
        const address = await signer.getAddress();
        const vaultContract = await Vault.deploy(
          DAI_ADDRESS,
          name,
          symbol,
          address, // thinking signer because it was deployer in Vault-fun else governance
          controllerContract.address // controllerContract
        );

        // const greeting = await controllerContract.greet();

        await vaultContract.deployed();

        SetvaultContract(vaultContract);

        window.alert(`Vault deployed to: ${vaultContract.address}`);

        setVaultContractAddress(vaultContract.address);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployVaultContract(signer);
  }

  // vault name
  function handleNameInput(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setName(event.target.value);
  }
  // vault symbol
  function handleSymbolInput(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setSymbol(event.target.value);
  }

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
      {/* CONTROLLER */}
      {/* <div>
        <button
          disabled={!active || controllerContract ? true : false}
          onClick={handleDeployController}
        >
          Deploy Controller Contract
        </button>
        <div>
          <b>Controller Contract Address:</b>
          <div>
            {controllerContract ? (
              controllerContractAddress
            ) : (
              <em>{`<Controller Contract not yet deployed>`}</em>
            )}
          </div>
        </div>
      </div>
      <hr /> */}
      {/* VAULT */}
      <div>
        <label htmlFor='name'>Name</label>
        <input type='text' name='name' onChange={handleNameInput} />
        <label htmlFor='symbol'>Symbol</label>
        <input type='text' name='symbol' onChange={handleSymbolInput} />
        <button disabled={!active} onClick={handleDeployVault}>
          Deploy Vault Contract
        </button>
        <div>
          <b>Vault Contract Address:</b>
          <div>
            {vaultContract ? (
              vaultContractAddress
            ) : (
              <em>{`<Vault Contract not yet deployed>`}</em>
            )}
          </div>
        </div>
      </div>
      <hr />
      {/* STRATEGY */}
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
