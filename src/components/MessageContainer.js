import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form } from 'react-bootstrap'
import SendMessage from './SendMessage'

const MessageContainer = ({groupid, message, setMessage}) => {
    const [groupMessages, setGroupMessages] = useState()

    useEffect(() => {
        axios.get('https://localhost:7028/message/getmsgexpbyconid/'.concat(parseInt(groupid) + 1))
            .then((res) => {
                setMessage([])
                res.data.map((messageinfo) =>{
                    const msg = messageinfo.participant.title.concat(' said: ').concat(messageinfo.content)
                    setMessage(messages => [...messages, msg])
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    return (
        <div>
            {
                (message.length != 0) ?
                    (
                        message.map((msg) => {
                            return (
                                <p>{msg}</p>
                            )
                        })
                    )
                    :
                    (<p>No message yet</p>)
            }
        </div>
    )
}

export default MessageContainer
