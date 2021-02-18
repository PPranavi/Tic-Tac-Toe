import React from 'react';
import './App.css';
import { SquareState } from './Square.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function BoardState() {
    const [board, setBoard] = useState(Array(9).fill(""));
    const [Xnext, Onext] = useState(true);
    
    function clickHandler(i) {
        const tempBoard = [...board];
        var message = "X";
        if (Xnext) {
            tempBoard[i] = "X";
            message = "X";
        }
        else {
            tempBoard[i] = "O";
            message = "O"
        }
            
        Onext(!Xnext);
        
        setBoard(tempBoard);
        socket.emit('display', { board:board, message: message, i:i });
    }
    
    useEffect(() => {
        // Listening for a chat event emitted by the server. If received, we
        // run the code in the function that is passed in as the second arg
        socket.on('display', (data) => {
            console.log('Chat event received!');
            console.log(data);
            // If the server sends a message (on behalf of another client), then we
            // add it to the list of messages to render it on the UI.
            const tempBoard = [...data.board];
            const message = data.message;
            tempBoard[data.i] = data.message;
            setBoard(tempBoard);
            //setMessages(prevMessages => [...prevMessages, data.message]);
        });
    }, []);
    
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