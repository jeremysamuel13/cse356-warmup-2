import React from 'react';
import './App.css';
import TTTBoard from './TTTBoard'
import TTTForm from './TTTForm'


interface AppProps {
  isHome: boolean,
  name: string,
  date: Date
}


function App({ isHome, name, date }: AppProps) {
  if (isHome) {
    return (<TTTForm />)
  }

  return (<TTTBoard name={name} date={date} />)

}

export default App;
