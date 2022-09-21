import React from 'react';
import './App.css';
import TTTBoard from './TTTBoard'

interface AppProps {
  isHome: boolean
}


function App({ isHome }: AppProps) {
  if (isHome) {
    // FORM
    return <form>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" /><br />
      <input type="submit" value="Submit"></input>
    </form>
  }

  return <TTTBoard />

}

export default App;
