import logo from './logo.svg';
import './App.css';
import { BoardState, updatePlayers } from './Board.js';
import { useState, useRef, useEffect } from 'react';
import { ListItem } from './ListItem.js';
import io from 'socket.io-client';

const socket = io(); 

function App() {
  const [userList, setUserList] = useState(Array(0));
  const [username, setUsername] = useState('');
  const usernameRef = useRef('');
  const [showBoard, updateShowBoard] = useState(false);
  const [players, setPlayers] = useState({ 'X':'', 'O':'', 'Spectators':[]});
  
  function onSetUsername () {
    if (usernameRef!=null) {
      const user = usernameRef.current.value;
      setUsername(user);
      updateShowBoard(true);
      
      setUserList(prevUserList => [...prevUserList, user]);
      socket.emit('login', { user: user } );
      updatePlayers(user);
      
      console.log(user);
      document.getElementById('login').style.display = 'none';
    }
  }
  
  function updatePlayers(user){
    const tempDict = {...players};
    if (tempDict['X']=='') {
      tempDict['X']=user;
    }
    else if (tempDict['O']=='') {
      tempDict['O']=user;
    }
    else {
      tempDict['Spectators'].push(user);
    }
    setPlayers(tempDict);
    console.log(tempDict);
    socket.emit('update', tempDict);
    }
  
  useEffect(() => {
    socket.on('login', (data) => {
      setUserList(prevUserList => [...prevUserList, data.user]);
    });
   
    socket.on('update', (data) => {
      console.log(data);
      setPlayers(data);
    });
  }, []);
  
  return (
    <div>
      <h1>Welcome</h1>
      <div id='login'>
        Enter username here: <input ref = { usernameRef } type="text" />
        <button onClick={onSetUsername}>Login</button>
      </div>
      <div>
        {usernameRef==null ? 'No users in the game yet!' : 'Current user: ' +  username }
      </div>
      {userList.map((user, index) => <ListItem index={index} name={user} />)}
      {showBoard==true ? <BoardState username={username} players={players} /> : ''}
    </div>
    
  );
}

export default App;
/*TODO: {%if showLogin==true ? */