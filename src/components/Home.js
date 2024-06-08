import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router';
import { Button } from 'react-bootstrap';


const Home = ({ createConn, activeUsers, setUserData, userData }) => {

  //const [userData, setUserData] = useState({});
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
          let filteredArray = res.data.filter(value => value != null);

          setGroups(filteredArray);
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

  const deleteParticipants = (groupId) => {
    try {
      axios.delete('https://localhost:7028/participant/delbycon/'.concat(groupId + 1))
        .then((response) => {
          console.log("Deleted successfully");
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        })
    }
    catch (err) {
      console.log(err);
    }
  }

  const deleteGroupUser = (groupId) => {
    try{
      axios.delete('https://localhost:7028/groupuser/delbycon/'.concat(groupId + 1))
      .then((response) => {
        console.log("Deleted successfully");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
    }
    catch (err) {
      console.log(err);
    }
  }
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
  const addNewGroupHandler = () => {
    navigate('/groupchat/new/'.concat(params.userid))
  }

  const removeClickHandler = (groupId) => {
    groupId = parseInt(groupId)
    
    axios.delete('https://localhost:7028/group/'.concat(groupId))
      .then((response) => {
        console.log("Deleted successfully");
        groupId = groupId + 1 
        deleteParticipants(groupId);
        deleteGroupUser(groupId);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })

      // deleteParticipants(groupId);
      // deleteGroupUser(groupId);
  }
  return (
    <div style={{ height: "100vh" }}>
      <h1 className='pt-5'>Welcome, {userData.name} <Button className='pleft' style={{ backgroundColor: "blue" }} onClick={addNewGroupHandler}>Add new group</Button></h1>
      <div className='ps-5' style={{ paddingRight: "55px" }}></div>
      <div>
        {
          (groups.length !== 0) ? (groups.map(group => {
            return (
              <div>
                <Button className='my-2' value={group.id} onClick={() => groupOnClickHandler(group.id)} key={group.id}>
                  <p key={group.id}>{group.id}: {group.title}</p>
                </Button>
                <Button variant='danger' onClick={() => removeClickHandler(group.id)}>Remove this group</Button>
              </div>
            )
          }))
          : (<p>No group yet</p>)
        }
        {
          users.map((user) => {
            const style = renderStyle(user.id)
            
            return (
              <div>
                <Button className='my-2' style={{ backgroundColor: style ? "blue" : "#9b969c" }} value={user.id} onClick={() => userOnClickHandler(user.id)} key={user.id}>
                  <p>{user.name}</p>
                </Button>
                {style ? <small style={{ marginLeft: '5px' }}>online</small> : <small></small>}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home
