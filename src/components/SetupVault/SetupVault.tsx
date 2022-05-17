import React, { FormEvent, useState } from 'react';
import { CoinDialog } from '../CoinDialog/CoinDialog';
import { CoinField } from '../CoinField/CoinField';
import { Loading } from '../Loading/Loading';
import COINS from '../../constants/coins';
import * as chains from '../../constants/chains';
import { getBalanceAndSymbol } from '../../helpers/functions';

interface props {
  // hot fix. change type from any
  network: any;
}

interface coinProps {
  address: string | undefined;
  symbol?: string | undefined;
  balance?: number | undefined;
}

export const SetupVault: React.FC<props> = (props) => {
  const { network } = props;
  const [dialog1Open, setDialog1Open] = useState<boolean>(false);
  const [dialog2Open, setDialog2Open] = useState<boolean>(false);
  const [wrongNetworkOpen, setWrongNetworkOpen] = useState<boolean>(false);

  const [coin1, setCoin1] = useState<coinProps>({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });

  const [coin2, setCoin2] = useState<coinProps>({
    address: undefined,
    symbol: undefined,
    balance: undefined,
  });

  // Stores the current reserves in the liquidity pool between coin1 and coin2
  const [reserves, setReserves] = useState(['0.0', '0.0']);

  // Stores the current value of their respective text box
  const [field1Value, setField1Value] = useState('');
  const [field2Value, setField2Value] = useState('');

  // Controls the loading button
  const [loading, setLoading] = useState<boolean>(false);

  // Switches the top and bottom coins, this is called when users hit the swap button or select the opposite
  // token in the dialog (e.g. if coin1 is TokenA and the user selects TokenB when choosing coin2)
  const switchFields = () => {
    // probably need a temp variable here, for the swap
    setCoin1(coin2);
    setCoin2(coin1);
    setField1Value(field2Value);
    setReserves(reserves.reverse());
  };

  // These functions take an HTML event, pull the data out and puts it into a state variable.
  // hot fix check for type and change from ANY
  const handleChange = (e: any) => {
    setField1Value(e.target.value);
  };

  // Turns the account's balance into something nice and readable
  // check for type and change from ANY
  const formatBalance = (balance: string, symbol: string) => {
    if (balance && symbol)
      return parseFloat(balance).toPrecision(8) + ' ' + symbol;
    else return '0.0';
  };

  // Turns the coin's reserves into something nice and readable
  const formatReserve = (reserve: string, symbol: string) => {
    if (reserve && symbol) return reserve + ' ' + symbol;
    else return '0.0';
  };

  // Determines whether the button should be enabled or not
  const isButtonEnabled = () => {
    // If both coins have been selected, and a valid float has been entered which is less than the user's balance, then return true
    const parsedInput1 = parseFloat(field1Value);
    const parsedInput2 = parseFloat(field2Value);
    return (
      coin1.address &&
      coin2.address &&
      !isNaN(parsedInput1) &&
      !isNaN(parsedInput2) &&
      0 < parsedInput1 &&
      parsedInput1 <= (coin1.balance || 0) // hot fix
    );
  };

  // Called when the dialog window for coin1 exits
  const onToken1Selected = (address: string) => {
    // Close the dialog window
    setDialog1Open(false);

    // If the user inputs the same token, we want to switch the data in the fields
    if (address === coin2.address) {
      switchFields();
    }
    // We only update the values if the user provides a token
    else if (address) {
      // Getting some token data is async, so we need to wait for the data to return, hence the promise
      getBalanceAndSymbol(
        network.account,
        address,
        network.provider,
        network.signer,
        network.weth.address,
        network.coins
      ).then((data) => {
        console.log(data);
        // setCoin1({
        //   address: address,
        //   symbol: data.symbol,
        //   balance: data.balance,
        // });
      });
    }
  };

  // Called when the dialog window for coin2 exits
  const onToken2Selected = (address: string) => {
    // Close the dialog window
    setDialog2Open(false);

    // If the user inputs the same token, we want to switch the data in the fields
    if (address === coin1.address) {
      switchFields();
    }
    // We only update the values if the user provides a token
    else if (address) {
      // Getting some token data is async, so we need to wait for the data to return, hence the promise
      getBalanceAndSymbol(
        props.network.account,
        address,
        props.network.provider,
        props.network.signer,
        props.network.weth.address,
        props.network.coins
      ).then((data) => {
        console.log(data);
        // setCoin2({
        //   address: address,
        //   symbol: data.symbol,
        //   balance: data.balance,
        // });
      });
    }
  };

  // Call the swapTokens Ethereum function to make the swap, then resets nessicary state variables
  // write Ethereum function to do vault functions then call it here

  // use effects

  return (
    <div>
      <CoinDialog></CoinDialog>
      <h1>Setup Vault</h1>
      <p>Easy way to trade your tokens</p>
    </div>
  );
};
