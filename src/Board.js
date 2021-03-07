import React from 'react';
import './App.css';
import { SquareState } from './Square.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function BoardState(props) {
    //functionality to check for winner; references resource from project specs for this code block
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
    
    function updateScore() {
        const win = claculateWinner(board);
        if (win=='X') {
            console.log("hereX");
            socket.emit('winner', { winner: props.players['X']});
            return;
        }
        else if (win=='O') {
            console.log("hereO");
            socket.emit('winner', { winner: props.players['O']});
            return;
        }
    }
    //functionality to update board only when player x or player o click on a square
    function clickHandler(i) {
        const tempBoard = [...board];
        let counter=0;
        for (let a=0; a<9; a++) {
            if (tempBoard[a])
                counter++;
        }
        
        /*if (counter==0) 
            Onext(true);*/
        
        /*if (winner=='X') {
            socket.emit('winner', { winner: props.players['X']});
        }
        else if (winner=='O') {
            socket.emit('winner', { winner: props.players['O']});
        }*/
        
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
    
    //functionality to send all board information to all users whoa re viewing the same game
    useEffect(() => {
        socket.on('display', (data) => {
            console.log(data);
            const tempBoard = [...data.board];
            const message = data.message;
            tempBoard[data.i] = message;
            setBoard(tempBoard);
            Onext(!data.Xnext);
        });
        
        socket.on('restart', (data) => {
            setBoard(data.board);
            //restartGame();
        });
        
    }, []);
    
    //functionality to restart the game when the button is clicked; makes sure that only player x and player o can see and ckick the button
    function restartGame() {
       /*socket.emit('restart', { board:Array(9).fill(null)}); //new lines
        if (winner==null)
            document.getElementById('showRestartButton').style.display = 'none';*/
        if (props.username!=props.players['X'] && props.username!=props.players['O']){
            document.getElementById('restart').style.display = 'none';
        }
        return (
            <div id='showRestartButton'>
                <button onClick={() => restartButton()}>
                    Restart Game
                </button>
            </div>
        );
    }
    
    function restartButton() {
        const tempBoard = Array(9).fill("");
        setBoard(tempBoard);
        socket.emit('restart', {board:tempBoard});
    }
    
    return (
        <div>
            <div class="board">
                {board.map((symbol, i) => (
                    <SquareState symbol={symbol} onClick={() => clickHandler(i)} />
                ))}
            </div>
            <div class='h2'> Next Turn: Player {Xnext ? 'X' : 'O'} </div>
            <div>
                <h1>{winner ? 'Winner: Player ' + winner + '!': ''}</h1>
                <p>{winner ? updateScore() : ''}</p>
                <p id='restart'>{winner ? restartGame() : ''}</p>
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