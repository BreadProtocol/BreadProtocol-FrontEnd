import React from 'react';
import './App.css';
import { NavBar } from './components';
import { ActivateDeactivate } from './components/ActivateDeactivate';
// import { Vault } from './components/Vault';
import { Controller } from './context/Controller';
import { Vault } from './context/Vault';
import { Strategy } from './components/Strategy';

function App() {
  return (
    <div className='App'>
      <NavBar />
      <ActivateDeactivate />
      <Controller>
        <Vault>
          <Strategy />
        </Vault>
      </Controller>
    </div>
  );
}

export default App;
