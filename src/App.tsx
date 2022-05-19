import React from 'react';
import './App.css';
import { NavBar } from './components';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import { Vault } from './components/Vault';
import { Controller } from './context/Controller';

function App() {
  return (
    <div className='App'>
      <NavBar />
      <ActivateDeactivate />
      <Controller>
        <Vault />
      </Controller>
    </div>
  );
}

export default App;
