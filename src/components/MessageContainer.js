import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form } from 'react-bootstrap'
import SendMessage from './SendMessage'
import MessageContextMenu from './MessageContextMenu'

const MessageContainer = ({ groupid, message, setMessage, message2, setMessage2 }) => {
    const [groupMessages, setGroupMessages] = useState()
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [coordinates, setCoordinates] = useState({x: 0, y: 0})

    const handleOnContextMenu = (e) => {
        try {
            e.preventDefault();
            setShowContextMenu(true);
            setCoordinates({
                x: e.clientX,
                y: e.clientY,
            });
        } catch (error) {
            console.log(error);
        }
    }

    const contextMenuItems = [
        {title: 'cut'},
        {title: 'copy'},
        {title: 'paste'},
    ]

    const closeContextMenu = (e) => {
        e.stopPropagation();
        setShowContextMenu(false);
    }
    useEffect(() => {
        console.log(message2);
        axios.get('https://localhost:7028/message/getmsgexpbyconid/'.concat(parseInt(groupid) + 1))
            .then((res) => {
                setMessage([])
                res.data.map((messageinfo) => {
                    const msg = messageinfo.participant.title.concat(' said: ').concat(messageinfo.content)
                    setMessage(messages => [...messages, msg])
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }, [message2])

    const onMessageRightClick = () => {

    }
    return (
        // <div>
        //     {
        //         (message.length != 0) ?
        //             (
        //                 message.map((msg) => {
        //                     return (
        //                         <Button style={{backgroundColor: 'transparent', color: 'black', borderColor: 'transparent'}} onContextMenu={(e) => onMessageRightClick(e, msg.id)}>{msg}</Button>
        //                     )
        //                 })
        //             )
        //             :
        //             (<p>No message yet</p>)
        //     }
        // </div>
        <div>
            {
                (message2.length != 0) ?
                    ( 
                        message2.map((msg) => {
                            return (
                                <div>
                                    {/* {
                                        Object.entries(msg).map(([key, value]) => {
                                            return( */}
                                                
                                                <Button style={{ backgroundColor: 'transparent', color: 'black', borderColor: 'transparent' }} onContextMenu={(e) => handleOnContextMenu(e)}>{msg.senderTitle} said: {msg.content}</Button>
                                            {/* )
                                        })
                                    } */}
                                </div>
                                //
                            )
                        })
                    )
                    :
                    (<p>No message yet</p>)
            }
            {JSON.stringify(coordinates)}
            {showContextMenu 
            ? 
                <MessageContextMenu 
                contextMenuItems = {contextMenuItems}
                coordinates={coordinates}
                />
            :
                console.log("vsvsdvd")}
        </div>

    )
}

export default MessageContainer
