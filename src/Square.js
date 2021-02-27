import React from 'react';
import './App.css';

export function SquareState(props) {
    return (
    <button class='box' onClick={props.onClick}>
        <h3>{props.symbol}</h3>
    </button>
   );
}