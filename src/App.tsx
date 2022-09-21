import React from 'react';
import './App.css';
import TTTBoard from './TTTBoard'
import TTTForm from './TTTForm'


function App({ isHome, name, date }: any) {
  return <div className='app'>
    {isHome ? <TTTForm /> : <TTTBoard name={name} date={date} />}
  </div>
}

export default App;
