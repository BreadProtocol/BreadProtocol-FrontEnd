import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import { MouseEvent, ReactElement, useEffect, useState } from 'react';
import { Provider } from '../helpers/provider';
import ControllerArtifact from '../artifacts/contracts/yearn-v2/Controller.sol/Controller.json';

export function Controller(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, active } = context;

  const [signer, setSigner] = useState<Signer>();
  const [controllerContract, setControllerContract] = useState<Contract>();
  const [controllerContractAddress, setControllerContractAddress] =
    useState<string>('');
  const TREASURY_Y_CHAD_ETH_YEARN_REWARDS: string =
    '0xfeb4acf3df3cdea7399794d0869ef76a6efaff52';

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect((): void => {
    if (!controllerContract) {
      return;
    }
  }, [controllerContract]);

  // HANDLE DEPLOY CONTRACT
  function handleDeployContract(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    // only deploy the Controller contract one time, when a signer is defined
    if (controllerContract || !signer) {
      return;
    }

    async function deployControllerContract(signer: Signer): Promise<void> {
      const Controller = new ethers.ContractFactory(
        ControllerArtifact.abi,
        ControllerArtifact.bytecode,
        signer
      );

      try {
        const controllerContract = await Controller.deploy(
          TREASURY_Y_CHAD_ETH_YEARN_REWARDS
        );

        await controllerContract.deployed();

        // const greeting = await controllerContract.greet();

        setControllerContract(controllerContract);

        window.alert(`Controller deployed to: ${controllerContract!.address}`);

        setControllerContractAddress(controllerContract!.address);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployControllerContract(signer);
  }

  return (
    <div>
      <button
        disabled={!active || controllerContract ? true : false}
        onClick={handleDeployContract}
      >
        Deploy Controller Contract
      </button>
      <div>
        <b>Controller Contract Address:</b>
        <div>
          {controllerContract ? (
            controllerContractAddress
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
      </div>
    </div>
  );
}
