import React from 'react';
import './App.css';
import { SquareState } from './Square.js';
import { useState } from 'react';

export function BoardState() {
    const [board, setBoard] = useState(Array(9).fill(""));
    const [Xnext, Onext] = useState(true);
    
    function clickHandler(i) {
        const tempBoard = [...board];
        
        if (Xnext)
            tempBoard[i] = "X";
        else
            tempBoard[i] = "O";
        Onext(!Xnext);
        
        setBoard(tempBoard);
    }
    
    return (
        <div>
            <h1>Tic Tac Toe</h1>
            <div class="board">
                {board.map((symbol, i) => (
                    <SquareState symbol={symbol} onClick={() => clickHandler(i)} />
                ))}
            </div>
        </div>
    );
}