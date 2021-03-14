// import logo from "./logo.svg";
// import React from 'react';
import {
  useState, useRef, useEffect, React,
} from 'react';
import io from 'socket.io-client';
import './App.css';
import { BoardState } from './Board.js';
// import { ListItem } from "./ListItem.js";
import { DisTable } from './DisplayTable.js';
import { WatchListItem } from './WatchListItem.js';

const socket = io();

function App() {
  const [userList, setUserList] = useState(Array(0));
  const [username, setUsername] = useState('');
  const usernameRef = useRef('');
  const [showBoard, updateShowBoard] = useState(false);
  const [players, setPlayers] = useState({ X: '', O: '', Spectators: [] });
  const [showHide, setShowHide] = useState(false);
  const [userHistoryList, setUserHistoryList] = useState([]);
  const [userRankList, setUserRankList] = useState([]);
  const [userHistoryDict, setUserHistoryDict] = useState([]);

  // functionality to update who player x, player o, and spectators are
  function updatePlayers(user) {
    const tempDict = { ...players };
    if (tempDict.X === '') {
      tempDict.X = user;
    } else if (tempDict.O === '') {
      tempDict.O = user;
    } else {
      tempDict.Spectators.push(user);
    }
    setPlayers(tempDict);
    // console.log(tempDict);
    socket.emit('update', tempDict);
  }

  // functionality to display board only after a user enters their username
  function onSetUsername() {
    if (usernameRef != null) {
      const user = usernameRef.current.value;
      setUsername(user);
      updateShowBoard(true);

      // setUserList(prevUserList => [...prevUserList, user]);
      socket.emit('login', { user });
      // setUserHistoryList(prevUserList => [...prevUserList, user]);
      updatePlayers(user);

      // console.log(user);
      document.getElementById('login').style.display = 'none';
    }
  }

  function onShowHide() {
    setShowHide((prevShow) => !prevShow);
  }

  function displayLeaderboard() {
    /* return (
      <div>
        {userHistoryList.map((item, index) => <ListItem key={index} name={item} />)}
      </div>
    ); */
    // console.log('displaying leaderboard');
    return (
      <div className="table">
        <table>
          <thead>
            <tr>
              <th colSpan="2">LeaderBoard</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Username</td>
              <td>Rank</td>
            </tr>
            {userHistoryDict.map((item) => (
              // {userHistoryDict.map((item, index) => (
              // <DisTable key={index} player={item} />
              <DisTable player={item} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // functionality to pass information to all other users who are viewing the same game
  useEffect(() => {
    socket.on('start', (data) => {
      setUserHistoryList(data.users);
      setUserRankList(data.ranks);
      setUserHistoryDict(data.leaderboard);
      // console.log(data.leaderboard);
    });

    socket.on('login', (data) => {
      // setUserList((prevUserList) => [...prevUserList, data.user]);
      // console.log('logging in');
      setUserList(data.user);
      setUserHistoryList(data.users);
      setUserRankList(data.ranks);
      setUserHistoryDict(data.leaderboard);
      // console.log(data.leaderboard);
      // console.log(userHistoryList);
      // console.log(userRankList);
    });

    socket.on('update', (data) => {
      // console.log(data);
      setPlayers(data);
    });

    socket.on('winner', (data) => {
      setUserHistoryDict(data.leaderboard);
      // console.log(data.leaderboard);
    });
  }, [userHistoryList, userRankList]);

  return (
    <div className="background">
      <h1>Tic Tac Toe!</h1>
      <div id="login">
        <h2>To begin, you must enter your username!</h2>
        Enter your username:
        {' '}
        <input ref={usernameRef} type="text" />
        <button type="submit" onClick={onSetUsername}>
          Login
        </button>
      </div>
      <div>
        <div className="h2">
          {showBoard === true ? `Current user: ${username}` : ''}
          {userList.map((user, index) => (
            <WatchListItem index={index} name={user} />
          ))}
        </div>
        <div className="center">
          {showBoard === true ? (
            <BoardState username={username} players={players} />
          ) : (
            ''
          )}
        </div>
      </div>
      <div>
        <button type="button" onClick={() => onShowHide()}>
          Leaderboard
        </button>
      </div>
      {showHide === true ? displayLeaderboard() : null}
    </div>
  );
}

export default App;
/* TODO: {%if showLogin==true ?  */
