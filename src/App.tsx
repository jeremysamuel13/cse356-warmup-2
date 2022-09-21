import React from 'react';
import './App.css';
import TTTBoard from './TTTBoard'
import TTTForm from './TTTForm'


function App({ isHome, name, date }: any) {
  if (isHome) {
    return (<TTTForm />)
  }

  return (<TTTBoard name={name} date={date} />)

}

export default App;
