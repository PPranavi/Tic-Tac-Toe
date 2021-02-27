import React from 'react';
import './App.css';
import { SquareState } from './Square.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function BoardState(props) {
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
        let counter=0;
        for (let a=0; a<9; a++) {
            if (tempBoard[a])
                counter++;
        }
        
        /*if (counter==0) 
            Onext(true);*/
        
        console.log(counter);
        if (winner || tempBoard[i])
            return;
            
        var message = "X";
        if ( Xnext && props.username==props.players['X']) {
            tempBoard[i] = "X";
            message = "X";
            Onext(!Xnext);
            setBoard(tempBoard);
            socket.emit('display', { board:board, message: message, i:i, Xnext:Xnext });
            console.log(props.username);
            return;
        }
        else if ( !Xnext && props.username==props.players['O']){
            tempBoard[i] = "O";
            message = "O";
            Onext(!Xnext);
            setBoard(tempBoard);
            socket.emit('display', { board:board, message: message, i:i, Xnext:Xnext });
            console.log(props.username);
            return;
        }
        
    }
    
    useEffect(() => {
        socket.on('display', (data) => {
            console.log(data);
            const tempBoard = [...data.board];
            const message = data.message;
            tempBoard[data.i] = message;
            setBoard(tempBoard);
            Onext(!data.Xnext);
        });
        
        /*socket.on('restart', (data) => {
            const tempBoard = [...data.board];
            setBoard(tempBoard);
            restartGame();
        });*/
        
    }, []);
    
    function restartGame() {
        /*socket.emit('restart', { board:Array(9).fill(null)}); //new lines
        if (winner==null)
            document.getElementById('showRestartButton').style.display = 'none';*/
        return (
            <div id='showRestartButton'>
                <button onClick={() => setBoard(Array(9).fill(null))}>
                    Restart Game
                </button>
            </div>
        );
    }
    
    return (
        <div>
            <h2>Tic Tac Toe</h2>
            <div class="board">
                {board.map((symbol, i) => (
                    <SquareState symbol={symbol} onClick={() => clickHandler(i)} />
                ))}
            </div>
            <div> Next Turn: Player {Xnext ? 'X' : 'O'} </div>
            <div>
                <p>{winner ? restartGame() : ''}</p>
                <p>{winner ? 'Winner: Player ' + winner : ''}</p>
            </div>
        </div>
    );
}

//<p>{winner ? socket.emit('restart', { board:Array(9).fill(null), Xnext:true}) : ''}</p>
//<p>{winner ? restartGame() : ''}</p>
/*<div id='showRestartButton'> 
                    <button onClick={() => restartGame()}>
                    Restart Game
                    </button>
                </div>*/