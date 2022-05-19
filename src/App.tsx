import React from 'react';
import './App.css';
import { NavBar } from './components';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import { Vault } from './components/Vault';

function App() {
  return (
    <div className='App'>
      <NavBar />
      <ActivateDeactivate />
      <Vault />
    </div>
  );
}

export default App;
