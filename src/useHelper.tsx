import React, { useCallback } from 'react';

const useHelper = () => {
  const [guesses, setGuesses] = React.useState<string[]>(new Array(6).fill(''));
  const [validate, setValidate] = React.useState<number[]>([]);
  const [secretWord, setSecretWord] = React.useState<string | null>(null);

  const getPositionIndex = useCallback(() => {
    const position = JSON.parse(localStorage.getItem('position') || '{}');
    return Number(position);
  }, []);

  const won = useCallback(() => {
    const positionIndex = getPositionIndex();
    return guesses[positionIndex - 1] === secretWord;
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
      if (won() || lost()) {
        return;
      }
      const positionIndex = getPositionIndex();

      if (e.key === 'Enter') {
        updatePosition();
        setValidate([...validate, positionIndex]);
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
        setGuesses((prevState) => {
          const newGuesses = [...prevState];
          newGuesses[positionIndex] = newGuesses[positionIndex] + e.key;
          return newGuesses;
        });
        return;
      }
    },
    [getPositionIndex, won, lost, updatePosition, validate, guesses],
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
  };
};

export default useHelper;
