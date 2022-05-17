import React, { FormEventHandler, MouseEventHandler } from 'react';

interface props {
  symbol: string;
  value: string;
  activeField: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  onChange: FormEventHandler<HTMLInputElement>;
}

export const CoinField: React.FC<props> = (props) => {
  const { onClick, symbol, value, onChange, activeField } = props;
  return (
    <div>
      <h1>CoinField</h1>
      <button onClick={onClick}>{symbol}</button>
      <input
        type='text'
        value={value}
        onChange={onChange}
        placeholder='0.0'
        disabled={!activeField}
      />
    </div>
  );
};
