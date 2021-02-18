import React from 'react';
import './App.css';

export function SquareState(props) {
    return (
    //<div class="box">
    <button onClick={props.onClick}>
        {props.symbol}
    </button>
    //</div>
    );
}