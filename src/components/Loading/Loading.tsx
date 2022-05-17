import React, { MouseEventHandler } from 'react';

interface props {
  children: any;
  loading: boolean;
  valid: boolean;
  // success: boolean;
  // fail: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const Loading: React.FC<props> = (props) => {
  const { children, loading, valid, onClick } = props;
  return (
    <div>
      <h1>Loading button</h1>
      <button disabled={loading || !valid} type='submit' onClick={onClick}>
        {children}
      </button>
      {loading && <p>LOADING</p>}
    </div>
  );
};
