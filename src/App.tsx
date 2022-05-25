import React from 'react';
import './App.css';
import { NavBar } from './components';
import { Strategy } from './components/Strategy';
import { VaultBox } from './components/VaultBox/VaultBox';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import { Controller, SignerAccount, Vault } from './context';

function App() {
  return (
    <div className='App'>
      <SignerAccount>
        <NavBar />
        <ActivateDeactivate />
        <Controller>
          <Vault>
            <VaultBox />
            <Strategy />
          </Vault>
        </Controller>
      </SignerAccount>
    </div>
  );
}

export default App;
