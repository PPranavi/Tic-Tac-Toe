import React from 'react';
import './App.css';
import { SquareState } from './Square.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function BoardState() {
    function claculateWinner(board) {
        const check = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        
        for (let i=0; i<8; i++) {
            const [x,y,z] = check[i];
            if (board[x] && board[x]==board[y] && board[x]==board[z]){
                return board[x];
            }
        }
        let count=0;
        for (let i=0; i<9; i++) {
            if (board[i]) {
                count++;
            }
        }
        if (count==9){
            return 'No winner';
        }
        return null;
    }
    
    const [board, setBoard] = useState(Array(9).fill(""));
    const [Xnext, Onext] = useState(true);
    const winner = claculateWinner(board);
    
    function clickHandler(i) {
        const tempBoard = [...board];
        
        if (winner || tempBoard[i])
            return;
            
        var message = "X";
        if (Xnext) {
            tempBoard[i] = "X";
            message = "X";
        }
        else {
            tempBoard[i] = "O";
            message = "O";
        }
            
        Onext(!Xnext);
        
        setBoard(tempBoard);
        socket.emit('display', { board:board, message: message, i:i, Xnext:Xnext });
    }
    
    useEffect(() => {
        // Listening for a chat event emitted by the server. If received, we
        // run the code in the function that is passed in as the second arg
        socket.on('display', (data) => {
            //console.log('Chat event received!');
            console.log(data);
            // If the server sends a message (on behalf of another client), then we
            // add it to the list of messages to render it on the UI.
            const tempBoard = [...data.board];
            const message = data.message;
            tempBoard[data.i] = message;
            setBoard(tempBoard);
            Onext(!data.Xnext);
            //setMessages(prevMessages => [...prevMessages, data.message]);
        });
    }, []);
    
    function restartGame() {
        return (
            <button onClick={() => setBoard(Array(9).fill(null))}>
                Restart Game
            </button>
        );
    }
    
    if (winner) {
        restartGame();
    }
    
    return (
        <div>
            <h1>Tic Tac Toe</h1>
            <div class="board">
                {board.map((symbol, i) => (
                    <SquareState symbol={symbol} onClick={() => clickHandler(i)} />
                ))}
            </div>
            <div>
                <p>{winner ? restartGame() : ''}</p>
            </div>
        </div>
    );
}