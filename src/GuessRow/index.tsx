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
      return '#121213';
    } else if (guessWord[i] === secretWord?.[i]) {
      return '#538D4E';
    } else if (secretWord?.includes(guessWord[i])) {
      return '#B59F3B';
    } else return '#3A3A3C';
  };

  return (
    <div className="containerRow">
      {arr.map((_, i) => {
        return (
          <div
            className="box"
            style={{
              background: !validate.includes(positionIndex) ? getColor(i) : '#121213',
            }}
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
