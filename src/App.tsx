import React from 'react';
import './App.css';
import { NavBar } from './components';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import { Controller, SignerAccount, Vault } from './context';
import { Strategy } from './components/Strategy';
import { VaultBox } from './components/VaultBox/VaultBox';

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
