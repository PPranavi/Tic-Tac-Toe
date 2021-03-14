import React from 'react';
import './App.css';
import PropTypes from 'prop-types';

export function SquareState({ onClick, symbol }) {
  return (
    <button type="button" className="box" onClick={onClick}>
      <h3>{symbol}</h3>
    </button>
  );
}

SquareState.propTypes = {
  symbol: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const foo = 'foo';
