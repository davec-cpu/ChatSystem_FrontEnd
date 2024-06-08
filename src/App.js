import './App.css';
import GroupChat from './components/GroupChat';
import Home from './components/Home';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useEffect, useState } from 'react';
import DirectMessage from './components/DirectMessage';
import CreateNewGroup from './components/CreateNewGroup';
//import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [connection, setConn] = useState();
  const [message, setMessage] = useState(['scdcdsc', 'vsddsv']);
  const [message2, setMessage2] = useState([]);
  const [userConnection, setUserConnection] = useState();
  const [directMessage, setDM] = useState([]);
  const [dm2, setdm2] = useState([]);
  const [activeUsers, setActiveUsers] = useState({});
  const [userData, setUserData] = useState({});

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

    conn.on("SendMessage", (senderTitle, msgContent, msgTempId) => {
      const msg = senderTitle + " said: " + msgContent;
      console.log("msgId: " + msgTempId);
      setMessage(messages => [...messages, msg])
      //mydemo
      const msgObj = {
        "tempId": msgTempId,
        "id": "null",
        "content": msgContent,
        "senderTitle": senderTitle,
      };
      setMessage2(message2 => [...message2, msgObj]);
    })

    conn.on("")

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

    conn.on("SendDM", (msg, senderId, senderName) => {
      if (senderId == userId) {
        senderName = "You"
      }
      msg = senderName + " said: " + msg
      
      setDM(directMessage => [...directMessage, msg]);
    })

    conn.on("CreateGroup", (msg) => {
      window.alert(msg);
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
      await userConnection.invoke("SendDM", parseInt(senderid), parseInt(receiverId), msg)
    } catch (error) {
      console.log(error);
    }
  }

  // const createGroup = async(groupTitle) => {
  //   try {
  //     await userConnection.invoke("SendDM",parseInt(senderid), parseInt(receiverId), msg)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  const createGroupNotify = async (participantArr, groupId, groupTitle) => {
    try {
      console.log(participantArr);
      console.log(groupId);
      await userConnection.invoke("CreateGroup", participantArr, groupId, groupTitle)
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
        <Route path='/dm/:senderid/:receiverid' element={<DirectMessage sendDM={sendDM} directMessage={directMessage} setDM={setDM} setdm2={setdm2} dm2={dm2}/>}></Route>
        <Route path='/home/:userid' element={<Home createConn={createConn} activeUsers={activeUsers} setUserData={setUserData} userData={userData} />}></Route>
        <Route path='/groupchat/:groupid/:userid' element={<GroupChat sendMessage={sendMessage} message={message} setMessage={setMessage} message2={message2} setMessage2={setMessage2}/>}></Route>
        <Route path='/groupchat/new/:userid' element={<CreateNewGroup userData={userData} createGroupNotify={createGroupNotify} />}></Route>
      </Routes>

    </div>
  );
}

export default App;
