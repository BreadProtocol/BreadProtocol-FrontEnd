import { MouseEvent, useState, ChangeEvent, useEffect, useMemo } from 'react';
import daiLogo from 'cryptocurrency-icons/32/black/dai.png';
import { BigNumber, ethers } from 'ethers';
import { useSigner, useVault } from '../../hooks';
import IERC20Artifact from '../../artifacts/contracts/yearn-v2/interfaces/IERC20.sol/IERC20.json';
import { DAI_ADDRESS } from '../../helpers/constants';

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
  readonly?: boolean;
}) => {
  return (
    <div className='VaultDialog'>
      <p>{props.direction}</p>
      <div className='VaultDialogForm'>
        <input
          type='number'
          name='asset'
          placeholder='0.0'
          value={props.amount}
          onChange={props.handleChange}
          readOnly={props.readonly}
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
  const [maxAssetBalance, setMaxAssetBalance] = useState<string>('0');
  const [depositAmount, setDepositAmount] = useState<
    number | string | readonly string[] | any
  >('');
  const [sharesBalance, setSharesBalance] = useState<
    number | string | readonly string[] | any
  >('');

  const signer = useSigner();
  const vault = useVault();
  const dai = useMemo(
    () => new ethers.Contract(DAI_ADDRESS, IERC20Artifact.abi, signer),
    [signer]
  );

  useEffect(() => {
    const getBalance = async () => {
      const balance = await dai.balanceOf(signer!.getAddress());
      // formatEther divides by 18 decimals
      const balanceEthers = ethers.utils.formatEther(balance);
      setMaxAssetBalance(balanceEthers);
    };
    getBalance();
  }, [signer, dai]);

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
    // creating new instance of dai contract
    const instanceDai = dai.connect(signer);
    window.alert(`DAI address on local network: ${instanceDai.address}`);
    // deposit amount
    await instanceDai.approve(vault.address, depositAmount);
    const sharesTx = await vault.deposit(depositAmount, signer.getAddress());
    const sharesTxReceipt = await sharesTx.wait();
    const shares = sharesTxReceipt.events[1].args.amount.toNumber();
    setSharesBalance(shares);

    window.alert(
      `Deposited ${depositAmount} DAI as underlying to Vault at address ${vault.address}. You receive ${sharesBalance} shares of ISUSD!`
    );
  };

  const handleMint = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
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
    const deposit = ethers.utils.formatEther(depositWei);
    window.alert(`Deposited ${deposit} DAI!`);
  };

  const handleWithdraw = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    console.log('Withdrawing...');
    const instanceDai = dai.connect(signer);
    const userShares = await vault.balanceOf(signer.getAddress());
    await instanceDai.approve(signer.getAddress(), userShares);
    // error
    const withdrawnAsset = await vault.redeem(
      userShares,
      signer.getAddress(),
      signer.getAddress()
    );
    window.alert(`Redeemed ${withdrawnAsset} DAI`);
  };

  const handleRedeem = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // const total = await vault.totalAssets();
    // console.log('Total Assets:', total);
    const userShareTokenBalance = await vault.balanceOf(signer.getAddress());
    console.log(
      'User Share tokens:',
      ethers.utils.formatUnits(userShareTokenBalance.toString())
    );
    // error code: -32603
    // 'Error: Transaction reverted: function returned an unexpected amount of data'
    // check setting allowance of tokens
    const userEarningsOnShare = await vault.previewRedeem(
      BigNumber.from(1)
      // userShareTokenBalance
    );
    console.log(
      'User Earnings On Shares:',
      ethers.utils.formatUnits(userEarningsOnShare.toString())
    );
    const redeemedAsset = await vault.redeem(
      userShareTokenBalance,
      signer.getAddress(),
      signer.getAddress()
    );
    window.alert(`Redeemed ${redeemedAsset} DAI`);
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
            name='DAI'
            source={daiLogo}
            readonly={true}
          />
          <p>Balance: {maxAssetBalance} [MAX]</p>
          <button
            onClick={handleMint}
            disabled={
              depositAmount &&
              BigNumber.from(ethers.utils.parseEther(depositAmount)).gte(
                BigNumber.from(ethers.utils.parseEther(maxAssetBalance))
              )
            }
          >
            {depositAmount < maxAssetBalance ? 'Mint' : 'Insufficient Balance'}
          </button>
        </div>
      ) : (
        // DEPOSIT ASSET
        <div>
          <VaultDialog
            amount={depositAmount}
            direction='From'
            name='DAI'
            source={daiLogo}
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
            readonly={true}
          />
          <button
            onClick={handleDeposit}
            disabled={
              depositAmount &&
              BigNumber.from(ethers.utils.parseEther(depositAmount)).gte(
                BigNumber.from(ethers.utils.parseEther(maxAssetBalance))
              )
            }
          >
            {depositAmount < maxAssetBalance
              ? 'Deposit'
              : 'Insufficient Balance'}
          </button>
        </div>
      )}

      <button onClick={handleEarn}>Earn</button>
      <button onClick={handleWithdraw}>Withdraw</button>
      <button onClick={handleRedeem}>Redeem</button>
    </div>
  );
};
