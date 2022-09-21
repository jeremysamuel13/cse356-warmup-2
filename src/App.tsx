import React from 'react';
import './App.css';
import TTTBoard from './TTTBoard'

interface AppProps {
  isHome: boolean,
  name: string,
  date: Date
}


function App({ isHome, name, date }: AppProps) {
  if (isHome) {
    // FORM
    return <form>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" name="name" /><br />
      <input type="submit" value="Submit"></input>
    </form>
  }

  return (<div>
    <div>
      {`Hello ${name}, ${date}`}
    </div>
    <TTTBoard />
  </div>)

}

export default App;
