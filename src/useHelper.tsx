import React, { useCallback } from 'react';

/*
This should be a Global state to persist the data (Redux/Context), for now I'm only persisting the currentIndex,
but the length of guess and won and lost will not work.
I'd like to add this info as I know how to fix it
*/

const useHelper = () => {
  const [guesses, setGuesses] = React.useState<string[]>(new Array(6).fill(''));
  const [validate, setValidate] = React.useState<number[]>([]);
  const [secretWord, setSecretWord] = React.useState<string | null>(null);
  const [puzzleWon, setPuzzleWon] = React.useState(false);
  const [puzzleLost, setPuzzleLost] = React.useState(false);

  const getPositionIndex = useCallback(() => {
    const position = JSON.parse(localStorage.getItem('position') || '{}');
    return Number(position);
  }, []);

  const won = useCallback(() => {
    const positionIndex = getPositionIndex();
    return guesses[positionIndex].toLowerCase() === secretWord?.toLowerCase();
  }, [getPositionIndex, guesses, secretWord]);

  const lost = useCallback(() => {
    const positionIndex = getPositionIndex();
    return positionIndex === 6;
  }, [getPositionIndex]);

  const updatePosition = useCallback(() => {
    const positionIndex = getPositionIndex();
    localStorage.setItem('position', (positionIndex + 1).toString());
  }, [getPositionIndex]);

  const getKey = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      const positionIndex = getPositionIndex();

      if (puzzleWon || puzzleLost) {
        return;
      }

      if (e.key === 'Enter') {
        updatePosition();
        setValidate([...validate, positionIndex]);
        setPuzzleWon(guesses[positionIndex].toLowerCase() === secretWord?.toLowerCase());
        setPuzzleLost(positionIndex === 6);
        return;
      }

      if (e.key === 'Backspace') {
        setGuesses((prevState) => {
          const newGuesses = [...prevState];
          newGuesses[positionIndex] = newGuesses[positionIndex].slice(
            0,
            newGuesses[positionIndex].length - 1,
          );
          return newGuesses;
        });
        return;
      }

      if (guesses[positionIndex]?.length < 5 && e.key.match(/^[A-z]$/)) {
        console.log({ positionIndex });
        setGuesses((prevState) => {
          const newGuesses = [...prevState];
          newGuesses[positionIndex] = newGuesses[positionIndex] + e.key;
          return newGuesses;
        });
        return;
      }
    },
    [
      getPositionIndex,
      updatePosition,
      validate,
      guesses,
      puzzleWon,
      puzzleLost,
      won,
      lost,
    ],
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

  return {
    getKey,
    validate,
    won,
    lost,
    guesses,
    setGuesses,
    setValidate,
    startGame,
    getWord,
    setSecretWord,
    secretWord,
    positionIndex: getPositionIndex(),
    puzzleWon,
    puzzleLost,
  };
};

export default useHelper;
