import React from 'react';

export const NavBar = () => {
  return (
    <div id='NavBar'>
      <div id='logo-container' className='nav-container'>
        <img src='/navbread.png' alt='' />
        <h3>Bread Coin</h3>
      </div>

      <div className='nav-container'>
        <ul>
          <li>Swap</li>
          <li>Liquidity</li>
          <li>Staking</li>
          <li>Whitepaper</li>
          <li>Roadmap</li>
        </ul>
      </div>

      <div id='buttons-container'>
        <button>connect</button>
        <button>...</button>
      </div>
    </div>
  );
};
