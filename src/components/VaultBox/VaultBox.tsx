import { MouseEvent, useState, ChangeEvent } from 'react';
import eth from 'cryptocurrency-icons/32/black/eth.png';
import { BigNumber, ethers } from 'ethers';
import { useSigner, useVault } from '../../hooks';
import IERC20Artifact from '../../artifacts/contracts/yearn-v2/interfaces/IERC20.sol/IERC20.json';

export const CryptoIcon = (props: { name: string }) => {
  const source = 'cryptocurrency-icons/32/black/' + props.name + '.png';
  return (
    <div style={{ display: 'flex' }}>
      <img src={source} alt={props.name.toUpperCase()} />
      <aside>{props.name.toUpperCase()}</aside>
    </div>
  );
};

// TODO: CHANGE TYPE OF PROPS from any
export const VaultDialog = (props: {
  amount: number | string | readonly string[] | any;
  direction: string;
  name: string;
  source: any;
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className='VaultDialog'>
      <p>{props.direction}</p>
      <div className='VaultDialogForm'>
        <input
          type='text'
          name='asset'
          placeholder='0.0'
          value={props.amount}
          onChange={props.handleChange}
        />
        {/* label and image should be replaced with component */}
        {/* <CryptoIcon name='eth' /> */}
        <label htmlFor='asset'>{props.name}</label>
        <img src={props.source} alt={props.name} />
      </div>
    </div>
  );
};

export const VaultBox = () => {
  const [flip, setFlip] = useState<boolean>(false);
  const [maxAssetBalance, setMaxAssetBalance] = useState<String>('0');
  const [depositAmount, setDepositAmount] = useState<
    number | string | readonly string[] | any
  >('');
  const [sharesBalance, setSharesBalance] = useState<
    number | string | readonly string[] | any
  >('');

  const signer = useSigner();
  const vault = useVault();

  const handleDepositChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setDepositAmount(event.target.value);
  };

  const handleMintChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSharesBalance(event.target.value);
  };

  // BUG? I CANNOT DEPOSIT UNDERLYING TO VAULT MORE THAN ONCE
  // AFTER THE FIRST DEPOSIT WHICH IS SUCCESSFUL, I GET AN ERROR
  const handleDeposit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // dai (balance: 10.006133730236507217 DAI)
    // DAI balance: 10.008133730236507216
    const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';
    const dai = new ethers.Contract(DAI_ADDRESS, IERC20Artifact.abi, signer);
    // balance
    const balance = await dai.balanceOf(signer.getAddress());
    // formatRther divides by 18 decimals
    const balanceEthers = ethers.utils.formatEther(balance);
    setMaxAssetBalance(balanceEthers);
    window.alert(`DAI balance: ${balanceEthers}`);
    // creating new instance of dai contract
    const instanceDai = dai.connect(signer);
    window.alert(`DAI address on local network: ${instanceDai.address}`);
    // deposit amount
    // parseEther should return BigNumber. It seems depositAmountWei is ANY
    // parseEther multiplies by 18 decimals
    const depositAmountWei = ethers.utils.parseEther(depositAmount);
    // deposit multiplied by 18 decimals
    // console log deposit = 36 decimals (I think I do not need to multiply depositAmount. It is already 18 decimals)
    // it appears the problem is with shares. I think shares should be mutliplied by 18 decimals
    // i think the problem is that I used formatEther which divides by 18 decimals
    const depositAmountEthers = BigNumber.from(depositAmountWei).mul(
      BigNumber.from(10).pow(18)
    );
    await instanceDai.approve(vault.address, depositAmount);
    const sharesTx = await vault.deposit(depositAmount, signer.getAddress());
    const sharesTxReceipt = await sharesTx.wait();
    const shares = sharesTxReceipt.events[1].args.amount.toNumber();
    setSharesBalance(shares);

    window.alert(
      `Deposited ${depositAmountEthers} DAI as underlying to Vault at address ${vault.address}. You receive ${sharesBalance} shares of ISUSD!`
    );
  };

  const handleMint = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f';
    const dai = new ethers.Contract(DAI_ADDRESS, IERC20Artifact.abi, signer);
    const instanceDai = dai.connect(signer);
    window.alert(`DAI address on local network: ${instanceDai.address}`);

    const sharesToMint = ethers.utils.parseEther(sharesBalance);
    await instanceDai.approve(vault.address, sharesToMint);
    const previewDepositWei = await vault.previewDeposit(sharesToMint);
    console.log(`preview Deposit from SharesToMint: ${previewDepositWei}`);
    // divide by 18 decimals
    const previewDeposit = ethers.utils.formatEther(previewDepositWei);
    setDepositAmount(previewDeposit);

    const mintTx = await vault.mint(sharesToMint, signer.getAddress());
    const mintTxReceipt = await mintTx.wait();
    const depositWei = mintTxReceipt.events[1].args.amount;
    // 1000000000000000000
    const deposit = ethers.utils.formatEther(depositWei);
    window.alert(`Deposited ${deposit} DAI!`);
  };

  const handleEarn = async (event: MouseEvent<HTMLButtonElement>) => {
    await vault.earn();
    window.alert(`Called earn on Vault at ${vault.address}`);
  };

  const handleFlip = (event: MouseEvent<HTMLButtonElement>) => {
    flip ? setSharesBalance('') : setDepositAmount('');
    setFlip(!flip);
  };

  return (
    <div id='VaultContainer'>
      <h1>Setup Vault</h1>
      <aside>Easy way to trade your tokens</aside>
      {flip ? (
        // MINT SHARES
        <div>
          <VaultDialog
            amount={sharesBalance}
            direction='Mint'
            name='ISUSD'
            source={'/bread-logo.png'}
            handleChange={handleMintChange}
          />
          <button className='flip' onClick={handleFlip}>
            🔄
          </button>
          <VaultDialog
            amount={depositAmount}
            direction='From'
            name='ETH'
            source={eth}
            // handleChange={handleChange}
          />
          <p>Balance: {maxAssetBalance} [MAX]</p>
          <button onClick={handleMint}>Mint</button>
        </div>
      ) : (
        // DEPOSIT ASSET
        <div>
          <VaultDialog
            amount={depositAmount}
            direction='From'
            name='ETH'
            source={eth}
            handleChange={handleDepositChange}
          />
          <p>Balance: {maxAssetBalance} [MAX]</p>
          <button className='flip' onClick={handleFlip}>
            🔄
          </button>
          <VaultDialog
            amount={sharesBalance}
            direction='To'
            name='ISUSD'
            source={'/bread-logo.png'}
            // handleChange={handleChange}
          />
          <button onClick={handleDeposit}>Deposit</button>
        </div>
      )}

      <button onClick={handleEarn}>Earn</button>
    </div>
  );
};
