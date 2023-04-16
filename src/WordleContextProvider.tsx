import React, { createContext, useCallback } from 'react';

/*
This should be a Global state to persist the data (Redux/Context), for now I'm only persisting the currentIndex,
but the length of guess and won and lost will not work.
I'd like to add this info as I know how to fix it
*/
interface IInitialState {
  guesses: string[];
  validate: number[] | [];
  secretWord: null | string;
  puzzleWon: boolean;
  puzzleLost: boolean;
  positionIndex: number;
  getKey: (e: unknown) => void;
  setGuesses: React.Dispatch<React.SetStateAction<string[]>>;
  setValidate: React.Dispatch<React.SetStateAction<number[]>>;
  startGame: () => void;
  getWord: () => Promise<void>;
  setSecretWord: React.Dispatch<React.SetStateAction<string | null>>;
}

export const WordleContext = createContext({
  guesses: new Array(6).fill(''),
  validate: [],
  secretWord: null,
  puzzleWon: false,
  puzzleLost: false,
  positionIndex: 0,
} as IInitialState);

const WordleContextProvider: React.FC = ({ children }) => {
  const [guesses, setGuesses] = React.useState<string[]>(new Array(6).fill(''));
  const [validate, setValidate] = React.useState<number[]>([]);
  const [secretWord, setSecretWord] = React.useState<string | null>(null);
  const [puzzleWon, setPuzzleWon] = React.useState(false);
  const [puzzleLost, setPuzzleLost] = React.useState(false);
  const [positionIndex, setPositionIndex] = React.useState(0);

  const getKey = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      if (puzzleWon || puzzleLost) {
        return;
      }

      if (e.key === 'Enter') {
        setValidate([...validate, positionIndex]);
        setPositionIndex(positionIndex + 1);
      } else if (e.key === 'Backspace') {
        setGuesses((prevState) => {
          const newGuesses = [...prevState];
          newGuesses[positionIndex] = newGuesses[positionIndex].slice(
            0,
            newGuesses[positionIndex].length - 1,
          );
          return newGuesses;
        });
      } else if (guesses[positionIndex]?.length < 5 && e.key.match(/^[A-z]$/)) {
        setGuesses((prevState) => {
          const newGuesses = [...prevState];
          newGuesses[positionIndex] = newGuesses[positionIndex] + e.key;
          return newGuesses;
        });
      }
    },
    [positionIndex, validate, guesses, puzzleWon, puzzleLost],
  );

  const startGame = useCallback(() => {
    localStorage.setItem('position', '0');
    setGuesses(new Array(6).fill(''));
    setValidate([]);
  }, []);

  // fetching the secret word
  const getWord = useCallback(async () => {
    try {
      const data = await fetch(
        'https://random-word-api.herokuapp.com/word?number=1&length=5',
      );
      const response = await data.json();
      setSecretWord(response.join(''));
    } catch (error) {
      console.log(error);
    }
  }, []);

  React.useEffect(() => {
    console.log(validate, positionIndex);
    if (
      guesses[positionIndex]?.toLowerCase() === secretWord?.toLocaleLowerCase() &&
      validate.includes(positionIndex)
    ) {
      setPuzzleWon(true);
    }
    if (positionIndex === 6) {
      setPuzzleLost(true);
    }
  }, [secretWord, validate, guesses[positionIndex]]);

  const value = {
    getKey,
    validate,
    guesses,
    setGuesses,
    setValidate,
    startGame,
    getWord,
    setSecretWord,
    secretWord,
    positionIndex,
    puzzleWon,
    puzzleLost,
  };

  return <WordleContext.Provider value={value}>{children}</WordleContext.Provider>;
};

export default WordleContextProvider;
