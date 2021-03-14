import React from 'react';
import PropTypes from 'prop-types';

export function WatchListItem({ name, index }) {
  return (
    <div>
      <p>{index === 0 ? `Player X: ${name}` : ''}</p>
      <p>{index === 1 ? `Player O: ${name}` : ''}</p>
      <p>{index >= 2 ? `Spectator: ${name}` : ''}</p>
    </div>
  );
}

WatchListItem.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export const foo = 'foo';
