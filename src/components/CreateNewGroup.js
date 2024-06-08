import axios from 'axios';
import React, { useEffect, useId, useState } from 'react'
import { Button, Form, Container, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router';

const CreateNewGroup = ({ userData, createGroupNotify }) => {
  //console.log(userData);
  const [groupTitle, setGroupTitle] = useState();
  const [userList, setUserList] = useState([]);
  const [participants, setParticipants] = useState({});
  const [conId, setConId] = useState();
  const [isSet, setIsSet] = useState(false);

  const params = useParams()
  const changeHanler = (e) => {
    setGroupTitle(e.target.value);
  }

  const createParticipant = async (conId) => {
    let dataArr = [];
    for (const [key, value] of Object.entries(participants)) {
      const object =
      {
        "userId": parseInt(key),
        "conversationId": parseInt(conId),
        "title": value,
      }
      dataArr.push(object);
    }
    const currUser =
    {
      "userId": parseInt(userData.id),
      "conversationId": parseInt(conId),
      "title": userData.name,
    }
    dataArr.push(currUser);
    axios.post('https://localhost:7028/participant', dataArr)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })

    console.log(dataArr);
  }

  const createGroupUsers = async (conId) => {
    var dataArr = [];
    for (const [key, value] of Object.keys(participants)) {
      const object =
      {
        "userId": parseInt(key),
        "groupId": parseInt(conId - 1)
      }
      dataArr.push(object);
    }
    const userInsertData =
    {
      "userId": parseInt(userData.id),
      "groupId": parseInt(conId - 1)
    }
    dataArr.push(userInsertData);
    axios.post('https://localhost:7028/groupuser', dataArr)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const createGroup = async () => {

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let participantIds = [];
    for (const [key, value] of Object.entries(participants)) {
      participantIds.push(parseInt(key));
    }
    participantIds.push(userData.id);

    axios.post('https://localhost:7028/group', { "title": groupTitle })
      .then((response) => {
        console.log("submitted");
        setConId(response.data)
        createGroupNotify(participantIds, response.data - 1, groupTitle)
        createParticipant(response.data)
        createGroupUsers(response.data)
      })
      .catch((error) => { console.log(error); })
    console.log(participants);
  }
  useEffect(() => {
    if (conId !== null) {
      setIsSet(true);
    }
    axios.get('https://localhost:7028/user/getallexcept/'.concat(params.userid))
      .then((res) => {
        console.log(res.data);
        setUserList(res.data);
      })
      .catch((err) => { console.log(err); })
  }, [conId])

  const onCheckboxChangeHandler = (e) => {
    const targetId = e.target.value
    console.log(targetId);
    if (e.target.checked) {
      participants[targetId] = e.target.dataset.username;
      //setParticipants(participants => [...participants, targetId]);
      setParticipants(participants)
    }
    else {
      for (const [key, value] of Object.entries(participants)) {
        if (key == targetId) {
          console.log(key);
          delete participants[key];
        }
      }
    }
    console.log(participants);
  }
  return (
    <div>
      <Form onSubmit={handleSubmit} className='mt-5'>
        {/* <Col sm={12}> */}
        <Form.Group>
          <Form.Control placeholder='Group title...' type='text' className='d-flex p-2' onChange={changeHanler} />
          <Container className='pt-5'>
            <Row>
              {
                userList.map(data => {
                  return (
                    <Col sm={3}>
                      <Form.Check
                        onChange={onCheckboxChangeHandler}
                        value={data.id}
                        data-username={data.name}
                      /><p>{data.id}: {data.name}</p>
                    </Col>
                  )
                })
              }
            </Row>
          </Container>
          <Button variant='success' type='submit' >Create</Button>
        </Form.Group>
        {/* </Col> */}
      </Form>
    </div>
  )
}

export default CreateNewGroup
