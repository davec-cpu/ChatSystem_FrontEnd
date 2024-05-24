import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import { Button, Form } from 'react-bootstrap'
import SendMessage from './SendMessage'
import MessageContainer from './MessageContainer'

const GroupChat = ({sendMessage, message, setMessage}) => {
    const params = useParams()


  return (
    <div>
      <h4 className='mx-3'>GroupChat number {params.groupid}</h4>

      <MessageContainer groupid = {params.groupid} message={message} setMessage={setMessage}  />
      <SendMessage sendMessage = {sendMessage}></SendMessage>
    </div>
  )
}

export default GroupChat
