import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import {useParams} from 'react-router-dom'
import axios from 'axios';

const SendMessage = ({sendMessage}) => {
    const [sendingMsg, setSendingMsg] = useState()
    const [participant, setParticipant] = useState()
    const params = useParams()

    // useEffect(() => {
    //   const url = 'https://localhost:7028/participant/'.concat(params.userid).concat('/').concat(parseInt(params.groupid) + 1)
    //   axios.get(url)
    //   .then(res => {
    //     setParticipant(res.data);
    //   })
    //   .catch(err => console.error(err))
    // }, [])
    
    const handleFormSubmit = (e) =>
        {
          e.preventDefault();
          const groupId = params.groupid
          const userId = params.userid
          sendMessage(userId, groupId, sendingMsg)
          setSendingMsg('')
        }

  return (
    <div>
      <Form onSubmit={handleFormSubmit}>
        <Form.Control value={sendingMsg} onChange={(e) => setSendingMsg(e.target.value)}></Form.Control>
        <Button variant='primary' type='submit'>Send</Button>
      </Form>
    </div>
  )
}

export default SendMessage
