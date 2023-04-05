import './App.css';

import React from 'react';

import GuessRow from './GuessRow';
import useHelper from './useHelper';

function App() {
  const {
    getKey,
    validate,
    guesses,
    startGame,
    positionIndex,
    getWord,
    secretWord,
    won,
    lost,
  } = useHelper();

  // Init the puzzle
  React.useEffect(() => {
    startGame();
  }, []);

  React.useEffect(() => {
    getWord();
  }, []);

  //event Listener
  React.useEffect(() => {
    window.addEventListener('keyup', (e) => getKey(e));

    return window.removeEventListener('keyup', (e) => getKey(e));
  }, []);

  React.useEffect(() => {
    if (won() || lost()) {
      setTimeout(() => location.reload(), 5000);
    }
  }, [won, lost, positionIndex, validate]);

  return (
    <div className="App">
      {won() && <h1 style={{ background: '#fff' }}>Kudos! You found the word!</h1>}
      {lost() && <h1 style={{ background: '#fff' }}>Keep trying!!! :(</h1>}
      {guesses.map((_, i) => (
        <GuessRow
          key={i}
          guessWord={guesses[i]}
          secretWord={secretWord}
          isCompleted={i < positionIndex}
          validate={validate}
        />
      ))}

      <p style={{ color: '#fff' }}>{secretWord}</p>
      <p style={{ color: '#fff' }}>{guesses[positionIndex]}</p>
    </div>
  );
}

export default App;
