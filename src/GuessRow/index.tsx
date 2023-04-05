import React from 'react';

import useHelper from '../useHelper';

interface IGuessProps {
  guessWord: string;
  secretWord: string | null;
  isCompleted: boolean;
  validate: number[];
}

const GuessRow = ({ guessWord, secretWord, isCompleted, validate }: IGuessProps) => {
  const arr = new Array(5).fill(0);

  const { positionIndex } = useHelper();

  const getColor = (i: number) => {
    if (!isCompleted) {
      return 'invalidated';
    } else if (guessWord[i] === secretWord?.[i]) {
      return 'rightPosition';
    } else if (secretWord?.includes(guessWord[i])) {
      return 'wrongPosition';
    } else return 'notMatched';
  };

  return (
    <div className="containerRow">
      {arr.map((_, i) => {
        return (
          <div
            className={!validate.includes(positionIndex) ? `${getColor(i)} box` : 'box'}
            key={i}
          >
            {guessWord?.[i]}
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(GuessRow);
