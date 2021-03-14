import React from 'react';
import PropTypes from 'prop-types';

export function DisTable({ player }) {
  return (
    <tr>
      <td>{player[0]}</td>
      <td>{player[1]}</td>
    </tr>
  );
}

DisTable.propTypes = {
  player: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.sring, PropTypes.number])),
};

DisTable.defaultProps = {
  player: ['none', 0],
};

export const foo = 'foo';
