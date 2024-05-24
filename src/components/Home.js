import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';


const Home = ({ createConn, activeUsers }) => {

  const [userData, setUserData] = useState({});
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const params = useParams()

  useEffect(() => {
    const fetchUser = async () => {
      axios.get('https://localhost:7028/'.concat(params.userid))
        .then(res => {
          setUserData(res.data);
        })
        .catch(err => console.error(err))
    }

    const fetchUserGroup = async () => {
      axios.get('https://localhost:7028/user/group/user/'.concat(params.userid))
        .then(res => {
          setGroups(res.data);
        })
        .catch(err => console.error(err))
    }

    const fetchAllUsers = async () => {
      axios.get('https://localhost:7028/user/getallexcept/'.concat(params.userid))
        .then(res => {
          setUsers(res.data);
        })
        .catch(err => console.error(err))
    }

    const mainFetch = async () => {
      await fetchUser();
      await fetchUserGroup();
      await fetchAllUsers();
    }

    mainFetch();
  }, [activeUsers])


  const groupOnClickHandler = (groupId) => {
    try {
      navigate('/groupchat/'.concat(groupId).concat('/').concat(params.userid))
      // const conn = new HubConnectionBuilder()
      //   .withUrl('https://localhost:7028/chat')
      //   .configureLogging(LogLevel.Information)
      //   .build();

      // conn.on("abcxyz", msg => {
      //   try {
      //     console.log(msg);
      //   }
      //   catch (err) {
      //     console.log(err);
      //   }
      createConn(groupId)
      //JoinAChatRoom(id)
    } catch (error) {
      console.log(error);
    }
  }

  const renderStyle = (userId) => {
    const userIdObj = JSON.parse(activeUsers)
    if (Object.values(userIdObj).includes(userId.toString())) {
      return true;
    }
    else {
      return false;
    }
  }
  const userOnClickHandler = (receiverid) => {
    navigate('/dm/'.concat(params.userid).concat('/').concat(receiverid))
  }
  return (
    <div style={{ height: "100vh" }}>
      <h1 className='pt-5'>Welcome, {userData.name}</h1>
      <div>
        {
          groups.map(group => {
            return (
              <div>
                <Button className='my-2' value={group.id} onClick={() => groupOnClickHandler(group.id)} key={group.id}>
                  <p key={group.id}>{group.id}: {group.title} - {group.thumbnail}</p>
                </Button>
              </div>
            )
          })
        }
        {
          users.map((user) => {
            const style = renderStyle(user.id)
            return (
              <div>
                <Button className='my-2' style={{ backgroundColor: style  ? "blue" : "#9b969c" }}  value={user.id} onClick={() => userOnClickHandler(user.id)} key={user.id}>
                  <p>{user.name}</p>
                </Button>
                {style ? <small style={{marginLeft: '5px'}}>online</small> : <small></small>}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home
