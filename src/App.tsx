import './App.css';

import React, { useContext } from 'react';

import GuessRow from './GuessRow';
import { WordleContext } from './WordleContextProvider';

function App() {
  const {
    getKey,
    validate,
    guesses,
    startGame,
    positionIndex,
    getWord,
    secretWord,
    puzzleWon,
    puzzleLost,
  } = useContext(WordleContext);

  // Init the puzzle
  React.useLayoutEffect(() => {
    startGame();
  }, []);

  React.useEffect(() => {
    getWord();
  }, []);

  //event Listener
  React.useEffect(() => {
    window.addEventListener('keyup', (e) => getKey(e));

    return window.removeEventListener('keyup', (e) => getKey(e));
  }, [positionIndex]);

  return (
    <div className="App">
      {puzzleWon && <h1 style={{ color: '#fff' }}>Kudos! You found the word!</h1>}
      {puzzleLost && <h1 style={{ color: '#fff' }}>Keep trying!!! :(</h1>}
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
