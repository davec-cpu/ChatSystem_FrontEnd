import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const DM_SendMessage = ({sendDM, senderid, receiverid}) => {
    const [sendingMsg, setSendingMsg] = useState()
    const handleFormSubmit= (e) => {
        e.preventDefault()
        sendDM(senderid, receiverid, sendingMsg)
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

export default DM_SendMessage
