import React from 'react';
import './App.css';

export function SquareState(props) {
    return (
    <button class='box' onClick={props.onClick}>
        {props.symbol}
    </button>
   );
}