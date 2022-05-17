import React, { MouseEventHandler, useState } from 'react';
import { CoinButton } from '../CoinButton/CoinButton';
import { doesTokenExist } from '../../helpers/functions';

const DialogTitle: React.FC<{
  children: any;
  onClose: MouseEventHandler<HTMLButtonElement>;
}> = ({ children, onClose }) => {
  return (
    <div>
      <h1>CoinDialog</h1>
      {children}
      {onClose ? <button onClick={onClose}></button> : null}
    </div>
  );
};

interface Coin {
  name: string;
  abbr: string;
  address: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

interface props {
  open: boolean;
  coins: Array<Coin>;
  signer: any; // FIX THIS
  onClose: MouseEventHandler<HTMLButtonElement>;
}

// dialog title
export const CoinDialog: React.FC<props> = (props) => {
  const { open, onClose, coins, signer } = props;

  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  // Resets any fields in the dialog (in case it's opened in the future) and calls the `onClose` prop
  // FIX type of value
  const exit = (value: any) => {
    setError('');
    setAddress('');
    onClose(value);
  };

  // Called when the user tries to input a custom address, this function will validate the address and will either
  // then close the dialog and return the validated address, or will display an error.
  const submit = () => {
    if (doesTokenExist(address, signer)) {
      exit(address);
    } else {
      setError('This address is not valid');
    }
  };

  return (
    <dialog open={open} onClose={() => exit(undefined)}>
      <DialogTitle onClose={() => exit(undefined)}>Select Coin</DialogTitle>
      <hr />
      <div>
        <h1>Coin Container</h1>
        <input
          type='text'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder='Paste Address'
          // error
        />
      </div>
      <hr />
      <div>
        <h1>Coin List</h1>
        {/* Maps all of the tokens in the constants file to buttons */}
        {coins.map((coin, index) => (
          <div key={index}>
            <CoinButton
              coinName={coin.name}
              coinAbbr={coin.abbr}
              onClick={() => exit(coin.address)}
            ></CoinButton>
          </div>
        ))}
      </div>
      <hr />
      <div>
        <h1>Dialog Actions</h1>
        <button onClick={submit}>Enter</button>
      </div>
    </dialog>
  );
};
