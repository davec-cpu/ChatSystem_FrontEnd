import './App.css';
import GroupChat from './components/GroupChat';
import Home from './components/Home';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import DirectMessage from './components/DirectMessage';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [connection, setConn] = useState();
  const [message, setMessage] = useState(['scdcdsc', 'vsddsv']);
  const [userConnection, setUserConnection] = useState();
  const [directMessage, setDM] = useState([]);
  const [activeUsers, setActiveUsers] = useState({});

  const createConn = async (groupId) => {
    if (connection != null) {
      connection.stop();
    }
    const conn = new HubConnectionBuilder()
      .withUrl('https://localhost:7028/chat')
      .configureLogging(LogLevel.Information)
      .build();

    conn.on("connected", msg => {
      try {
        console.log(msg);
      }
      catch (err) {
        console.log(err);
      }
    })

    conn.on("SendMessage", (a, b) => {
      const msg = a + " said: " + b;
      setMessage(messages => [...messages, msg])
    })


    await conn.start();
    await conn.invoke("JoinAChatRoom", groupId)
    setConn(conn)
  }

  const login = async (userId) => {
    const conn = new HubConnectionBuilder()
      .withUrl('https://localhost:7028/chat')
      .configureLogging(LogLevel.Information)
      .build();

    conn.on("Login", (connectionId, activeUserIds) => {
      //console.log(activeUserIds);
      setActiveUsers(activeUserIds)
    })

    conn.on("UserDisconnected", (activeUserIds) => {
      console.log(activeUserIds);
      console.log("user disconnected");
      setActiveUsers(activeUserIds)
    })

    conn.on("SendDM", (msg, senderId, senderName) =>{
      if (senderId == userId) {
        senderName = "You"
      }
       msg = senderName + " said: " +  msg

      setDM(directMessage => [...directMessage, msg]);
    })
    await conn.start();
    await conn.invoke("Login", userId);
    setUserConnection(conn);
  }
  

  const sendMessage = async (userId, groupId, msg) => {
    try {
      await connection.invoke("SendMessage", parseInt(userId), parseInt(groupId), msg);
    }
    catch (err) {
      console.log(err);
    }
  }

  const sendDM = async (senderid, receiverId, msg) => {
    try {
      await userConnection.invoke("SendDM",parseInt(senderid), parseInt(receiverId), msg)
    } catch (error) {
      console.log(error);
    }
  }
 
  const JoinAChatRoom = async (groupId) => {
    try {
      console.log("JoinAChatRoom");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Login login={login} />}></Route>
        <Route path='/dm/:senderid/:receiverid' element={<DirectMessage sendDM={sendDM} directMessage={directMessage} setDM={setDM}/>}></Route>
        <Route path='/home/:userid' element={<Home createConn={createConn} activeUsers={activeUsers}/>}></Route>
        <Route path='/groupchat/:groupid/:userid' element={<GroupChat sendMessage={sendMessage} message={message} setMessage={setMessage} />}></Route>
      </Routes>

    </div>
  );
}

export default App;
