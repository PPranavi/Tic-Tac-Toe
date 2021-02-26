import logo from './logo.svg';
import './App.css';
import { BoardState } from './Board.js';
import { useState, useRef, useEffect } from 'react';
import { ListItem } from './ListItem.js';
import io from 'socket.io-client';

const socket = io(); 

function App() {
  const [userList, setUserList] = useState([]);
  const [username, setUsername] = useState("");
  const usernameRef = useRef(null);
  const [showBoard, updateShowBoard] = useState(false);
  
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('login', (data) => {
        setUserList((prevUserList) => [...prevUserList, data.user]);
    });
  }, []);
    
  function onSetUsername () {
    if (usernameRef!=null) {
      const user = usernameRef.current.value;
      setUsername(user);
      setUserList((prevUserList) => [...prevUserList, user]);
      socket.emit('login', { user: user });
      updateShowBoard(true);
    }
  }
  
  return (
    <div>
      <h1>Welcome</h1>
      Enter username here: <input ref = { usernameRef } type="text" />
      <button onClick={onSetUsername}>Login</button>
      {userList.map((user, index) => <ListItem key={index} name={user} />)}
      {showBoard==true ? <BoardState/> : ''}
    </div>
    
  );
}

export default App;
