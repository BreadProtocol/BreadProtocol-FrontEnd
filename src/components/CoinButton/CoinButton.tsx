import React, { MouseEventHandler } from 'react';

interface props {
  coinName: string;
  coinAbbr: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const CoinButton: React.FC<props> = (props) => {
  const { coinName, coinAbbr, onClick } = props;

  return (
    <div>
      <h1>CoinButton</h1>
      <button onClick={onClick}></button>
      <p>{coinAbbr}</p>
      <p>{coinName}</p>
    </div>
  );
};
