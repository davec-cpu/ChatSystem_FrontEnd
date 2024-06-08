import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import { Button, Form } from 'react-bootstrap'
import SendMessage from './SendMessage'
import MessageContainer from './MessageContainer'

const GroupChat = ({sendMessage, message, setMessage, message2, setMessage2}) => {
    const params = useParams()


  return (
    <div>
      <h4 className='mx-3'>GroupChat no.{params.groupid}</h4>
      <MessageContainer groupid = {params.groupid} message={message} setMessage={setMessage} message2={message2} setMessage2={setMessage2}  />
      <SendMessage sendMessage = {sendMessage}></SendMessage>
    </div>
  )
}

export default GroupChat
